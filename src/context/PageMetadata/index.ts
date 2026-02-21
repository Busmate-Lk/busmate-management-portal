/**
 * PageMetadata Context Module
 * 
 * Provides centralized management of page-specific metadata across the application.
 * Use this to set page titles, descriptions, breadcrumbs, and other page-level information.
 */

export { PageMetadataProvider } from "./PageMetadataProvider"
export { usePageMetadata, useSetPageMetadata } from "./usePageMetadata"
export { 
  PageMetadataContext, 
  DEFAULT_METADATA,
  type PageMetadata,
  type PageMetadataContextValue,
  type BreadcrumbItem
} from "./PageMetadataContext"
