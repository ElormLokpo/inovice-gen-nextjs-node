import type {Request, Response, NextFunction } from "express";
import { CustomError } from "../types";


export const ErrorMiddleware = (err:Error | CustomError, req:Request, res:Response, next:NextFunction)=>{

    console.log("middleware run")

    if(err instanceof CustomError){
        return res.status(err.statusCode).json({success:false, message:err.message})
    }

    return res.status(500).json({success:false, message:err.message})
}