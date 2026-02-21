import { createContext, type ReactNode } from "react"

/**
 * Breadcrumb item structure for page navigation
 */
export interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Page metadata structure that can be set by individual pages
 */
export interface PageMetadata {
  /** Page title displayed in the header */
  title?: string
  /** Page description/subtitle displayed in the header */
  description?: string
  /** Active navigation item identifier */
  activeItem?: string
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[]
  /** Whether to show breadcrumbs */
  showBreadcrumbs?: boolean
  /** Whether to show home in breadcrumbs */
  showBreadcrumbHome?: boolean
  /** Custom page padding (default: 6) */
  padding?: number
  /** Additional metadata that can be used by specific pages */
  customData?: Record<string, any>
}

/**
 * Context value interface for PageMetadata
 */
export interface PageMetadataContextValue {
  /** Current page metadata */
  metadata: PageMetadata
  /** Update page metadata (merges with existing metadata) */
  setMetadata: (metadata: Partial<PageMetadata>) => void
  /** Reset metadata to default values */
  resetMetadata: () => void
}

/**
 * Default metadata values
 */
export const DEFAULT_METADATA: PageMetadata = {
  title: "Dashboard",
  description: "",
  activeItem: "dashboard",
  breadcrumbs: [],
  showBreadcrumbs: false,
  showBreadcrumbHome: true,
  padding: 6,
  customData: {}
}

/**
 * PageMetadata Context
 * Use this context to manage page-specific metadata across the application
 */
export const PageMetadataContext = createContext<PageMetadataContextValue | undefined>(undefined)
