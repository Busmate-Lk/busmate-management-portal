"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { OperatorContentHeader } from "@/components/operator/OperatorContentHeader"
import { PageProvider, usePageContext } from "@/context/PageContext"

/**
 * Inner layout component that consumes page metadata
 */
function OperatorLayoutContent({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { metadata } = usePageContext()

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
        role="operator"
      />

      {/* Main content area - adjusts based on sidebar state */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-68'} min-h-screen flex flex-col`}>
        {/* Content header: breadcrumbs + page title + actions */}
        <OperatorContentHeader metadata={metadata} />

        {/* Page content */}
        <main className={`flex-1 ${paddingClass}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * Operator Layout Client Component
 *
 * Wraps operator pages with PageProvider and renders the common layout
 * including sidebar, header, and breadcrumbs based on page metadata.
 */
export function OperatorLayoutClient({ children }: { children: ReactNode }) {
  return (
    <PageProvider
      initialMetadata={{
        title: "Dashboard",
        description: "Comprehensive overview of your fleet operations, revenue, and performance metrics",
        activeItem: "dashboard",
        showBreadcrumbs: false,
        padding: 6,
      }}
    >
      <OperatorLayoutContent>{children}</OperatorLayoutContent>
    </PageProvider>
  )
}
