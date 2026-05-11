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