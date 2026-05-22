"use client"
import { ReactNode } from "react";
import { DashboardSideNav } from "./components/side-nav";
import { TopNav } from "./components/top-nav";
import { Search } from "./components/search";
import { useSideModal } from "@/app/store";
import { cn } from "@/app/lib/utils";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    const modalContent = useSideModal((state) => state.modalContent);

    return (
        <div className="bg-black h-dvh min-h-0 grid grid-cols-18 overflow-hidden">

          
            <div className="col-span-1 min-h-0">
                <DashboardSideNav />
            </div>

         
            <div className="col-span-17 flex h-full min-h-0 w-full overflow-hidden">
                
              
                <div className="bg-black flex-1 min-w-0 h-full flex flex-col overflow-hidden">
                    <div className="mb-1 flex-shrink-0">
                        <TopNav />
                    </div>
                    <div className="flex-shrink-0">
                        <Search />
                    </div>
                    <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-8">
                        {children}
                    </main>
                </div>

             
                <div className={cn(
                    "h-full min-h-0 transition-all duration-300 ease-in-out transform",
                    modalContent 
                        ? "w-[23.5%] opacity-100 translate-x-0 pointer-events-auto" 
                        : "w-0 opacity-0 translate-x-10 pointer-events-none"
                )}>
                    <div className="w-full h-full border-l border-zinc-800 sticky top-0">
                        {modalContent}
                    </div>
                </div>
            </div>
        </div>
    );
}
