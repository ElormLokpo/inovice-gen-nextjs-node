"use client"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/app/schema";
import { useRegister } from "@/app/hooks";
import { CInput } from "@/app/components";
import { FRONTEND_URLS } from "@/app/constants";

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        }
    })

    const { mutate: handleRegister, isPending } = useRegister();

    const submitHandler = async (data: RegisterSchemaType) => {
        handleRegister(data)
    }

    return (
        <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md px-8">

                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                            I             
                    </div>
                    <span className="text-lg font-semibold tracking-tighter heading">InvoGen</span>
                </div>

                <h1 className="text-4xl font-semibold mb-2">Welcome</h1>
                <p className="text-zinc-400 mb-8">Sign up to continue to your workspace</p>

                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="space-y-6">

                        <div>
                          
                            <CInput<RegisterSchemaType>
                                label="Full Name"
                                name="fullName"
                                register={register}
                                errors={errors}
                                inputType="formInput"
                                variant="auth"
                            />
                        </div>

                         <div>
                          
                            <CInput<RegisterSchemaType>
                                label="Email Address"
                                name="email"
                                register={register}
                                errors={errors}
                                inputType="formInput"
                                variant="auth"
                            />
                        </div>


                        <div>
                           
                            <CInput<RegisterSchemaType>
                                label="Password"
                                name="password"
                                register={register}
                                errors={errors}
                                inputType="formInput"
                                type="password"
                                variant="auth"
                            />
                        </div>

                      
                        <button disabled={isPending} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-semibold rounded-3xl text-lg transition-transform active:scale-[0.98]">
                            {isPending ? "Creating account..." : "Sign Up"}
                        </button>

                        <div className="text-center text-zinc-400 text-sm mt-6">
                            Already have an account?{" "}
                            <Link href={FRONTEND_URLS.LOGIN} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                Sign In
                            </Link>
                        </div>
                    </div> 
                </form>
            </div>
        </div>
    );
}
