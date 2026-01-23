"use client"

import { useState, createContext, useContext } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb"

interface LayoutContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}

interface LayoutProps {
  children: React.ReactNode
  activeItem?: string
  pageTitle?: string
  pageDescription?: string
  role?:string
  padding?: number
  initialSidebarCollapsed?: boolean
  breadcrumbs?: BreadcrumbItem[]
  showBreadcrumbs?: boolean
  showBreadcrumbHome?: boolean
}

export function Layout({ 
  children, 
  activeItem = "dashboard", 
  pageTitle, 
  pageDescription,
  role, 
  padding = 6, 
  initialSidebarCollapsed = false,
  breadcrumbs,
  showBreadcrumbs = true,
  showBreadcrumbHome = true
}: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialSidebarCollapsed)
  const paddingStr = padding.toString();

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed}}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeItem={activeItem} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} role={role} />
        
        <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-68'} min-h-screen`}>
          <Header pageTitle={pageTitle} pageDescription={pageDescription} />
          
          {/* Breadcrumb Navigation - Optional */}
          {showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} showHome={showBreadcrumbHome} />
          )}

          <main className={`p-${paddingStr}`}>
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
