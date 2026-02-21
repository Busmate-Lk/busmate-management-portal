"use client"

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react"

// ── External store ────────────────────────────────────────────────
//
// Stores the current page actions outside React state so that:
//  - Writing (setPageActions) never triggers a re-render of the *page*
//  - Reading (usePageActionsValue) only re-renders the AdminContentHeader
//    via useSyncExternalStore's fine-grained subscription model

function createPageActionsStore() {
  let current: ReactNode = undefined
  const listeners = new Set<() => void>()

  function notify() {
    listeners.forEach((l) => l())
  }

  return {
    set(actions: ReactNode) {
      current = actions
      notify()
    },
    clear() {
      current = undefined
      notify()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot(): ReactNode {
      return current
    },
  }
}

// Singleton store — one per module instance (shared across all consumers)
export const pageActionsStore = createPageActionsStore()

// ── Context (provides stable store reference) ─────────────────────

export interface PageActionsContextValue {
  setPageActions: (actions: ReactNode) => void
  clearPageActions: () => void
}

export const PageActionsContext = createContext<PageActionsContextValue | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────────────

export function PageActionsProvider({ children }: { children: ReactNode }) {
  const setPageActions = useCallback((actions: ReactNode) => {
    pageActionsStore.set(actions)
  }, [])

  const clearPageActions = useCallback(() => {
    pageActionsStore.clear()
  }, [])

  return (
    <PageActionsContext.Provider value={{ setPageActions, clearPageActions }}>
      {children}
    </PageActionsContext.Provider>
  )
}

// ── Consumer hooks ────────────────────────────────────────────────

/**
 * Read the current page actions. Subscribes to the external store so
 * ONLY the calling component re-renders when actions change — not the page.
 */
export function usePageActionsValue(): ReactNode {
  return useSyncExternalStore(
    pageActionsStore.subscribe,
    pageActionsStore.getSnapshot,
    pageActionsStore.getSnapshot, // server snapshot (empty)
  )
}

