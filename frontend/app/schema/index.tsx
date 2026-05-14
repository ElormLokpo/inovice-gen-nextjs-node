import z from "zod"


export const LoginSchema = z.object({
    email: z.email("Enter Valid Email"),
    password: z.string().min(4, "Enter Password"),
})

export type LoginSchemaType = z.infer<typeof LoginSchema>


export const RegisterSchema = z.object({
    email: z.email("Enter Valid Email"),
    password: z.string().min(4, "Enter Password"),
    fullName: z.string().min(2, "Enter Full Name"),
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>

export const ForgotPasswordSchema = z.object({
    email: z.email("Enter Valid Email"),
})

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(4, "Enter Password"),
    confirmPassword: z.string().min(4, "Confirm Password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>
