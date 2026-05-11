import { ReactElement } from "react";
import { DashboardSideNav } from "./components/side-nav";
import { TopNav } from "./components/top-nav";
import { Search } from "./components/search";


export default function DashboardLayout({ children }: { children: ReactElement }) {
    return (

        <div className="bg-zinc-900 h-screen grid grid-cols-18">

            <div className="col-span-1">
                <DashboardSideNav />
            </div>

            <div className="col-span-17 bg-zinc-900">
                <div className="mb-1">
                    <TopNav />
                </div>
                <div className="">
                    <Search />
                </div>

                {children}
            </div>
        </div>
    )
}  