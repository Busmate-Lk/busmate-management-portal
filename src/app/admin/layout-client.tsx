"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { AdminContentHeader } from "@/components/admin/AdminContentHeader"
import { PageMetadataProvider, PageActionsProvider, usePageMetadata } from "@/context/PageMetadata"

/**
 * Inner layout component that consumes page metadata
 */
function AdminLayoutContent({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { metadata } = usePageMetadata()

  // Get padding value with default
  const padding = metadata.padding ?? 6
  const paddingClass = `p-${padding}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeItem={metadata.activeItem || "dashboard"} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        role="admin" 
      />
      
      {/* Main content area - adjusts based on sidebar state */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-68'} min-h-screen flex flex-col`}>
        {/* Content header: breadcrumbs + page title + actions */}
        <AdminContentHeader metadata={metadata} />

        {/* Page content */}
        <main className={`flex-1 ${paddingClass}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * Admin Layout Client Component
 * 
 * Wraps admin pages with PageMetadataProvider and renders the common layout
 * including sidebar, header, and breadcrumbs based on page metadata
 */
export function AdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <PageMetadataProvider
      initialMetadata={{
        title: "Dashboard",
        description: "Monitor system performance, user activity, and key metrics",
        activeItem: "dashboard",
        showBreadcrumbs: false,
        padding: 6
      }}
    >
      {/* PageActionsProvider must be INSIDE PageMetadataProvider so
          usePageActions works, but its state is kept separate so that
          setting actions never re-renders page components. */}
      <PageActionsProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </PageActionsProvider>
    </PageMetadataProvider>
  )
}
