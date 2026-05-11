import type { NextFunction, Request, Response } from "express";
import {
    ConfirmEmailService,
    ForgotPasswordService,
    LoginUserService,
    RegisterUserService,
    ResendConfirmationService,
    ResetPasswordService,
} from "../services/auth.service";
import { CustomError, type IAuthRequestType, type ILoginType } from "../types";


export const RegisterUserController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = await RegisterUserService(req.body as IAuthRequestType);

        if(user instanceof CustomError){
            next(user)
            return;
        }

        res.status(201).json({success:true,data:user});
    } catch (error) {
        next(error);
    }
}



export const LoginUserController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const user:any = await LoginUserService(req.body as ILoginType);

        if(user instanceof CustomError){
            next(user)
            return;
        }

        res.status(200).json({success:true,data:user});
    
    
    } catch (error) {
        next(error);
    }
}

export const ConfirmEmailController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = String(req.query.token ?? req.body.token ?? "");

        if (!token) {
            next(new CustomError("Confirmation token is required", 400));
            return;
        }

        const user = await ConfirmEmailService(token);

        if(user instanceof CustomError){
            next(user)
            return;
        }

        res.status(200).json({success:true,data:user});
    } catch (error) {
        next(error);
    }
}

export const ResendConfirmationController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await ResendConfirmationService(String(req.body.email ?? ""));

        if(result instanceof CustomError){
            next(result)
            return;
        }

        res.status(200).json({success:true,data:result});
    } catch (error) {
        next(error);
    }
}

export const ForgotPasswordController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await ForgotPasswordService(String(req.body.email ?? ""));
        res.status(200).json({success:true,data:result});
    } catch (error) {
        next(error);
    }
}

export const ResetPasswordController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = String(req.body.token ?? "");
        const password = String(req.body.password ?? "");

        if (!token || !password) {
            next(new CustomError("Token and password are required", 400));
            return;
        }

        const user = await ResetPasswordService(token, password);

        if(user instanceof CustomError){
            next(user)
            return;
        }

        res.status(200).json({success:true,data:user});
    } catch (error) {
        next(error);
    }
}

