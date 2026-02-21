"use client"

import { useContext, useEffect } from "react"
import { PageMetadataContext, type PageMetadata } from "./PageMetadataContext"

/**
 * Hook to access and update page metadata
 * 
 * Must be used within a PageMetadataProvider
 * 
 * @throws Error if used outside of PageMetadataProvider
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { setMetadata } = usePageMetadata()
 *   
 *   useEffect(() => {
 *     setMetadata({
 *       title: "My Page",
 *       description: "This is my page",
 *       activeItem: "my-page"
 *     })
 *   }, [setMetadata])
 *   
 *   return <div>Page content</div>
 * }
 * ```
 */
export function usePageMetadata() {
  const context = useContext(PageMetadataContext)
  
  if (context === undefined) {
    throw new Error("usePageMetadata must be used within a PageMetadataProvider")
  }
  
  return context
}

/**
 * Hook to set page metadata on component mount
 * 
 * Automatically sets metadata when the component mounts and optionally resets on unmount
 * 
 * @param metadata - Page metadata to set
 * @param resetOnUnmount - Whether to reset metadata when component unmounts (default: false)
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   useSetPageMetadata({
 *     title: "My Page",
 *     description: "This is my page",
 *     activeItem: "my-page"
 *   })
 *   
 *   return <div>Page content</div>
 * }
 * ```
 */
export function useSetPageMetadata(metadata: Partial<PageMetadata>, resetOnUnmount = false) {
  const { setMetadata, resetMetadata } = usePageMetadata()
  
  useEffect(() => {
    setMetadata(metadata)
    
    // Optionally reset metadata on unmount
    if (resetOnUnmount) {
      return () => {
        resetMetadata()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMetadata, resetMetadata, resetOnUnmount])
}
