"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { NotificationFilters, NotificationTable } from "@/components/admin/notifications"
import { filterNotifications, getReceivedNotifications, getUniqueAudiences } from "@/data/admin"

export default function ReceivedNotificationsPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [sort, setSort] = useState<{ field: string; direction: "asc" | "desc" }>({
        field: "createdAt",
        direction: "desc",
    })

    const allNotifications = useMemo(() => getReceivedNotifications(), [])

    const filtered = useMemo(() => {
        if (Object.keys(filters).length > 0 || searchTerm) {
            return filterNotifications({ ...filters, search: searchTerm })
        }
        return allNotifications
    }, [allNotifications, filters, searchTerm])

    const sorted = useMemo(() => {
        const s = [...filtered]
        s.sort((a, b) => {
            const aVal = (a as unknown as Record<string, unknown>)[sort.field]
            const bVal = (b as unknown as Record<string, unknown>)[sort.field]
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
            }
            return 0
        })
        return s
    }, [filtered, sort])

    const filterConfig = useMemo(() => {
        const audiences = getUniqueAudiences()
        return [
            {
                key: "type",
                label: "Type",
                options: [
                    { value: "all", label: "All Types" },
                    { value: "info", label: "Info" },
                    { value: "warning", label: "Warning" },
                    { value: "critical", label: "Critical" },
                ],
            },
            {
                key: "priority",
                label: "Priority",
                options: [
                    { value: "all", label: "All" },
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "critical", label: "Critical" },
                ],
            },
        ]
    }, [])

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-100">
                    <NotificationFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={filters}
                        onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
                        filterConfig={filterConfig}
                        totalCount={allNotifications.length}
                        filteredCount={filtered.length}
                    />
                </div>
                <NotificationTable
                    notifications={sorted}
                    onView={(id) => router.push(`/mot/notifications/detail/${id}`)}
                    currentSort={sort}
                    onSort={(field) =>
                        setSort((prev) => ({
                            field,
                            direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
                        }))
                    }
                />
            </div>
        </div>
    )
}
