import { jwtDecode } from "jwt-decode";

interface IJwtPayload{
    fullName:string, 
    id:string, 
    role:string, 
    email:string
}

export const decodeJwt = (token: string):IJwtPayload => jwtDecode(token)

