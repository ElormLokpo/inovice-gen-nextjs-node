"use client"
import { CInput } from "@/app/components/shared/input"
import { FolderPlusIcon } from "@phosphor-icons/react"


export const Search = () => {
    return (
        <div className="py-3 px-7 flex justify-between">
            <div>
                <NavSummary />
            </div>

            <div>
                <CInput inputType="search"/>
            </div>
        </div>
    )
}


const NavSummary = () => {
    const summaryList = [
        {
            title: "Invoices",
            link: ""
        },
        {
            title: "Create Invoice",
            link: ""
        }
    ]

    return (
        <div className="flex gap-2 items-center">
            {
                summaryList.map(({ title }, key) => <div className="flex hover:cursor-pointer gap-1 items-center" key={key}>
                    <span>{"/"}</span>
                    <FolderPlusIcon size={15} />

                    <span className="text-xs hover:underline">{title}</span>
                </div>)
            }
        </div>
    )
}
