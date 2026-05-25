"use client"
import { FRONTEND_URLS } from "@/app/constants"
import { useAuthStore } from "@/app/store"
import { CardholderIcon, FileLockIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { ReactElement } from "react"
import { usePathname } from "next/navigation"

export const DashboardSideNav = () => {
    const pathname = usePathname()

    const router = useRouter()
    const clearAuth = useAuthStore((state) => state.clearAuth)

   

    const navLinksArr = [
        { icon: <FileLockIcon size={25} />, text: "Invoice", onclick: () => router.push("/dashboard/create-invoice") , isActive: pathname === "/dashboard/create-invoice" },
        { icon: <CardholderIcon size={25} />, text: "Purchase Oder", onclick: () => router.push("/dashboard/purchase-orders") , isActive: pathname === "/dashboard/purchase-orders" },

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


            <div className="h-full  border-r border-zinc-800 bg-black py-10 px-2">
                <div className="flex justify-center items-center mb-[5rem]">
                    <div className="mb-[4rem]">
                        <span className="text-sm text-zinc-100 font-semibold">Invoi<span className="text-emerald-500">Gen</span></span>
                    </div>
                </div>

                <div>
                    <div className="flex gap-5 flex-col mb-10">
                        {
                            navLinksArr.map(({ icon, text, onclick, isActive }, key) => <NavItem icon={icon} text={text} onClick={onclick} isActive={isActive} key={key} />)
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

const NavItem = ({ icon, text, onClick, isActive }: { icon: ReactElement, text: string, onClick?: () => void, isActive?: boolean }) => {
    return (
        <button type="button" onClick={onClick} className={`text-zinc-200 hover:cursor-pointer flex flex-col items-center transition ease-in  hover:bg-emerald-600 ${isActive? "bg-emerald-500 text-zinc-900 font-bold":""} hover:text-zinc-100 rounded-2xl p-3`}>
            <div>
                {icon}
            </div>
            <div className="text-xs text-center">{text}</div>
        </button>
    )

}
