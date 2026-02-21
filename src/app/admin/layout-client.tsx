"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { Header } from "@/components/shared/header"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { PageMetadataProvider, usePageMetadata } from "@/context/PageMetadata"

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
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-68'} min-h-screen`}>
        {/* Header with page title and description from metadata */}
        <Header 
          pageTitle={metadata.title} 
          pageDescription={metadata.description} 
        />
        
        {/* Breadcrumb Navigation - Optional */}
        {metadata.showBreadcrumbs && metadata.breadcrumbs && metadata.breadcrumbs.length > 0 && (
          <Breadcrumb 
            items={metadata.breadcrumbs} 
            showHome={metadata.showBreadcrumbHome ?? true} 
          />
        )}

        {/* Page content */}
        <main className={paddingClass}>
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
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </PageMetadataProvider>
  )
}
