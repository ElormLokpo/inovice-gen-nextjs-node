
import type { Request } from "express";

export interface IAuthRequestType {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
}

export  interface ILoginType {
    email:string;
    password:string;
}

export interface IResponseUser {
    id:string;
    email: string;
    fullName: string;
    role: UserRole;
    emailVerifiedAt: Date | null;
}

export class CustomError extends Error{
    constructor(
        message:string,
        public statusCode:number
    ){
        super(message)
    }
}



export interface IResponse{
    success:boolean;
    message:string;
    data?:object;
}

export type UserRole = "admin" | "user" | "guest";

export interface JwtUserPayload {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtUserPayload;
}
