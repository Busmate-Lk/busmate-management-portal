// Sample data for fares - replace with API calls when backend is ready

export interface DistanceBand {
    min: number;
    max: number;
    fare: number;
}

export interface Fare {
    id: string;
    busType: string;
    facilityType: string;
    baseFare: number;
    perKmRate: number;
    effectiveFrom: string;
    effectiveTo: string | null;
    status: 'Active' | 'Expired' | 'Pending' | 'Inactive';
    route: string;
    operator: string;
    operatorType: string;
    region: string;
    province: string;
    notes: string;
    distanceBands: DistanceBand[];
    createdDate: string;
    lastUpdated: string;
    createdBy: string;
}

export interface FareStatistics {
    totalFares: number;
    activeFares: number;
    expiredFares: number;
    pendingFares: number;
    averagePerKmRate: number;
}

export interface FareFilterOptions {
    statuses: string[];
    busTypes: string[];
    facilityTypes: string[];
    operators: string[];
    regions: string[];
}

export interface FareFormData {
    busType: string;
    facilityType: string;
    route: string;
    operator: string;
    operatorType: string;
    province: string;
    baseFare: string;
    perKmRate: string;
    effectiveFrom: string;
    effectiveTo: string;
    notes: string;
}

const sampleFares: Fare[] = [
    {
        id: 'FS001',
        busType: 'AC',
        facilityType: 'Luxury',
        baseFare: 100.0,
        perKmRate: 5.8,
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-12-31',
        status: 'Active',
        route: 'Colombo - Kandy',
        operator: 'SLTB Central',
        operatorType: 'SLTB',
        region: 'Central Province',
        province: 'Central',
        notes: 'Premium service with luxury amenities. Includes complimentary refreshments.',
        distanceBands: [
            { min: 0, max: 50, fare: 150 },
            { min: 51, max: 100, fare: 280 },
            { min: 101, max: 150, fare: 410 },
            { min: 151, max: 200, fare: 540 },
        ],
        createdDate: '2023-12-15',
        lastUpdated: '2024-01-01',
        createdBy: 'John Doe (Transport Officer)',
    },
    {
        id: 'FS002',
        busType: 'Non-AC',
        facilityType: 'Normal',
        baseFare: 77.0,
        perKmRate: 4.8,
        effectiveFrom: '2025-01-01',
        effectiveTo: '2025-12-31',
        status: 'Active',
        route: 'Colombo - Galle',
        operator: 'Southern Transport',
        operatorType: 'Private',
        region: 'Southern Province',
        province: 'Southern',
        notes: 'Standard service for coastal route. High frequency during peak hours.',
        distanceBands: [
            { min: 0, max: 50, fare: 120 },
            { min: 51, max: 100, fare: 240 },
            { min: 101, max: 150, fare: 360 },
        ],
        createdDate: '2024-11-20',
        lastUpdated: '2024-11-25',
        createdBy: 'Jane Smith (Fare Manager)',
    },
    {
        id: 'FS003',
        busType: 'Semi-Luxury',
        facilityType: 'Semi-Luxury',
        baseFare: 48.0,
        perKmRate: 4.5,
        effectiveFrom: '2024-10-01',
        effectiveTo: '2025-09-30',
        status: 'Active',
        route: 'Kandy - Nuwara Eliya',
        operator: 'Hill Country Express',
        operatorType: 'Private',
        region: 'Central Province',
        province: 'Central',
        notes: 'Semi-luxury service for hill country route with scenic views.',
        distanceBands: [
            { min: 0, max: 40, fare: 100 },
            { min: 41, max: 80, fare: 200 },
            { min: 81, max: 120, fare: 300 },
        ],
        createdDate: '2024-09-15',
        lastUpdated: '2024-09-20',
        createdBy: 'Kumar Perera (Route Manager)',
    },
    {
        id: 'FS004',
        busType: 'AC',
        facilityType: 'Express',
        baseFare: 900.0,
        perKmRate: 6.4,
        effectiveFrom: '2025-10-01',
        effectiveTo: '2026-09-30',
        status: 'Active',
        route: 'Colombo - Matara',
        operator: 'Coastal Express',
        operatorType: 'Private',
        region: 'Southern Province',
        province: 'Southern',
        notes: 'Express AC service for long distance coastal route. Limited stops.',
        distanceBands: [
            { min: 0, max: 50, fare: 200 },
            { min: 51, max: 100, fare: 400 },
            { min: 101, max: 160, fare: 600 },
        ],
        createdDate: '2025-09-10',
        lastUpdated: '2025-09-15',
        createdBy: 'Anura Silva (Operations Head)',
    },
    {
        id: 'FS005',
        busType: 'Non-AC',
        facilityType: 'Normal',
        baseFare: 48.0,
        perKmRate: 5.2,
        effectiveFrom: '2023-12-01',
        effectiveTo: '2024-11-30',
        status: 'Expired',
        route: 'Kurunegala - Anuradhapura',
        operator: 'North Western Transport',
        operatorType: 'SLTB',
        region: 'North Western Province',
        province: 'North Western',
        notes: 'Regular service connecting northwestern cities. Replaced by FS010.',
        distanceBands: [
            { min: 0, max: 50, fare: 110 },
            { min: 51, max: 100, fare: 220 },
            { min: 101, max: 150, fare: 330 },
        ],
        createdDate: '2023-11-15',
        lastUpdated: '2023-11-20',
        createdBy: 'Nimal Fernando (District Officer)',
    },
    {
        id: 'FS006',
        busType: 'AC',
        facilityType: 'Intercity',
        baseFare: 120.0,
        perKmRate: 5.5,
        effectiveFrom: '2025-03-01',
        effectiveTo: '2026-02-28',
        status: 'Active',
        route: 'Colombo - Negombo',
        operator: 'Colombo City Transport',
        operatorType: 'Private',
        region: 'Western Province',
        province: 'Western',
        notes: 'Intercity express service between Colombo and Negombo airport corridor.',
        distanceBands: [
            { min: 0, max: 20, fare: 80 },
            { min: 21, max: 40, fare: 150 },
        ],
        createdDate: '2025-02-10',
        lastUpdated: '2025-02-15',
        createdBy: 'Saman Kumara (City Transport Manager)',
    },
    {
        id: 'FS007',
        busType: 'Non-AC',
        facilityType: 'Normal',
        baseFare: 40.0,
        perKmRate: 3.8,
        effectiveFrom: '2025-06-01',
        effectiveTo: null,
        status: 'Pending',
        route: 'Kandy - Badulla',
        operator: 'Uva Province Transport Board',
        operatorType: 'Provincial',
        region: 'Uva Province',
        province: 'Uva',
        notes: 'Proposed fare structure for hill country route. Awaiting ministry approval.',
        distanceBands: [
            { min: 0, max: 50, fare: 95 },
            { min: 51, max: 100, fare: 190 },
            { min: 101, max: 150, fare: 285 },
        ],
        createdDate: '2025-04-20',
        lastUpdated: '2025-05-01',
        createdBy: 'Deepa Wijesinghe (Planning Officer)',
    },
    {
        id: 'FS008',
        busType: 'Semi-Luxury',
        facilityType: 'Semi-Luxury',
        baseFare: 65.0,
        perKmRate: 4.2,
        effectiveFrom: '2024-06-01',
        effectiveTo: '2024-05-31',
        status: 'Expired',
        route: 'Galle - Matara',
        operator: 'Southern Transport',
        operatorType: 'Private',
        region: 'Southern Province',
        province: 'Southern',
        notes: 'Previous semi-luxury fare for short-distance southern coastal route.',
        distanceBands: [
            { min: 0, max: 25, fare: 75 },
            { min: 26, max: 50, fare: 140 },
        ],
        createdDate: '2024-05-10',
        lastUpdated: '2024-05-15',
        createdBy: 'Ravi Mendis (Regional Manager)',
    },
    {
        id: 'FS009',
        busType: 'AC',
        facilityType: 'Luxury',
        baseFare: 150.0,
        perKmRate: 7.0,
        effectiveFrom: '2025-01-15',
        effectiveTo: '2026-01-14',
        status: 'Active',
        route: 'Colombo - Ratnapura',
        operator: 'Sabaragamuwa Transport Board',
        operatorType: 'Provincial',
        region: 'Sabaragamuwa Province',
        province: 'Sabaragamuwa',
        notes: 'Luxury AC service through gem country with premium seating.',
        distanceBands: [
            { min: 0, max: 50, fare: 180 },
            { min: 51, max: 100, fare: 350 },
            { min: 101, max: 150, fare: 500 },
        ],
        createdDate: '2025-01-05',
        lastUpdated: '2025-01-10',
        createdBy: 'Lakshman Dias (Senior Transport Officer)',
    },
    {
        id: 'FS010',
        busType: 'Non-AC',
        facilityType: 'Normal',
        baseFare: 55.0,
        perKmRate: 5.5,
        effectiveFrom: '2024-12-01',
        effectiveTo: '2025-11-30',
        status: 'Active',
        route: 'Kurunegala - Anuradhapura',
        operator: 'North Western Transport',
        operatorType: 'SLTB',
        region: 'North Western Province',
        province: 'North Western',
        notes: 'Updated fare structure replacing FS005. Revised per-km rate applied.',
        distanceBands: [
            { min: 0, max: 50, fare: 120 },
            { min: 51, max: 100, fare: 240 },
            { min: 101, max: 150, fare: 360 },
        ],
        createdDate: '2024-11-15',
        lastUpdated: '2024-11-20',
        createdBy: 'Nimal Fernando (District Officer)',
    },
    {
        id: 'FS011',
        busType: 'AC',
        facilityType: 'Express',
        baseFare: 85.0,
        perKmRate: 5.0,
        effectiveFrom: '2025-04-01',
        effectiveTo: null,
        status: 'Pending',
        route: 'Anuradhapura - Trincomalee',
        operator: 'North Central Province Transport Board',
        operatorType: 'Provincial',
        region: 'North Central Province',
        province: 'North Central',
        notes: 'Proposed express AC service connecting ancient cities. Under review.',
        distanceBands: [
            { min: 0, max: 50, fare: 130 },
            { min: 51, max: 100, fare: 260 },
            { min: 101, max: 150, fare: 390 },
        ],
        createdDate: '2025-03-10',
        lastUpdated: '2025-03-15',
        createdBy: 'Sunil Jayawardena (Regional Planner)',
    },
    {
        id: 'FS012',
        busType: 'Non-AC',
        facilityType: 'Normal',
        baseFare: 35.0,
        perKmRate: 3.5,
        effectiveFrom: '2024-08-01',
        effectiveTo: '2025-07-31',
        status: 'Active',
        route: 'Colombo - Chilaw',
        operator: 'Sri Lanka Transport Board (SLTB)',
        operatorType: 'SLTB',
        region: 'North Western Province',
        province: 'North Western',
        notes: 'Standard SLTB service along the northwestern coastal corridor.',
        distanceBands: [
            { min: 0, max: 40, fare: 80 },
            { min: 41, max: 80, fare: 160 },
            { min: 81, max: 120, fare: 240 },
        ],
        createdDate: '2024-07-15',
        lastUpdated: '2024-07-20',
        createdBy: 'Chaminda Perera (SLTB Fare Division)',
    },
];

// --- Service functions (mirror API service pattern for easy swap) ---

export function getFares(): Fare[] {
    return sampleFares;
}

export function getFareById(id: string): Fare | undefined {
    return sampleFares.find((f) => f.id === id);
}

export function getFareStatistics(): FareStatistics {
    const fares = sampleFares;
    const activeFares = fares.filter((f) => f.status === 'Active');
    return {
        totalFares: fares.length,
        activeFares: activeFares.length,
        expiredFares: fares.filter((f) => f.status === 'Expired').length,
        pendingFares: fares.filter((f) => f.status === 'Pending').length,
        averagePerKmRate:
            fares.length > 0
                ? fares.reduce((sum, f) => sum + f.perKmRate, 0) / fares.length
                : 0,
    };
}

export function getFareFilterOptions(): FareFilterOptions {
    const fares = sampleFares;
    return {
        statuses: [...new Set(fares.map((f) => f.status))],
        busTypes: [...new Set(fares.map((f) => f.busType))],
        facilityTypes: [...new Set(fares.map((f) => f.facilityType))],
        operators: [...new Set(fares.map((f) => f.operator))],
        regions: [...new Set(fares.map((f) => f.region))],
    };
}
