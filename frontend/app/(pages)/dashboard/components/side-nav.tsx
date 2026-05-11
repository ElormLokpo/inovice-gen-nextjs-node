"use client"
import { CardholderIcon, FileLockIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react"
import Image from "next/image"
import { ReactElement } from "react"

export const DashboardSideNav = () => {

    const navLinksArr = [
        { icon: <FileLockIcon size={25} />, text: "Invoice", link: "" },
        { icon: <CardholderIcon size={25} />, text: "Purchase Oder", link: "" },
        { icon: <FileLockIcon size={25} />, text: "Invoice", link: "" },
        { icon: <CardholderIcon size={25} />, text: "Purchase Oder", link: "" },


    ]

    const settingsArr = [
        { icon: <GearSixIcon size={25} />, text: "Settings", link: "" },
        { icon: <SignOutIcon size={25} />, text: "Logout", link: "" },

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
                            navLinksArr.map(({ icon, text, link }, key) => <NavItem icon={icon} text={text} link={link} key={key} />)
                        }
                    </div>

                    <div className="flex gap-5 flex-col">
                        {
                            settingsArr.map(({ icon, text, link }, key) => <NavItem icon={icon} text={text} link={link} key={key} />)
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

const NavItem = ({ icon, text, link }: { icon: ReactElement, text: string, link: string }) => {
    return (
        <div className="text-zinc-200 hover:cursor-pointer flex flex-col items-center hover:bg-emerald-500 hover:text-zinc-100 rounded-2xl p-3">
            <div>
                {icon}
            </div>
            <div className="text-xs text-center">{text}</div>
        </div>
    )

}