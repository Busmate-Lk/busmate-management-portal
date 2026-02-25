// =============================================================================
// Mock Location Tracking — Route Definitions
// =============================================================================
// 2 routes with detailed waypoint geometry for realistic bus simulation.
// Easily extensible: add more RouteDefinition entries to this array.

import type { RouteDefinition } from './types';

/**
 * All route definitions used by the mock simulation.
 *
 * Each route contains an ordered array of waypoints that form the polyline
 * geometry buses follow. Waypoints marked `isStop: true` are official stops
 * where buses will dwell for `stopDurationMinutes`.
 */
export const ROUTES: RouteDefinition[] = [
    // ── Route A: Colombo → Kandy Express ─────────────────────────────────────
    {
        id: 'route-001',
        name: 'Colombo - Kandy Express',
        shortName: 'CBK-EXP',
        totalDistanceKm: 115,
        averageSpeedKmh: 45,
        waypoints: [
            { lat: 6.9271, lng: 79.8612, name: 'Colombo Fort', isStop: true, stopDurationMinutes: 3 },
            { lat: 6.9351, lng: 79.8512, name: 'Pettah', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.9451, lng: 79.8672, name: 'Dematagoda', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.9721, lng: 79.9012 },
            { lat: 6.9901, lng: 79.9212, name: 'Kiribathgoda', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.0231, lng: 79.9512, name: 'Kadawatha', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.0671, lng: 79.9912 },
            { lat: 7.1121, lng: 80.0512, name: 'Nittambuwa', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.1561, lng: 80.1312 },
            { lat: 7.1821, lng: 80.1912, name: 'Warakapola', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.2181, lng: 80.2712, name: 'Kegalle', isStop: true, stopDurationMinutes: 3 },
            { lat: 7.2401, lng: 80.3512 },
            { lat: 7.2581, lng: 80.4212, name: 'Mawanella', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.2691, lng: 80.5012, name: 'Kadugannawa', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.2781, lng: 80.5712 },
            { lat: 7.2856, lng: 80.5937, name: 'Peradeniya', isStop: true, stopDurationMinutes: 2 },
            { lat: 7.2906, lng: 80.6337, name: 'Kandy Bus Stand', isStop: true, stopDurationMinutes: 3 },
        ],
    },

    // ── Route B: Colombo → Galle Highway ─────────────────────────────────────
    {
        id: 'route-002',
        name: 'Colombo - Galle Highway',
        shortName: 'CGL-HWY',
        totalDistanceKm: 126,
        averageSpeedKmh: 55,
        waypoints: [
            { lat: 6.9271, lng: 79.8612, name: 'Colombo Fort', isStop: true, stopDurationMinutes: 3 },
            { lat: 6.8971, lng: 79.8572, name: 'Bambalapitiya', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.8751, lng: 79.8612, name: 'Wellawatta', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.8511, lng: 79.8652, name: 'Dehiwala', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.8271, lng: 79.8692, name: 'Mt. Lavinia', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.7731, lng: 79.8792 },
            { lat: 6.7231, lng: 79.8952 },
            { lat: 6.6431, lng: 79.9352, name: 'Panadura', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.5831, lng: 79.9612 },
            { lat: 6.5251, lng: 79.9812, name: 'Wadduwa', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.4531, lng: 80.0012 },
            { lat: 6.3831, lng: 80.0412, name: 'Kalutara', isStop: true, stopDurationMinutes: 3 },
            { lat: 6.3031, lng: 80.0812 },
            { lat: 6.2231, lng: 80.1112, name: 'Bentota', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.1431, lng: 80.1512, name: 'Ambalangoda', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.0935, lng: 80.1810, name: 'Hikkaduwa', isStop: true, stopDurationMinutes: 2 },
            { lat: 6.0535, lng: 80.2210, name: 'Galle Bus Stand', isStop: true, stopDurationMinutes: 3 },
        ],
    },
];

/**
 * Look up a route by its ID.
 */
export function getRouteById(routeId: string): RouteDefinition | undefined {
    return ROUTES.find((r) => r.id === routeId);
}
