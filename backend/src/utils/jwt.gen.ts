import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../types";

export const generateJwt = async (payload: JwtUserPayload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:"1d"})
}

export const verifyJwt = async (token:string)=>{
    return jwt.verify(token,process.env.JWT_SECRET!) as JwtUserPayload
}
