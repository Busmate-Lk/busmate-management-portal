"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ReceivedNotificationFilters, ReceivedNotificationTable } from "@/components/mot/notifications"
import { DataPagination } from "@/components/shared/DataPagination"
import { filterNotifications, getReceivedNotifications, getUniqueAudiences } from "@/data/admin"

export default function ReceivedNotificationsPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [sort, setSort] = useState<{ field: string; direction: "asc" | "desc" }>({
        field: "createdAt",
        direction: "desc",
    })

    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

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

    const totalElements = sorted.length
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize))
    const paginatedData = sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

    const handleClearAll = useCallback(() => {
        setFilters({})
        setSearchTerm("")
        setCurrentPage(0)
    }, [])

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
            <ReceivedNotificationFilters
                searchTerm={searchTerm}
                onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(0); }}
                filters={filters}
                onFilterChange={(key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); setCurrentPage(0); }}
                filterConfig={filterConfig}
                totalCount={allNotifications.length}
                filteredCount={sorted.length}
                onClearAll={handleClearAll}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ReceivedNotificationTable
                    notifications={paginatedData}
                    onView={(id) => router.push(`/mot/notifications/detail/${id}`)}
                    currentSort={sort}
                    onSort={(field) =>
                        setSort((prev) => ({
                            field,
                            direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
                        }))
                    }
                />

                <DataPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(0); }}
                />
            </div>
        </div>
    )
}
