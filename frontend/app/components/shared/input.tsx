"use client"
import { cn } from "@/app/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { ReactNode } from "react";

const inputVariants = cva("w-full transition-colors  border border-zinc-800 focus:outline-none focus:border-emerald-500", {
    variants: {
        variant: {
            auth: "bg-black rounded-3xl px-6 py-5",
            default: "bg-transparent px-4 py-3 rounded-xl text-zinc-100"
        }
    },
    defaultVariants: {
        variant: "auth"
    }
})


interface IInputProps<T extends FieldValues> extends VariantProps<typeof inputVariants> {
    label?: string
    inputType: string
    name?: Path<T>
    className?: string
    register?: UseFormRegister<T>
    errors?: FieldErrors<T>
    type?: string
    placeholder?: string
    isError?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CInput = <T extends FieldValues>({
    label,
    variant,
    inputType = "formInput",
    className,
    name,
    register,
    errors,
    type = "text",
    placeholder,
    isError,
    onChange,
}: IInputProps<T>) => {


    const hasError = !!((name && errors?.[name]) || isError);
    const errorMessage = name ? errors?.[name]?.message as string | undefined : undefined;



    const inputTypes: Record<string, ReactNode> = {
        search: (<div className={cn("bg-black flex items-center gap-2 border border-zinc-800 px-4 py-3 rounded-xl w-full max-w-[20rem]", className)}>
            <MagnifyingGlassIcon size={20} className="text-zinc-400" />
            <input
                placeholder={placeholder || "Search"}
                className="text-sm w-full focus:outline-0 bg-transparent text-zinc-400"
            />
        </div>),
        formInput: (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="block text-xs mb-2 text-zinc-100">
                        {label}
                    </label>
                )}

                <input
                    placeholder={placeholder}
                    type={type}
                    {...(name ? register?.(name) : {})}
                    className={cn(
                        inputVariants({ variant }),
                        hasError ? "border-red-500 focus:border-red-500" : "",
                        className
                    )}
                />

                {errorMessage && (
                    <span className="text-red-500 text-[10px] font-medium ml-1">
                        {errorMessage}
                    </span>
                )}
            </div>
        ), 
        regularInput:(
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="block text-xs mb-2 text-zinc-100">
                        {label}
                    </label>
                )}

                <input
                    placeholder={placeholder}
                    name={name}
                    type={type}
                    onChange={onChange}
                    className={cn(
                        inputVariants({ variant }),
                        hasError ? "border-red-500 focus:border-red-500" : "",
                        className
                    )}
                />

              
            </div>
        )
    }


    return inputTypes[inputType] || null;
}
