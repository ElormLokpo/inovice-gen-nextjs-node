import { eq } from "drizzle-orm";
import { UserModel } from "../models";
import { db } from "../db";
import { CustomError, type IAuthRequestType, type ILoginType, type JwtUserPayload} from "../types";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateJwt } from "../utils/jwt.gen";
import { createPlainToken, hashToken } from "../utils/tokens";
import { sendDemoMail } from "./mail.service";


const userEmailExists = async (email:string)=> await db.select().from(UserModel).where(eq(UserModel.email,email.toLowerCase()))

const sanitizeUser =  (user:any)=>{
    const {
        passwordHash,
        emailVerificationTokenHash,
        passwordResetTokenHash,
        passwordResetExpiresAt,
        ...rest
    } = user;
    return rest;
}

const userJwtPayload = (user: typeof UserModel.$inferSelect): JwtUserPayload => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    emailVerified: Boolean(user.emailVerifiedAt),
});

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";

const sendConfirmationEmail = async (email:string, token:string) => {
    const confirmationUrl = `${appUrl()}/confirm-email?token=${token}`;
    await sendDemoMail({
        to: email,
        subject: "Confirm your invoice app email",
        text: `Confirm your email by opening this link: ${confirmationUrl}`,
    });
};

export const RegisterUserService = async (authData:IAuthRequestType)=>{
    const exists = await userEmailExists(authData.email);
    
    if(exists.length > 0){
        return new CustomError("email already exists",400)
    }

    const hashedPassword = await hashPassword(authData.password);
    const confirmationToken = createPlainToken();

    const dataToInsert : typeof UserModel.$inferInsert = {
        email:authData.email.toLowerCase(),
        passwordHash:hashedPassword,
        fullName:authData.fullName,
        role: authData.role === "guest" ? "guest" : "user",
        emailVerificationTokenHash: hashToken(confirmationToken),
    };

   
    const [createdUser] = await db.insert(UserModel).values(dataToInsert).returning();
    if (!createdUser) return new CustomError("Unable to create user", 500);

    await sendConfirmationEmail(createdUser.email, confirmationToken);

    return {
        user: sanitizeUser(createdUser),
        message: "Registration successful. Check the demo email logs for your confirmation link.",
    };
};


export const LoginUserService = async (authData:ILoginType)=>{
    const user = await userEmailExists(authData.email);

    if(user.length === 0){
        return new CustomError("User not found",404)
    }

    const isPasswordValid = await comparePassword(authData.password,user[0]!.passwordHash);

    if(!isPasswordValid){
        return new CustomError("Invalid password",401)
    }

    if (!user[0]!.emailVerifiedAt) {
        return new CustomError("Please confirm your email before logging in", 403);
    }

    const jwtToken = await generateJwt(userJwtPayload(user[0]!))

    return {
        token: jwtToken,
        user: sanitizeUser(user[0]!),
    };
}

export const ConfirmEmailService = async (token:string)=>{
    const tokenHash = hashToken(token);
    const [user] = await db.select().from(UserModel).where(eq(UserModel.emailVerificationTokenHash, tokenHash));

    if (!user) {
        return new CustomError("Invalid confirmation token", 400);
    }

    const [updatedUser] = await db
        .update(UserModel)
        .set({
            emailVerifiedAt: new Date(),
            emailVerificationTokenHash: null,
            updatedAt: new Date(),
        })
        .where(eq(UserModel.id, user.id))
        .returning();

    return sanitizeUser(updatedUser);
}

export const ResendConfirmationService = async (email:string)=>{
    const [user] = await userEmailExists(email);

    if (!user) {
        return new CustomError("User not found", 404);
    }

    if (user.emailVerifiedAt) {
        return new CustomError("Email is already confirmed", 400);
    }

    const confirmationToken = createPlainToken();
    await db
        .update(UserModel)
        .set({
            emailVerificationTokenHash: hashToken(confirmationToken),
            updatedAt: new Date(),
        })
        .where(eq(UserModel.id, user.id));

    await sendConfirmationEmail(user.email, confirmationToken);

    return { message: "Confirmation email sent. Check the demo email logs." };
}

export const ForgotPasswordService = async (email:string)=>{
    const [user] = await userEmailExists(email);

    if (!user) {
        return { message: "If that email exists, a reset link has been sent." };
    }

    const resetToken = createPlainToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await db
        .update(UserModel)
        .set({
            passwordResetTokenHash: hashToken(resetToken),
            passwordResetExpiresAt: expiresAt,
            updatedAt: new Date(),
        })
        .where(eq(UserModel.id, user.id));

    const resetUrl = `${appUrl()}/reset-password?token=${resetToken}`;
    await sendDemoMail({
        to: user.email,
        subject: "Reset your invoice app password",
        text: `Reset your password by opening this link: ${resetUrl}`,
    });

    return { message: "If that email exists, a reset link has been sent." };
}

export const ResetPasswordService = async (token:string, password:string)=>{
    const [user] = await db
        .select()
        .from(UserModel)
        .where(eq(UserModel.passwordResetTokenHash, hashToken(token)));

    if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
        return new CustomError("Invalid or expired reset token", 400);
    }

    const [updatedUser] = await db
        .update(UserModel)
        .set({
            passwordHash: await hashPassword(password),
            passwordResetTokenHash: null,
            passwordResetExpiresAt: null,
            updatedAt: new Date(),
        })
        .where(eq(UserModel.id, user.id))
        .returning();

    return sanitizeUser(updatedUser);
}
