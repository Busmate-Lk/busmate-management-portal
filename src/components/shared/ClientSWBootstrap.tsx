"use client"

import { useEffect } from 'react'
import { ensureServiceWorkerRegistered, subscribeUserToPush } from '@/lib/push/registerServiceWorker'
import { useAsgardeo } from '@asgardeo/nextjs'
import { v4 as uuidv4 } from 'uuid'

export default function ClientSWBootstrap() {
    const { isSignedIn, isLoading, user, getAccessToken } = useAsgardeo()

    useEffect(() => {
        // Only register service worker on initial mount
        let cancelled = false
            ; (async () => {
                await ensureServiceWorkerRegistered()
            })()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        // Only subscribe to push notifications after user is authenticated
        if (isLoading || !isSignedIn || !user) return

        let cancelled = false
            ; (async () => {
                if (cancelled) return

                // Get or generate deviceId
                let deviceId = localStorage.getItem('deviceId')
                if (!deviceId) {
                    deviceId = uuidv4()
                    localStorage.setItem('deviceId', deviceId)
                }

                // Get auth token from Asgardeo
                const token = await getAccessToken?.()
                if (!token) {
                    console.warn('[ClientSWBootstrap] No auth token found, skipping push subscription')
                    return
                }

                console.log('[ClientSWBootstrap] User authenticated, subscribing to push notifications with userId:', user.sub)

                // Subscribe with auth token and deviceId (which includes userId from token)
                await subscribeUserToPush(token, deviceId)
            })()

        return () => { cancelled = true }
    }, [isSignedIn, isLoading, user, getAccessToken])

    return null
}
