/**
 * Shared Google Maps Directions Service for Route Workspace
 * 
 * This service consolidates all Google Maps API calls for the route workspace,
 * providing efficient direction fetching with proper chunking for routes with many stops.
 * It also provides caching to avoid redundant API calls when both map and distance
 * calculator need the same data.
 */

import { RouteStop } from '@/types/RouteWorkspaceData';

// Maximum waypoints per request (Google allows 25, but we use 23 for safety margin)
const MAX_WAYPOINTS_PER_REQUEST = 23;

// Cache for directions results to avoid redundant API calls
interface CacheEntry {
  result: RouteDirectionsResult;
  timestamp: number;
  stopsHash: string;
}

// Cache with 5 minute expiry
const CACHE_EXPIRY_MS = 5 * 60 * 1000;
const directionsCache = new Map<string, CacheEntry>();

// Types for the service
export interface ValidStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  originalIndex: number;
}

export interface DirectionsChunk {
  directions: google.maps.DirectionsResult;
  startIndex: number;
  endIndex: number;
}

export interface RouteDirectionsResult {
  /** Combined directions results from all chunks */
  directionsChunks: DirectionsChunk[];
  /** Cumulative distances from start for each stop (indexed by originalIndex) */
  distances: Map<number, number>;
  /** Total route distance in km */
  totalDistanceKm: number;
  /** Total route duration in minutes */
  totalDurationMinutes: number;
  /** All valid stops that were processed */
  validStops: ValidStop[];
}

/**
 * Generate a hash for the stops array to use as cache key
 */
function generateStopsHash(validStops: ValidStop[]): string {
  return validStops
    .map(s => `${s.originalIndex}:${s.lat.toFixed(6)},${s.lng.toFixed(6)}`)
    .join('|');
}

/**
 * Clear expired cache entries
 */
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of directionsCache.entries()) {
    if (now - entry.timestamp > CACHE_EXPIRY_MS) {
      directionsCache.delete(key);
    }
  }
}

/**
 * Clear all cache entries (useful when stops are modified)
 */
export function clearDirectionsCache(): void {
  directionsCache.clear();
}

/**
 * Extract valid stops with coordinates from route stops
 */
export function extractValidStops(routeStops: RouteStop[]): ValidStop[] {
  return routeStops
    .map((rs, index) => ({
      id: rs.stop?.id || `stop-${index}`,
      name: rs.stop?.name || 'Unnamed Stop',
      lat: rs.stop?.location?.latitude,
      lng: rs.stop?.location?.longitude,
      originalIndex: index,
    }))
    .filter((stop): stop is ValidStop => 
      typeof stop.lat === 'number' && 
      typeof stop.lng === 'number' &&
      !isNaN(stop.lat) && 
      !isNaN(stop.lng)
    );
}

/**
 * Calculate the number of chunks needed for a given number of stops
 */
export function calculateChunkCount(stopCount: number): number {
  if (stopCount <= 2) return 1;
  // Each chunk can have: 1 origin + MAX_WAYPOINTS waypoints + 1 destination
  // So each chunk processes MAX_WAYPOINTS + 2 stops, but the last stop of one chunk
  // becomes the first stop of the next chunk
  const stopsPerChunk = MAX_WAYPOINTS_PER_REQUEST + 1; // +1 because origin of next chunk = destination of previous
  return Math.ceil((stopCount - 1) / stopsPerChunk);
}

/**
 * Fetch directions for a single chunk of stops
 */
async function fetchDirectionsChunk(
  directionsService: google.maps.DirectionsService,
  validStops: ValidStop[],
  startIndex: number,
  endIndex: number
): Promise<DirectionsChunk> {
  const originStop = validStops[startIndex];
  const destinationStop = validStops[endIndex];
  
  // Intermediate stops (waypoints) between origin and destination
  const waypointStops = validStops.slice(startIndex + 1, endIndex);
  const waypoints = waypointStops.map(stop => ({
    location: new google.maps.LatLng(stop.lat, stop.lng),
    stopover: true,
  }));

  const request: google.maps.DirectionsRequest = {
    origin: new google.maps.LatLng(originStop.lat, originStop.lng),
    destination: new google.maps.LatLng(destinationStop.lat, destinationStop.lng),
    waypoints,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  return new Promise((resolve, reject) => {
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK && response) {
        resolve({
          directions: response,
          startIndex,
          endIndex,
        });
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}

/**
 * Fetch all directions for a route, handling chunking for routes with many stops
 * 
 * This is the main function that should be used by components.
 * It handles:
 * - Routes with any number of stops (chunking for large routes)
 * - Cumulative distance calculation
 * - Duration calculation
 * 
 * @param routeStops - Array of route stops from the workspace context
 * @param onProgress - Optional callback for progress updates (chunk index, total chunks)
 * @returns RouteDirectionsResult with all directions data and calculated distances
 */
export async function fetchRouteDirections(
  routeStops: RouteStop[],
  onProgress?: (currentChunk: number, totalChunks: number) => void,
  options?: { skipCache?: boolean }
): Promise<RouteDirectionsResult> {
  // Validate Google Maps is loaded
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    throw new Error('Google Maps API not loaded');
  }

  // Extract valid stops
  const validStops = extractValidStops(routeStops);

  if (validStops.length < 2) {
    throw new Error('At least 2 stops with valid coordinates are required');
  }

  // Check cache first (unless explicitly skipped)
  if (!options?.skipCache) {
    const cacheKey = generateStopsHash(validStops);
    const cachedEntry = directionsCache.get(cacheKey);
    
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_EXPIRY_MS) {
      console.log('[routeWorkspaceMap] Using cached directions result');
      // Report progress as complete for cached results
      if (onProgress) {
        onProgress(1, 1);
      }
      return cachedEntry.result;
    }
    
    // Cleanup old cache entries periodically
    cleanupCache();
  }

  const directionsService = new google.maps.DirectionsService();
  const directionsChunks: DirectionsChunk[] = [];
  const distances = new Map<number, number>();
  
  // Set first stop distance to 0
  distances.set(validStops[0].originalIndex, 0);

  let cumulativeDistance = 0;
  let totalDuration = 0;
  let currentIndex = 0;

  // Calculate total number of chunks for progress reporting
  const totalChunks = calculateChunkCount(validStops.length);
  let currentChunk = 0;

  // Process stops in chunks
  while (currentIndex < validStops.length - 1) {
    // Calculate the end index for this chunk
    // We can process up to MAX_WAYPOINTS_PER_REQUEST + 1 stops per chunk
    // (1 origin + MAX_WAYPOINTS waypoints + 1 destination = MAX_WAYPOINTS + 2 total stops)
    const remainingStops = validStops.length - currentIndex;
    const stopsInThisChunk = Math.min(remainingStops, MAX_WAYPOINTS_PER_REQUEST + 2);
    const endIndex = currentIndex + stopsInThisChunk - 1;

    // Report progress
    currentChunk++;
    if (onProgress) {
      onProgress(currentChunk, totalChunks);
    }

    // Fetch directions for this chunk
    const chunk = await fetchDirectionsChunk(
      directionsService,
      validStops,
      currentIndex,
      endIndex
    );
    directionsChunks.push(chunk);

    // Process legs to calculate cumulative distances
    const legs = chunk.directions.routes[0].legs;
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const distanceInKm = (leg.distance?.value || 0) / 1000;
      const durationInMinutes = (leg.duration?.value || 0) / 60;
      
      cumulativeDistance += distanceInKm;
      totalDuration += durationInMinutes;
      
      // The leg ends at validStops[currentIndex + 1 + i]
      const stopIndex = currentIndex + 1 + i;
      const originalIndex = validStops[stopIndex].originalIndex;
      
      distances.set(originalIndex, parseFloat(cumulativeDistance.toFixed(2)));
    }

    // Move to next chunk (destination becomes origin)
    currentIndex = endIndex;

    // Small delay between chunks to avoid rate limiting
    if (currentIndex < validStops.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  const result: RouteDirectionsResult = {
    directionsChunks,
    distances,
    totalDistanceKm: parseFloat(cumulativeDistance.toFixed(2)),
    totalDurationMinutes: Math.round(totalDuration),
    validStops,
  };

  // Cache the result
  if (!options?.skipCache) {
    const cacheKey = generateStopsHash(validStops);
    directionsCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      stopsHash: cacheKey,
    });
    console.log('[routeWorkspaceMap] Cached directions result');
  }

  return result;
}

/**
 * Fetch directions optimized for map display
 * 
 * For map rendering, we may want to get the first chunk quickly for immediate display
 * and then fetch remaining chunks in the background.
 * 
 * @param routeStops - Array of route stops
 * @param onChunkReady - Callback when a chunk is ready for rendering
 * @param onComplete - Callback when all chunks are fetched
 */
export async function fetchRouteDirectionsForMap(
  routeStops: RouteStop[],
  onChunkReady: (chunk: DirectionsChunk, isFirst: boolean) => void,
  onComplete?: (result: RouteDirectionsResult) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const result = await fetchRouteDirections(routeStops, (currentChunk, totalChunks) => {
      // Progress is tracked internally
    });

    // Notify for each chunk
    result.directionsChunks.forEach((chunk, index) => {
      onChunkReady(chunk, index === 0);
    });

    if (onComplete) {
      onComplete(result);
    }
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    } else {
      throw error;
    }
  }
}

/**
 * Apply calculated distances to route stops
 * 
 * Helper function to update route stops with distances from a RouteDirectionsResult
 */
export function applyDistancesToRouteStops(
  routeStops: RouteStop[],
  distances: Map<number, number>
): RouteStop[] {
  return routeStops.map((stop, index) => {
    const distance = distances.get(index);
    if (distance !== undefined) {
      return {
        ...stop,
        distanceFromStart: distance,
      };
    }
    return stop;
  });
}

/**
 * Get marker icon URL based on stop type
 */
export function getMarkerIconUrl(type: 'start' | 'end' | 'intermediate'): string {
  const icons = {
    start: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    end: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    intermediate: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  };
  return icons[type];
}

/**
 * Determine stop type based on index
 */
export function getStopType(index: number, totalStops: number): 'start' | 'end' | 'intermediate' {
  if (index === 0) return 'start';
  if (index === totalStops - 1) return 'end';
  return 'intermediate';
}

/**
 * Calculate center point from an array of stops
 */
export function calculateCenter(validStops: ValidStop[]): { lat: number; lng: number } {
  if (validStops.length === 0) {
    return { lat: 6.9271, lng: 79.8612 }; // Default to Colombo
  }
  
  const avgLat = validStops.reduce((sum, stop) => sum + stop.lat, 0) / validStops.length;
  const avgLng = validStops.reduce((sum, stop) => sum + stop.lng, 0) / validStops.length;
  
  return { lat: avgLat, lng: avgLng };
}
