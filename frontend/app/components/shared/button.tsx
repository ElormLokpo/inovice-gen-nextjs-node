"use client"
import { cn } from "@/app/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { ReactElement } from "react"

const buttonVariants = cva("rounded-lg gap-2 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out",
    {
        variants: {
            variant: {
                primary: "bg-emerald-500 hover:bg-emerald-600  font-semibold",
                secondary: "0 border border-zinc-600 hover:bg-zinc-600 text-zinc-300 font-semibold"
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
}

export const Cbutton = ({
    icon,
    label,
    buttonType,
    variant,
    size,
    className,
    disabled
}: IbuttonProps) => {
    const buttonTypes: Record<string, ReactElement> = {
        "standard": (
            <button disabled={disabled} className={cn(buttonVariants({ variant, size }), className)}>
                {icon}
                {label}
            </button>
        )
    }

    return buttonTypes[buttonType]

}