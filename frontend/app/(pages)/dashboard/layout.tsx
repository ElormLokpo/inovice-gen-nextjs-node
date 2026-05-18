"use client"
import { ReactNode } from "react";
import { DashboardSideNav } from "./components/side-nav";
import { TopNav } from "./components/top-nav";
import { Search } from "./components/search";
import { useSideModal } from "@/app/store";
import { cn } from "@/app/lib/utils";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  
    const modalContent = useSideModal((state)=>state.modalContent)

    return (

        <div className="bg-black h-screen grid grid-cols-18">

            <div className="col-span-1">
                <DashboardSideNav />
            </div>

            <div className={cn("bg-black", modalContent ? "col-span-13 " : "col-span-17")}>
                <div className="mb-1">
                    <TopNav />
                </div>
                <div className="">
                    <Search />
                </div>

                {children}
            </div>

            <div className={cn("col-span-4", modalContent ? "" : "hidden")}>
                <div className="sticky top-0">
                    {modalContent}
                </div>
            </div>          
        </div>
    )
}  
