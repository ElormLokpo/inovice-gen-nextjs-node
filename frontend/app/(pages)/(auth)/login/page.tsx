"use client"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/app/schema";
import { useLogin } from "@/app/hooks/useAuth";
import { CInput } from "@/app/components/shared/input";
import { FRONTEND_URLS } from "@/app/constants";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const { mutate: handleLogin, isPending, isError } = useLogin();

    const submitHandler = async (data: LoginSchemaType) => {
        console.log("isError", isError)
        handleLogin(data)
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

                <h1 className="text-4xl font-semibold mb-2">Welcome back</h1>
                <p className="text-zinc-400 mb-8">Sign in to continue to your workspace</p>

                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="space-y-6">

                        <div>
                          
                            <CInput<LoginSchemaType>
                                label="Email Address"
                                name="email"
                                register={register}
                                errors={errors}
                                inputType="form"
                                variant="auth"
                            />
                        </div>


                        <div>
                           
                            <CInput<LoginSchemaType>
                                label="Password"
                                name="password"
                                register={register}
                                errors={errors}
                                inputType="form"
                                type="password"
                                variant="auth"
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                />
                                <span className="group-hover:text-zinc-200 transition-colors">Remember me</span>
                            </label>
                            <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-3xl text-lg transition-transform active:scale-[0.98]">
                            Sign In
                        </button>

                        <div className="text-center text-zinc-400 text-sm mt-6">
                            Don&apos;t have an account?{" "}
                            <Link href={FRONTEND_URLS.REGISTER} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                Sign up free
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}