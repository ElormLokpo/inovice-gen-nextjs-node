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


export const AddBusinessSchema = z.object({
 
  name: z.string().min(1, "Business name is required"),
  
  logoUrl: z.url("Invalid logo URL").or(z.literal("")),
  
  email: z.email("Invalid email address").nullable().or(z.literal("")),
  
  phone: z.string().nullable().or(z.literal("")),
  
  address: z.string().nullable().or(z.literal("")),
  city: z.string().nullable().or(z.literal("")),
  country: z.string().nullable().or(z.literal("")),
  taxId: z.string().nullable().or(z.literal("")),
  
 
  currency: z.string().min(1, "Currency is required"),
});


export type AddBusinessSchemaType = z.infer<typeof AddBusinessSchema>;
