"use client"

import { useEffect } from 'react'
import { ensureServiceWorkerRegistered } from '@/lib/push/registerServiceWorker'
import { useAuth } from '@/context/AsgardeoAuthContext'
import { v4 as uuidv4 } from 'uuid'

export default function ClientSWBootstrap() {
    const { isAuthenticated, isLoading, user } = useAuth()

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
        if (isLoading || !isAuthenticated || !user) return

        let cancelled = false
            ; (async () => {
                if (cancelled) return

                // Get or generate deviceId
                let deviceId = localStorage.getItem('deviceId')
                if (!deviceId) {
                    deviceId = uuidv4()
                    localStorage.setItem('deviceId', deviceId)
                }

                console.log('[ClientSWBootstrap] User authenticated, subscribing to push notifications with userId:', user.id)

                // Subscribe via the proxy (no need to pass token, server handles it)
                await subscribeUserToPushViaProxy(deviceId, user.id)
            })()

        return () => { cancelled = true }
    }, [isAuthenticated, isLoading, user])

    return null
}

/**
 * Subscribe to push notifications via the server-side proxy
 * The proxy will attach the auth token automatically
 */
async function subscribeUserToPushViaProxy(deviceId: string, userId: string) {
    try {
        // Get service worker registration
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('[ClientSWBootstrap] Push notifications not supported')
            return
        }

        const registration = await navigator.serviceWorker.ready
        
        // Get existing subscription or create new one
        let subscription = await registration.pushManager.getSubscription()
        
        if (!subscription) {
            // Request permission and create subscription
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
                console.warn('[ClientSWBootstrap] Push notification permission denied')
                return
            }

            // Subscribe to push (you'll need to get the VAPID key from your server)
            const response = await fetch('/api/proxy/notification-management/push/vapid-key')
            const { publicKey } = await response.json()
            
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            })
        }

        // Send subscription to server via proxy
        await fetch('/api/proxy/notification-management/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription: subscription.toJSON(),
                deviceId,
                userId,
            }),
        })

        console.log('[ClientSWBootstrap] Push subscription successful')
    } catch (error) {
        console.error('[ClientSWBootstrap] Push subscription failed:', error)
    }
}

/**
 * Convert base64 VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray as Uint8Array<ArrayBuffer>
}
