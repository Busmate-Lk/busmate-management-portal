"use client"

import { useContext, useEffect, useLayoutEffect, useRef, type ReactNode } from "react"
import { PageMetadataContext, type PageMetadata } from "./PageMetadataContext"
import { PageActionsContext } from "./PageActionsContext"

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

/**
 * Hook to access the page actions setters.
 */
export function usePageActions() {
  const context = useContext(PageActionsContext)
  if (context === undefined) {
    throw new Error("usePageActions must be used within a PageActionsProvider")
  }
  return context
}

/**
 * Hook to set page-level action buttons in the content header.
 *
 * Uses an external store (useSyncExternalStore) so that when actions
 * change, ONLY the AdminContentHeader re-renders — the page component
 * is never re-rendered by this hook, eliminating the infinite loop.
 *
 * `useLayoutEffect` without a dependency array re-runs after every render
 * of the calling page, keeping actions in sync with page state (e.g.,
 * a loading spinner inside an action button).
 *
 * @param actions - ReactNode containing action buttons
 */
export function useSetPageActions(actions: ReactNode) {
  const { setPageActions, clearPageActions } = usePageActions()

  // Keep a ref so useLayoutEffect always reads the freshest value
  const actionsRef = useRef<ReactNode>(actions)
  actionsRef.current = actions

  // Push latest actions into the external store after every render.
  // Because the store uses useSyncExternalStore, only the
  // AdminContentHeader subscribes and re-renders — not this page.
  useLayoutEffect(() => {
    setPageActions(actionsRef.current)
  })

  // Clear when the component unmounts
  useEffect(() => {
    return () => clearPageActions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
