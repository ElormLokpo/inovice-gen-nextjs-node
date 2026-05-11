"use client"

import { useRouter } from "next/navigation"
import { FRONTEND_URLS } from "@/app/constants"
import { useEffect } from "react"

export default function Dashboard() {
    const router = useRouter()

    useEffect(() => {
        router.push(FRONTEND_URLS.CREATE_INVOICE)
    }, [router])

    return (
        <div className="p-10 flex items-center justify-center">
            <span>Redirecting</span>
        </div>
    )
}