"use client"

import { Header } from "@/components/shared/header"
import { NotificationPanel } from "@/components/operator/notifications/notification-panel"

export default function OperatorReceivedNotificationsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                pageTitle="Notifications"
                pageDescription="View all notifications sent to you"
            />
            <NotificationPanel />
        </div>
    )
}
