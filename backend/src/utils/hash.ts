import bcrypt from "bcrypt"


export const hashPassword = async (password:string)=> await bcrypt.hash(String(password),await bcrypt.genSalt(10)) 

export const comparePassword = async (password:string,hash:string)=> await bcrypt.compare(String(password),hash)
    
