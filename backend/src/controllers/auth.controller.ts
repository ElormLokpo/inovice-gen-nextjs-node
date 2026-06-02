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
import { handleResult } from "../utils/helper.functions";

export const RegisterUserController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
      
        handleResult(res, next, await RegisterUserService(req.body as IAuthRequestType), 201);
    } catch (error) {
        next(error);
    }
}



export const LoginUserController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        handleResult(res, next, await LoginUserService(req.body as ILoginType));
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

        handleResult(res, next, await ConfirmEmailService(token));
    } catch (error) {
        next(error);
    }
}

export const ResendConfirmationController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        handleResult(res, next, await ResendConfirmationService(String(req.body.email ?? "")));
    } catch (error) {
        next(error);
    }
}

export const ForgotPasswordController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
     
        handleResult(res, next,  await ForgotPasswordService(String(req.body.email ?? "")));
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

        handleResult(res, next, await ResetPasswordService(token, password));
    } catch (error) {
        next(error);
    }
}

