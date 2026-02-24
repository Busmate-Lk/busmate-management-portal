// Location Tracking Mock Data Service
// =============================================================================
// Comprehensive mock data for the MOT Location Tracking feature.
// Replace with actual API calls when backend is implemented.
//
// Backend endpoints (planned):
//   GET /api/tracking/buses           — All tracked buses with locations
//   GET /api/tracking/buses/:id       — Single bus details
//   GET /api/tracking/stats           — Tracking statistics
//   GET /api/tracking/routes          — Routes with active buses
//   WS  /api/tracking/live            — WebSocket for real-time updates

import type {
  TrackedBus,
  BusInfo,
  RouteInfo,
  TrackingStats,
  TrackingFilterOptions,
  BusLocationData,
  GeoPoint,
  TripStatus,
  DeviceStatus,
  BusMovementStatus,
  StopInfo,
  BusAlert,
  TrackingStatsCardMetric,
} from '@/types/location-tracking';
import {
  Bus,
  Navigation,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  Activity,
  Users,
  Route,
  Gauge,
} from 'lucide-react';

// ── Sri Lanka Geographic Constants ──────────────────────────────────────────

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };
const COLOMBO = { lat: 6.9271, lng: 79.8612 };
const KANDY = { lat: 7.2906, lng: 80.6337 };
const GALLE = { lat: 6.0535, lng: 80.2210 };
const JAFFNA = { lat: 9.6615, lng: 80.0255 };
const BATTICALOA = { lat: 7.7170, lng: 81.7003 };
const ANURADHAPURA = { lat: 8.3114, lng: 80.4037 };
const MATARA = { lat: 5.9485, lng: 80.5353 };
const NEGOMBO = { lat: 7.2081, lng: 79.8356 };
const KURUNEGALA = { lat: 7.4818, lng: 80.3609 };
const TRINCOMALEE = { lat: 8.5874, lng: 81.2152 };

// ── Mock Routes Data ────────────────────────────────────────────────────────

const ROUTES: RouteInfo[] = [
  {
    id: 'route-001',
    name: 'Colombo - Kandy Express',
    shortName: 'CBK-EXP',
    startStop: 'Colombo Fort',
    endStop: 'Kandy Bus Stand',
    totalStops: 12,
    estimatedDuration: 180,
    distance: 115,
  },
  {
    id: 'route-002',
    name: 'Colombo - Galle Highway',
    shortName: 'CGL-HWY',
    startStop: 'Colombo Fort',
    endStop: 'Galle Bus Stand',
    totalStops: 8,
    estimatedDuration: 120,
    distance: 126,
  },
  {
    id: 'route-003',
    name: 'Colombo - Matara Express',
    shortName: 'CMT-EXP',
    startStop: 'Colombo Fort',
    endStop: 'Matara Bus Stand',
    totalStops: 15,
    estimatedDuration: 180,
    distance: 160,
  },
  {
    id: 'route-004',
    name: 'Colombo - Negombo',
    shortName: 'CNE-LOC',
    startStop: 'Colombo Bastian Mawatha',
    endStop: 'Negombo Bus Stand',
    totalStops: 18,
    estimatedDuration: 75,
    distance: 35,
  },
  {
    id: 'route-005',
    name: 'Colombo - Kurunegala',
    shortName: 'CKU-EXP',
    startStop: 'Colombo Fort',
    endStop: 'Kurunegala Bus Stand',
    totalStops: 10,
    estimatedDuration: 150,
    distance: 94,
  },
  {
    id: 'route-006',
    name: 'Kandy - Jaffna Express',
    shortName: 'KJF-EXP',
    startStop: 'Kandy Bus Stand',
    endStop: 'Jaffna Bus Stand',
    totalStops: 8,
    estimatedDuration: 360,
    distance: 280,
  },
  {
    id: 'route-007',
    name: 'Colombo - Anuradhapura',
    shortName: 'CAN-EXP',
    startStop: 'Colombo Pettah',
    endStop: 'Anuradhapura Bus Stand',
    totalStops: 14,
    estimatedDuration: 240,
    distance: 190,
  },
  {
    id: 'route-008',
    name: 'Galle - Matara Local',
    shortName: 'GML-LOC',
    startStop: 'Galle Bus Stand',
    endStop: 'Matara Bus Stand',
    totalStops: 22,
    estimatedDuration: 90,
    distance: 40,
  },
  {
    id: 'route-009',
    name: 'Colombo - Batticaloa',
    shortName: 'CBT-EXP',
    startStop: 'Colombo Fort',
    endStop: 'Batticaloa Bus Stand',
    totalStops: 12,
    estimatedDuration: 420,
    distance: 310,
  },
  {
    id: 'route-010',
    name: 'Trincomalee - Colombo',
    shortName: 'TRC-EXP',
    startStop: 'Trincomalee Bus Stand',
    endStop: 'Colombo Fort',
    totalStops: 10,
    estimatedDuration: 360,
    distance: 260,
  },
];

// ── Mock Operators ──────────────────────────────────────────────────────────

const OPERATORS = [
  { id: 'op-001', name: 'Lanka Ashok Leyland' },
  { id: 'op-002', name: 'SLTB' },
  { id: 'op-003', name: 'Perera Transport' },
  { id: 'op-004', name: 'Express Line' },
  { id: 'op-005', name: 'Highway Kings' },
  { id: 'op-006', name: 'Southern Express' },
];

// ── Mock Stops ──────────────────────────────────────────────────────────────

const SAMPLE_STOPS: Record<string, string[]> = {
  'route-001': ['Colombo Fort', 'Pettah', 'Dematagoda', 'Kiribathgoda', 'Kadawatha', 'Warakapola', 'Kegalle', 'Mawanella', 'Kadugannawa', 'Peradeniya', 'Kandy'],
  'route-002': ['Colombo Fort', 'Bambalapitiya', 'Wellawatta', 'Dehiwala', 'Mt. Lavinia', 'Moratuwa', 'Panadura', 'Kalutara', 'Bentota', 'Ambalangoda', 'Hikkaduwa', 'Galle'],
  'route-003': ['Colombo Fort', 'Bambalapitiya', 'Wellawatta', 'Dehiwala', 'Mt. Lavinia', 'Moratuwa', 'Panadura', 'Kalutara', 'Bentota', 'Ambalangoda', 'Hikkaduwa', 'Galle', 'Unawatuna', 'Mirissa', 'Weligama', 'Matara'],
  'route-004': ['Colombo Bastian Mawatha', 'Fort', 'Pettah', 'Kotahena', 'Wattala', 'Hendala', 'Ja-Ela', 'Seeduwa', 'Katunayake', 'Negombo'],
};

// ── Utility Functions ───────────────────────────────────────────────────────

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRegistrationNumber(): string {
  const provinces = ['WP', 'CP', 'SP', 'NP', 'EP', 'NC', 'NW', 'SG', 'UVA'];
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const province = randomElement(provinces);
  const letter1 = randomElement(letters.split(''));
  const letter2 = randomElement(letters.split(''));
  const letter3 = randomElement(letters.split(''));
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${province} ${letter1}${letter2}${letter3}-${number}`;
}

function interpolatePosition(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progress: number
): { lat: number; lng: number } {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

function calculateHeading(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const dLng = to.lng - from.lng;
  const y = Math.sin(dLng) * Math.cos(to.lat);
  const x = Math.cos(from.lat) * Math.sin(to.lat) - Math.sin(from.lat) * Math.cos(to.lat) * Math.cos(dLng);
  const heading = (Math.atan2(y, x) * 180) / Math.PI;
  return (heading + 360) % 360;
}

function addNoise(coord: { lat: number; lng: number }, amount: number = 0.001): { lat: number; lng: number } {
  return {
    lat: coord.lat + (Math.random() - 0.5) * amount,
    lng: coord.lng + (Math.random() - 0.5) * amount,
  };
}

// ── Route Path Generation ───────────────────────────────────────────────────

interface RouteEndpoints {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

const ROUTE_COORDINATES: Record<string, RouteEndpoints> = {
  'route-001': { start: COLOMBO, end: KANDY },
  'route-002': { start: COLOMBO, end: GALLE },
  'route-003': { start: COLOMBO, end: MATARA },
  'route-004': { start: COLOMBO, end: NEGOMBO },
  'route-005': { start: COLOMBO, end: KURUNEGALA },
  'route-006': { start: KANDY, end: JAFFNA },
  'route-007': { start: COLOMBO, end: ANURADHAPURA },
  'route-008': { start: GALLE, end: MATARA },
  'route-009': { start: COLOMBO, end: BATTICALOA },
  'route-010': { start: TRINCOMALEE, end: COLOMBO },
};

// ── Bus Generation ──────────────────────────────────────────────────────────

function generateBusInfo(index: number): BusInfo {
  const types: Array<'standard' | 'express' | 'luxury' | 'minibus'> = ['standard', 'express', 'luxury', 'minibus'];
  const makes = ['Leyland', 'TATA', 'Ashok Leyland', 'Isuzu', 'Hino', 'Volvo'];
  const models = ['Viking', 'Marcopolo', 'Dimo Batta', 'P1200', 'Euro III', 'B9R'];
  const operator = randomElement(OPERATORS);

  return {
    id: `bus-${String(index).padStart(3, '0')}`,
    registrationNumber: generateRegistrationNumber(),
    make: randomElement(makes),
    model: randomElement(models),
    capacity: randomElement([42, 45, 50, 52, 55, 60]),
    type: randomElement(types),
    operatorId: operator.id,
    operatorName: operator.name,
  };
}

function generateTrackedBus(index: number, baseTime: Date): TrackedBus {
  const bus = generateBusInfo(index);
  const route = randomElement(ROUTES);
  const routeCoords = ROUTE_COORDINATES[route.id];
  
  // Random trip progress
  const progress = randomBetween(5, 95);
  
  // Calculate position based on progress
  const position = interpolatePosition(routeCoords.start, routeCoords.end, progress / 100);
  const noisyPosition = addNoise(position, 0.005);
  
  // Calculate heading
  const heading = calculateHeading(routeCoords.start, routeCoords.end);
  
  // Random statuses with realistic distribution
  const deviceStatusWeights: [DeviceStatus, number][] = [
    ['online', 0.85],
    ['offline', 0.10],
    ['unknown', 0.05],
  ];
  const deviceStatus = weightedRandom(deviceStatusWeights);
  
  const tripStatusWeights: [TripStatus, number][] = [
    ['in_transit', 0.65],
    ['on_time', 0.15],
    ['delayed', 0.12],
    ['scheduled', 0.05],
    ['completed', 0.03],
  ];
  const tripStatus = weightedRandom(tripStatusWeights);
  
  // Movement status based on speed
  const baseSpeed = tripStatus === 'delayed' ? randomBetween(5, 25) : randomBetween(30, 80);
  const speed = deviceStatus === 'online' ? baseSpeed : 0;
  const movementStatus: BusMovementStatus = 
    speed > 10 ? 'moving' : 
    speed > 0 ? 'idle' : 
    'stopped';
  
  // Generate next stop info
  const routeStops = SAMPLE_STOPS[route.id] || ['Unknown Stop 1', 'Unknown Stop 2', 'Unknown Stop 3'];
  const currentStopIndex = Math.floor((progress / 100) * routeStops.length);
  const nextStopIndex = Math.min(currentStopIndex + 1, routeStops.length - 1);
  
  const nextStop: StopInfo = {
    id: `stop-${nextStopIndex}`,
    name: routeStops[nextStopIndex] || 'Terminal',
    estimatedArrival: new Date(baseTime.getTime() + randomBetween(5, 30) * 60 * 1000).toISOString(),
    scheduledArrival: new Date(baseTime.getTime() + randomBetween(5, 25) * 60 * 1000).toISOString(),
    distance: randomBetween(1, 15),
  };
  
  // Generate upcoming stops
  const upcomingStops: StopInfo[] = [];
  for (let i = nextStopIndex + 1; i < Math.min(nextStopIndex + 4, routeStops.length); i++) {
    const timeOffset = (i - nextStopIndex) * randomBetween(10, 20);
    upcomingStops.push({
      id: `stop-${i}`,
      name: routeStops[i],
      estimatedArrival: new Date(baseTime.getTime() + timeOffset * 60 * 1000).toISOString(),
      distance: randomBetween(i * 5, i * 10),
    });
  }
  
  // Generate alerts for some buses
  const alerts: BusAlert[] = [];
  if (tripStatus === 'delayed' && Math.random() > 0.5) {
    alerts.push({
      id: `alert-${bus.id}-1`,
      type: 'delay',
      severity: randomElement(['medium', 'high']),
      message: `Bus delayed by ${Math.floor(randomBetween(10, 45))} minutes due to traffic`,
      timestamp: new Date(baseTime.getTime() - randomBetween(5, 30) * 60 * 1000).toISOString(),
    });
  }
  if (Math.random() > 0.92) {
    alerts.push({
      id: `alert-${bus.id}-2`,
      type: randomElement(['maintenance', 'route_deviation', 'info']),
      severity: 'low',
      message: randomElement([
        'Scheduled maintenance due in 500km',
        'Minor route deviation reported',
        'Driver break scheduled at next stop',
      ]),
      timestamp: new Date(baseTime.getTime() - randomBetween(30, 120) * 60 * 1000).toISOString(),
    });
  }
  
  const location: BusLocationData = {
    busId: bus.id,
    tripId: `trip-${bus.id}-${Math.floor(Date.now() / 86400000)}`,
    location: {
      type: 'Point',
      coordinates: [noisyPosition.lng, noisyPosition.lat],
    },
    speed: Math.round(speed * 10) / 10,
    heading: Math.round(heading),
    timestamp: baseTime.toISOString(),
    accuracy: randomBetween(3, 15),
  };
  
  return {
    id: `tracked-${bus.id}`,
    bus,
    route,
    schedule: {
      id: `schedule-${bus.id}`,
      departureTime: new Date(baseTime.getTime() - (progress / 100) * route.estimatedDuration * 60 * 1000).toISOString(),
      arrivalTime: new Date(baseTime.getTime() + ((100 - progress) / 100) * route.estimatedDuration * 60 * 1000).toISOString(),
      frequency: randomElement(['Every 15 min', 'Every 30 min', 'Every hour', 'Scheduled']),
    },
    trip: {
      id: location.tripId!,
      status: tripStatus,
      progress: Math.round(progress),
      passengersOnboard: Math.floor(randomBetween(10, bus.capacity * 0.9)),
    },
    location,
    deviceStatus,
    movementStatus,
    nextStop,
    upcomingStops,
    alerts: alerts.length > 0 ? alerts : undefined,
    lastUpdate: baseTime.toISOString(),
  };
}

function weightedRandom<T>(weights: [T, number][]): T {
  const total = weights.reduce((sum, [, w]) => sum + w, 0);
  let random = Math.random() * total;
  for (const [value, weight] of weights) {
    random -= weight;
    if (random <= 0) return value;
  }
  return weights[0][0];
}

// ── Data Generation & Export ────────────────────────────────────────────────

let cachedBuses: TrackedBus[] | null = null;
let lastGenerated: Date | null = null;

/**
 * Get all tracked buses with their current locations
 */
export function getTrackedBuses(forceRefresh: boolean = false): TrackedBus[] {
  const now = new Date();
  
  // Regenerate if more than 30 seconds old or forced
  if (!cachedBuses || forceRefresh || !lastGenerated || (now.getTime() - lastGenerated.getTime() > 30000)) {
    cachedBuses = [];
    for (let i = 1; i <= 48; i++) {
      cachedBuses.push(generateTrackedBus(i, now));
    }
    lastGenerated = now;
  } else {
    // Update positions slightly for real-time feel
    cachedBuses = cachedBuses.map(bus => {
      if (bus.deviceStatus !== 'online' || bus.movementStatus === 'stopped') {
        return bus;
      }
      
      const routeCoords = ROUTE_COORDINATES[bus.route?.id || 'route-001'];
      const newProgress = Math.min(100, (bus.trip?.progress || 0) + randomBetween(0.1, 0.5));
      const newPosition = interpolatePosition(routeCoords.start, routeCoords.end, newProgress / 100);
      const noisyPosition = addNoise(newPosition, 0.001);
      
      return {
        ...bus,
        location: {
          ...bus.location,
          location: {
            type: 'Point' as const,
            coordinates: [noisyPosition.lng, noisyPosition.lat] as [number, number],
          },
          speed: bus.location.speed + randomBetween(-5, 5),
          timestamp: now.toISOString(),
        },
        trip: bus.trip ? {
          ...bus.trip,
          progress: Math.round(newProgress),
        } : undefined,
        lastUpdate: now.toISOString(),
      };
    });
    lastGenerated = now;
  }
  
  return cachedBuses;
}

/**
 * Get a single tracked bus by ID
 */
export function getTrackedBusById(busId: string): TrackedBus | undefined {
  const buses = getTrackedBuses();
  return buses.find(b => b.bus.id === busId || b.id === busId);
}

/**
 * Get tracking statistics
 */
export function getTrackingStats(): TrackingStats {
  const buses = getTrackedBuses();
  
  const activeBuses = buses.filter(b => b.movementStatus === 'moving').length;
  const idleBuses = buses.filter(b => b.movementStatus === 'idle').length;
  const offlineBuses = buses.filter(b => b.deviceStatus === 'offline').length;
  const onTimeBuses = buses.filter(b => b.trip?.status === 'on_time' || b.trip?.status === 'in_transit').length;
  const delayedBuses = buses.filter(b => b.trip?.status === 'delayed').length;
  
  const onlineBuses = buses.filter(b => b.deviceStatus === 'online');
  const avgSpeed = onlineBuses.length > 0
    ? onlineBuses.reduce((sum, b) => sum + b.location.speed, 0) / onlineBuses.length
    : 0;
  
  const totalPassengers = buses.reduce((sum, b) => sum + (b.trip?.passengersOnboard || 0), 0);
  
  const activeRoutes = new Set(buses.filter(b => b.deviceStatus === 'online').map(b => b.route?.id)).size;
  
  const allAlerts = buses.flatMap(b => b.alerts || []);
  
  return {
    totalBusesTracking: buses.length,
    activeBuses,
    idleBuses,
    offlineBuses,
    busesOnTime: onTimeBuses,
    busesDelayed: delayedBuses,
    averageSpeed: Math.round(avgSpeed * 10) / 10,
    totalPassengers,
    activeRoutes,
    alerts: {
      total: allAlerts.length,
      critical: allAlerts.filter(a => a.severity === 'critical').length,
      high: allAlerts.filter(a => a.severity === 'high').length,
      medium: allAlerts.filter(a => a.severity === 'medium').length,
      low: allAlerts.filter(a => a.severity === 'low').length,
    },
  };
}

/**
 * Get stats card metrics for the dashboard
 */
export function getTrackingStatsMetrics(): TrackingStatsCardMetric[] {
  const stats = getTrackingStats();
  
  return [
    {
      id: 'total-tracking',
      label: 'Buses Tracking',
      value: stats.totalBusesTracking.toString(),
      trend: 'stable',
      trendValue: 'Real-time',
      trendPositiveIsGood: true,
      color: 'blue',
      sparkData: [42, 45, 44, 48, 46, 48],
      icon: Bus,
    },
    {
      id: 'active-buses',
      label: 'Active (Moving)',
      value: stats.activeBuses.toString(),
      trend: 'up',
      trendValue: `${Math.round((stats.activeBuses / stats.totalBusesTracking) * 100)}% of fleet`,
      trendPositiveIsGood: true,
      color: 'green',
      sparkData: [30, 32, 35, 33, 36, 38],
      icon: Navigation,
    },
    {
      id: 'online-devices',
      label: 'Online Devices',
      value: (stats.totalBusesTracking - stats.offlineBuses).toString(),
      trend: 'up',
      trendValue: `${stats.offlineBuses} offline`,
      trendPositiveIsGood: true,
      color: 'teal',
      sparkData: [40, 42, 41, 43, 44, 45],
      icon: Wifi,
    },
    {
      id: 'on-time',
      label: 'On Time',
      value: stats.busesOnTime.toString(),
      trend: stats.busesOnTime > stats.busesDelayed ? 'up' : 'down',
      trendValue: `${Math.round((stats.busesOnTime / stats.totalBusesTracking) * 100)}% punctuality`,
      trendPositiveIsGood: true,
      color: 'purple',
      sparkData: [35, 36, 38, 37, 39, 40],
      icon: Clock,
    },
    {
      id: 'delayed',
      label: 'Delayed',
      value: stats.busesDelayed.toString(),
      trend: stats.busesDelayed > 5 ? 'up' : 'down',
      trendValue: stats.busesDelayed > 5 ? 'Needs attention' : 'Within limits',
      trendPositiveIsGood: false,
      color: stats.busesDelayed > 5 ? 'red' : 'amber',
      sparkData: [4, 5, 3, 6, 5, 4],
      icon: AlertTriangle,
    },
    {
      id: 'avg-speed',
      label: 'Avg Speed',
      value: `${stats.averageSpeed} km/h`,
      trend: 'stable',
      trendValue: 'Fleet average',
      trendPositiveIsGood: true,
      color: 'amber',
      sparkData: [40, 42, 38, 45, 43, 44],
      icon: Gauge,
    },
  ];
}

/**
 * Get filter options
 */
export function getTrackingFilterOptions(): TrackingFilterOptions {
  return {
    routes: ROUTES.map(r => ({ id: r.id, name: r.name })),
    operators: OPERATORS,
    tripStatuses: ['scheduled', 'in_transit', 'on_time', 'delayed', 'completed', 'cancelled'],
  };
}

/**
 * Get route information by ID
 */
export function getRouteById(routeId: string): RouteInfo | undefined {
  return ROUTES.find(r => r.id === routeId);
}

/**
 * Get all routes
 */
export function getAllRoutes(): RouteInfo[] {
  return ROUTES;
}

/**
 * Simulate real-time location update for a bus
 */
export function simulateLocationUpdate(busId: string): BusLocationData | null {
  const bus = getTrackedBusById(busId);
  if (!bus || bus.deviceStatus !== 'online') return null;
  
  const routeCoords = ROUTE_COORDINATES[bus.route?.id || 'route-001'];
  const progress = (bus.trip?.progress || 0) + randomBetween(0.5, 1.5);
  const newPosition = interpolatePosition(routeCoords.start, routeCoords.end, Math.min(progress / 100, 1));
  const noisyPosition = addNoise(newPosition, 0.001);
  
  return {
    busId: bus.bus.id,
    tripId: bus.trip?.id,
    location: {
      type: 'Point',
      coordinates: [noisyPosition.lng, noisyPosition.lat],
    },
    speed: bus.location.speed + randomBetween(-5, 5),
    heading: calculateHeading(routeCoords.start, routeCoords.end),
    timestamp: new Date().toISOString(),
    accuracy: randomBetween(3, 10),
  };
}

/**
 * Default map center (Colombo, Sri Lanka)
 */
export const DEFAULT_MAP_CENTER = COLOMBO;

/**
 * Default map zoom level
 */
export const DEFAULT_MAP_ZOOM = 11;

/**
 * Auto-refresh interval in milliseconds
 */
export const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds
