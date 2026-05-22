"use client"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CInput } from "@/app/components/shared/input";
import { FRONTEND_URLS } from "@/app/constants";
import { ResetPasswordSchema, type ResetPasswordSchemaType } from "@/app/schema";
import { useResetPassword } from "@/app/hooks/useAuth";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            token,
            password: "",
            confirmPassword: "",
        }
    })

    const { mutate: resetPassword, isPending } = useResetPassword();

    useEffect(() => {
        setValue("token", token);
    }, [setValue, token])

    return (
        <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md px-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                        I
                    </div>
                    <span className="text-lg font-semibold tracking-tighter heading">InvoGen</span>
                </div>

                <h1 className="text-4xl font-semibold mb-2">New password</h1>
                <p className="text-zinc-400 mb-8">
                    {token ? "Your reset link has been verified locally. Choose a new password for your workspace." : "Paste the token from your reset email and choose a new password."}
                </p>

                <form onSubmit={handleSubmit((data) => resetPassword(data))}>
                    <div className="space-y-6">
                        {token ? (
                            <input type="hidden" {...register("token")} />
                        ) : (
                            <CInput<ResetPasswordSchemaType>
                                label="Reset Token"
                                name="token"
                                register={register}
                                errors={errors}
                                inputType="formInput"
                                variant="auth"
                                placeholder="Paste the token from your email"
                            />
                        )}

                        <CInput<ResetPasswordSchemaType>
                            label="New Password"
                            name="password"
                            register={register}
                            errors={errors}
                            inputType="formInput"
                            type="password"
                            variant="auth"
                        />

                        <CInput<ResetPasswordSchemaType>
                            label="Confirm Password"
                            name="confirmPassword"
                            register={register}
                            errors={errors}
                            inputType="formInput"
                            type="password"
                            variant="auth"
                        />

                        <button disabled={isPending} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-semibold rounded-3xl text-lg transition-transform active:scale-[0.98]">
                            {isPending ? "Resetting password..." : "Reset password"}
                        </button>

                        <div className="text-center text-zinc-400 text-sm mt-6">
                            Back to{" "}
                            <Link href={FRONTEND_URLS.LOGIN} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                sign in
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
