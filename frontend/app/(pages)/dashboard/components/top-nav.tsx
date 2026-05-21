"use client"
import { useAuthStore } from "@/app/store";
import { CaretLeftIcon, FilePdfIcon } from "@phosphor-icons/react"
import Image from "next/image"

export const TopNav = () => {
    const authData = useAuthStore((state) => state.userData);

    return (
        <div className="bg-black border-b border-zinc-800 py-3  px-4 flex justify-between">
            <div className="flex gap-1">
                <div className="border border-zinc-800 text-zinc-100 rounded-lg py-1 px-3 hover:cursor-pointer hover:bg-zinc-700 flex gap-2 items-center">
                    <CaretLeftIcon size={15} />
                </div>

                <div className="border border-zinc-800 rounded-lg p-1 flex gap-2 items-center">
                    <FilePdfIcon size={20} className="text-zinc-100" />
                    <span className="text-xs text-zinc-100"> Sample File Name</span>
                </div>
            </div>

            <div>
                <div className="flex gap-2 items-center">
                    <div>
                        <Image className="aspect-square object-cover rounded-lg" unoptimized src={`https://api.dicebear.com/9.x/initials/svg?seed=${authData?.fullName ?? "LE"}`} alt="User data" height={50} width={40} />
                    </div>
                    <div className="flex flex-col text-xs">
                        <span className="font-semibold"> {authData?.fullName ?? authData?.fullName}</span>
                        <span className="text-zinc-600">{authData?.email ?? authData?.email}</span>
                    </div>
                </div>

                {/* <div className="flex gap-2 items-center">
                    <div>
                        <Image className="aspect-square object-cover rounded-lg" unoptimized src={`https://api.dicebear.com/9.x/initials/svg?seed=${"LE"}`} alt="User data" height={50} width={40} />
                    </div>
                    <div className="flex flex-col text-xs">
                        <span className="font-semibold  text-zinc-300"> Leron Elorm</span>
                        <span className="text-zinc-500">leronelorm@gmail.com</span>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
