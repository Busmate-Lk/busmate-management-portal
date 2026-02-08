"use client"

import { MessageHistory } from "@/components/admin/broadcast"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SentNotificationsPage() {
    const router = useRouter()

    const handleSendMessage = () => {
        router.push("/admin/broadcast/compose")
    }

    return (
        <div className="space-y-6">
            <MessageHistory />
        </div>
    )
}
