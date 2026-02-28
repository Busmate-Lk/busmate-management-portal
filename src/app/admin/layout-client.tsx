"use client"

import { useState, type ReactNode } from "react"
import { SidebarClient } from "@/components/shared/SidebarClient"
import { AdminContentHeader } from "@/components/admin/AdminContentHeader"
import { PageProvider, usePageContext } from "@/context/PageContext"
import UserData from "@/types/UserData"

interface AdminLayoutClientProps {
  children: ReactNode;
  userData: UserData | null;
}

/**
 * Inner layout component that consumes page metadata
 */
function AdminLayoutContent({ children, userData }: AdminLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { metadata } = usePageContext()

  // Get padding value with default
  const padding = metadata.padding ?? 6
  const paddingClass = `p-${padding}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarClient 
        activeItem={metadata.activeItem || "dashboard"} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        role="admin"
        userData={userData}
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
 * including sidebar, header, and breadcrumbs based on page metadata.
 * Receives user data from server-side layout and passes to sidebar.
 */
export function AdminLayoutClient({ children, userData }: AdminLayoutClientProps) {
  return (
    <PageProvider
      initialMetadata={{
        title: "Dashboard",
        description: "Monitor system performance, user activity, and key metrics",
        activeItem: "dashboard",
        showBreadcrumbs: false,
        padding: 6,
      }}
    >
      <AdminLayoutContent userData={userData}>{children}</AdminLayoutContent>
    </PageProvider>
  )
}
