"use client"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CInput } from "@/app/components";
import { FRONTEND_URLS } from "@/app/constants";
import { ForgotPasswordSchema, type ForgotPasswordSchemaType } from "@/app/schema";
import { useForgotPassword } from "@/app/hooks";

export default function ForgotPasswordPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    const { mutate: forgotPassword, isPending } = useForgotPassword();

    return (
        <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md px-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                        I
                    </div>
                    <span className="text-lg font-semibold tracking-tighter heading">InvoGen</span>
                </div>

                <h1 className="text-4xl font-semibold mb-2">Reset password</h1>
                <p className="text-zinc-400 mb-8">Enter your email and check the demo email logs for your reset link.</p>

                <form onSubmit={handleSubmit((data) => forgotPassword(data))}>
                    <div className="space-y-6">
                        <CInput<ForgotPasswordSchemaType>
                            label="Email Address"
                            name="email"
                            register={register}
                            errors={errors}
                            inputType="formInput"
                            variant="auth"
                        />

                        <button disabled={isPending} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-semibold rounded-3xl text-lg transition-transform active:scale-[0.98]">
                            {isPending ? "Sending reset link..." : "Send reset link"}
                        </button>

                        <div className="text-center text-zinc-400 text-sm mt-6">
                            Remembered it?{" "}
                            <Link href={FRONTEND_URLS.LOGIN} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
