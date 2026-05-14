import { jwtDecode } from "jwt-decode";

interface IJwtPayload{
    fullName:string, 
    id:string, 
    role:"admin" | "user" | "guest", 
    email:string,
    emailVerified:boolean
}

export const decodeJwt = (token: string):IJwtPayload => jwtDecode(token)

