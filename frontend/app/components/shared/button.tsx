"use client"
import { cn } from "@/app/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { ReactElement } from "react"

const buttonVariants = cva("rounded-lg transition-transform active:scale-[0.98] gap-2 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out",
    {
        variants: {
            variant: {
                primary: "bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-semibold rounded-3xl text-lg ",
                secondary: "0 border border-zinc-600 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-3xl"
            },
            size: {
                xs: "text-xs p-2",
                sm: "text-xs p-3",
                md: "text-md p-3",
                lg: "text-lg p-4",
                xl: "text-xl p-5",
            },
        }
    }
)

interface IbuttonProps extends VariantProps<typeof buttonVariants> {
    buttonType: string,
    icon?: ReactElement,
    label?: string,
    className?: string,
    disabled?: boolean,
    handler?: () => void,
    formId?: string,
    type?: "submit" | "reset" | "button" | undefined,
    loadingText?:string,
    isLoading?:boolean
}

export const Cbutton = ({
    icon,
    label,
    buttonType,
    variant,
    size,
    className,
    disabled,
    handler,
    type = "button",
    formId, 
    loadingText,
    isLoading
}: IbuttonProps) => {
    const buttonTypes: Record<string, ReactElement> = {
        "standard": (
            <button form={formId} type={type} onClick={handler} disabled={disabled || isLoading} className={cn(buttonVariants({ variant, size }), className)}>
                {icon}
                {isLoading ? <span className="">{loadingText}</span> : label}
            </button>
        )
    }

    return buttonTypes[buttonType]

}
