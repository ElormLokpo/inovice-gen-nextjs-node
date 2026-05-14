"use client"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FRONTEND_URLS } from "@/app/constants";
import { useConfirmEmail, useResendConfirmation } from "@/app/hooks/useAuth";

export default function ConfirmEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const email = searchParams.get("email") ?? "";
    const { mutate: confirmEmail, isPending, isSuccess } = useConfirmEmail();
    const { mutate: resendConfirmation, isPending: isResending } = useResendConfirmation();

    useEffect(() => {
        if (token) {
            confirmEmail(token);
        }
    }, [confirmEmail, token])

    return (
        <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md px-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                        I
                    </div>
                    <span className="text-lg font-semibold tracking-tighter heading">InvoGen</span>
                </div>

                <h1 className="text-4xl font-semibold mb-2">Confirm email</h1>
                <p className="text-zinc-400 mb-8">
                    {token ? "Confirming your email..." : "Check the demo email logs for your confirmation link."}
                </p>

                <div className="space-y-6">
                    {token && (
                        <div className="rounded-3xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-sm text-zinc-300">
                            {isPending && "Working on it..."}
                            {isSuccess && "Email confirmed. Redirecting you to sign in."}
                        </div>
                    )}

                    {!token && email && (
                        <button
                            disabled={isResending}
                            onClick={() => resendConfirmation({ email })}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-semibold rounded-3xl text-lg transition-transform active:scale-[0.98]"
                        >
                            {isResending ? "Sending..." : "Resend confirmation"}
                        </button>
                    )}

                    <div className="text-center text-zinc-400 text-sm mt-6">
                        Already confirmed?{" "}
                        <Link href={FRONTEND_URLS.LOGIN} className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
