"use client"

import { useState, useCallback, useMemo, type ReactNode } from "react"
import { PageMetadataContext, DEFAULT_METADATA, type PageMetadata } from "./PageMetadataContext"

interface PageMetadataProviderProps {
  children: ReactNode
  /** Initial metadata values */
  initialMetadata?: Partial<PageMetadata>
}

/**
 * PageMetadataProvider Component
 * 
 * Wrap your application or layout with this provider to enable page metadata management.
 * Individual pages can use the `usePageMetadata` hook to set their metadata.
 * 
 * @example
 * ```tsx
 * <PageMetadataProvider>
 *   <YourApp />
 * </PageMetadataProvider>
 * ```
 */
export function PageMetadataProvider({ children, initialMetadata }: PageMetadataProviderProps) {
  const [metadata, setMetadataState] = useState<PageMetadata>({
    ...DEFAULT_METADATA,
    ...initialMetadata
  })

  /**
   * Update metadata by merging with existing values
   * Uses useCallback to prevent unnecessary re-renders
   */
  const setMetadata = useCallback((newMetadata: Partial<PageMetadata>) => {
    setMetadataState((prev) => ({
      ...prev,
      ...newMetadata,
      // Merge customData instead of replacing
      customData: {
        ...prev.customData,
        ...newMetadata.customData
      }
    }))
  }, [])

  /**
   * Reset metadata to default values
   */
  const resetMetadata = useCallback(() => {
    setMetadataState({
      ...DEFAULT_METADATA,
      ...initialMetadata
    })
  }, [initialMetadata])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      metadata,
      setMetadata,
      resetMetadata
    }),
    [metadata, setMetadata, resetMetadata]
  )

  return (
    <PageMetadataContext.Provider value={contextValue}>
      {children}
    </PageMetadataContext.Provider>
  )
}
