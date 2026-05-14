"use client"
import { FRONTEND_URLS } from "@/app/constants"
import { useAuthStore } from "@/app/store"
import { CardholderIcon, FileLockIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { ReactElement } from "react"

export const DashboardSideNav = () => {
    const router = useRouter()
    const clearAuth = useAuthStore((state) => state.clearAuth)

    const navLinksArr = [
        { icon: <FileLockIcon size={25} />, text: "Invoice", link: "" },
        { icon: <CardholderIcon size={25} />, text: "Purchase Oder", link: "" },
        { icon: <FileLockIcon size={25} />, text: "Invoice", link: "" },
        { icon: <CardholderIcon size={25} />, text: "Purchase Oder", link: "" },


    ]

    const settingsArr = [
        { icon: <GearSixIcon size={25} />, text: "Settings" },
        {
            icon: <SignOutIcon size={25} />,
            text: "Logout",
            onClick: () => {
                clearAuth()
                router.replace(FRONTEND_URLS.LOGIN)
            }
        },

    ]

    return (
        <div className="h-screen">


            <div className="h-full  border-r border-zinc-700 bg-zinc-900 py-10 px-2">
                <div className="flex justify-center items-center mb-[5rem]">
                    <div className="mb-[4rem]">
                        <span className="text-sm text-zinc-100 font-semibold">Invoi<span className="text-emerald-500">Gen</span></span>
                    </div>
                </div>

                <div>
                    <div className="flex gap-5 flex-col mb-10">
                        {
                            navLinksArr.map(({ icon, text }, key) => <NavItem icon={icon} text={text} key={key} />)
                        }
                    </div>

                    <div className="flex gap-5 flex-col">
                        {
                            settingsArr.map(({ icon, text, onClick }, key) => <NavItem icon={icon} text={text} onClick={onClick} key={key} />)
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

const NavItem = ({ icon, text, onClick }: { icon: ReactElement, text: string, onClick?: () => void }) => {
    return (
        <button type="button" onClick={onClick} className="text-zinc-200 hover:cursor-pointer flex flex-col items-center hover:bg-emerald-500 hover:text-zinc-100 rounded-2xl p-3">
            <div>
                {icon}
            </div>
            <div className="text-xs text-center">{text}</div>
        </button>
    )

}
