"use client"

import { useState, type ReactNode } from "react"
import { SidebarClient } from "@/components/shared/SidebarClient"
import { TimekeeperContentHeader } from "@/components/timekeeper/TimekeeperContentHeader"
import { PageProvider, usePageContext } from "@/context/PageContext"
import UserData from "@/types/UserData"


interface TimekeeperLayoutClientProps {
  children: ReactNode;
  userData: UserData | null;
}

/**
 * Inner layout component that consumes page metadata
 */
function TimekeeperLayoutContent({ children, userData }: TimekeeperLayoutClientProps) {
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
        role="timeKeeper"
        userData={userData}
      />

      {/* Main content area - adjusts based on sidebar state */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-68'} min-h-screen flex flex-col`}>
        {/* Content header: breadcrumbs + page title + actions */}
        <TimekeeperContentHeader metadata={metadata} />

        {/* Page content */}
        <main className={`flex-1 ${paddingClass}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * Timekeeper Layout Client Component
 *
 * Wraps timekeeper pages with PageProvider and renders the common layout
 * including sidebar, header, and breadcrumbs based on page metadata.
 * Receives user data from server-side layout and passes to sidebar.
 */
export function TimekeeperLayoutClient({ children, userData }: TimekeeperLayoutClientProps) {
  return (
    <PageProvider
      initialMetadata={{
        title: "Dashboard",
        description: "",
        activeItem: "dashboard",
        showBreadcrumbs: false,
        padding: 6,
      }}
    >
      <TimekeeperLayoutContent userData={userData}>{children}</TimekeeperLayoutContent>
    </PageProvider>
  )
}
