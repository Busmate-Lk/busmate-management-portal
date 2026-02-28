"use client"

import { useState, type ReactNode } from "react"
import { SidebarClient } from "@/components/shared/SidebarClient"
import { MotContentHeader } from "@/components/mot/MotContentHeader"
import { PageProvider, usePageContext } from "@/context/PageContext"
import UserData from "@/types/UserData"

interface MotLayoutClientProps {
  children: ReactNode;
  userData: UserData | null;
}

/**
 * Inner layout component that consumes page metadata
 */
function MotLayoutContent({ children, userData }: MotLayoutClientProps) {
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
        role="mot"
        userData={userData}
      />
      
      {/* Main content area - adjusts based on sidebar state */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-68'} min-h-screen flex flex-col`}>
        {/* Content header: breadcrumbs + page title + actions */}
        <MotContentHeader metadata={metadata} />

        {/* Page content */}
        <main className={`flex-1 ${paddingClass}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * MOT Layout Client Component
 * 
 * Wraps MOT pages with PageProvider and renders the common layout
 * including sidebar, header, and breadcrumbs based on page metadata.
 * Receives user data from server-side layout and passes to sidebar.
 */
export function MotLayoutClient({ children, userData }: MotLayoutClientProps) {
  return (
    <PageProvider
      initialMetadata={{
        title: "Dashboard",
        description: "Comprehensive overview of the transport management system",
        activeItem: "dashboard",
        showBreadcrumbs: false,
        padding: 6,
      }}
    >
      <MotLayoutContent userData={userData}>{children}</MotLayoutContent>
    </PageProvider>
  )
}
