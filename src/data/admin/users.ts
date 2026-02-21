// User management mock data for admin portal
// Replace these functions with API calls when backend is ready

import { User, UserStats, UserFilter } from './types';

// Mock users data
const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Nimal Perera',
    email: 'nimal.perera@gmail.com',
    type: 'Passenger',
    status: 'Active',
    lastLogin: '30 minutes ago',
    createdAt: '2024-01-15',
    phone: '+94 71 123 4567',
  },
  {
    id: 'USR-002',
    name: 'Pradeep Kumara Silva',
    email: 'kumara.silva@slbus.lk',
    type: 'Conductor',
    status: 'Active',
    lastLogin: '3 hours ago',
    createdAt: '2023-11-20',
    phone: '+94 72 234 5678',
  },
  {
    id: 'USR-003',
    name: 'Lanka Express Transport (Pvt) Ltd',
    email: 'lankaxpress.transport@yahoo.com',
    type: 'Fleet',
    status: 'Suspended',
    lastLogin: '2 days ago',
    createdAt: '2023-06-10',
    phone: '+94 11 234 5678',
  },
  {
    id: 'USR-004',
    name: 'Chaminda Bandara',
    email: 'chaminda.p@busmate.lk',
    type: 'Time Keeper',
    status: 'Active',
    lastLogin: '1 hour ago',
    createdAt: '2024-02-01',
    phone: '+94 77 345 6789',
  },
  {
    id: 'USR-005',
    name: 'Sunimal Nimantha',
    email: 'samantha.perera@mot.lk',
    type: 'MOT',
    status: 'Active',
    lastLogin: '5 hours ago',
    createdAt: '2023-08-15',
    phone: '+94 76 456 7890',
  },
  {
    id: 'USR-006',
    name: 'Anura Dissanayake',
    email: 'anura.d@gmail.com',
    type: 'Passenger',
    status: 'Active',
    lastLogin: '1 day ago',
    createdAt: '2024-03-01',
    phone: '+94 78 567 8901',
  },
  {
    id: 'USR-007',
    name: 'Malini Fernando',
    email: 'malini.fernando@yahoo.com',
    type: 'Passenger',
    status: 'Pending',
    lastLogin: 'Never',
    createdAt: '2024-03-15',
    phone: '+94 75 678 9012',
  },
  {
    id: 'USR-008',
    name: 'Sunethra Bus Service',
    email: 'sunethra.bus@gmail.com',
    type: 'Fleet',
    status: 'Active',
    lastLogin: '12 hours ago',
    createdAt: '2022-05-20',
    phone: '+94 11 789 0123',
  },
  {
    id: 'USR-009',
    name: 'Ruwan Jayawardena',
    email: 'ruwan.j@mot.lk',
    type: 'MOT',
    status: 'Active',
    lastLogin: '2 hours ago',
    createdAt: '2023-10-01',
    phone: '+94 77 890 1234',
  },
  {
    id: 'USR-010',
    name: 'Kamal Rathnayake',
    email: 'kamal.r@slbus.lk',
    type: 'Conductor',
    status: 'Inactive',
    lastLogin: '1 month ago',
    createdAt: '2023-01-10',
    phone: '+94 71 901 2345',
  },
];

// Mock user stats
const mockUserStats: UserStats = {
  totalUsers: 13302,
  activeUsers: 12450,
  pendingUsers: 152,
  suspendedUsers: 700,
  passengerCount: 12500,
  conductorCount: 450,
  fleetCount: 180,
  timekeeperCount: 120,
  motCount: 52,
};

// Passenger profile data
export interface PassengerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinedDate: string;
  lastLogin: string;
  totalTrips: number;
  totalSpent: string;
  savedRoutes: string[];
  recentTrips: {
    id: string;
    route: string;
    date: string;
    fare: string;
  }[];
}

const mockPassengerProfile: PassengerProfile = {
  id: 'USR-001',
  name: 'Nimal Perera',
  email: 'nimal.perera@gmail.com',
  phone: '+94 71 123 4567',
  status: 'Active',
  joinedDate: '2024-01-15',
  lastLogin: '30 minutes ago',
  totalTrips: 45,
  totalSpent: 'Rs 8,500',
  savedRoutes: ['Colombo - Kandy', 'Colombo - Galle', 'Kandy - Nuwara Eliya'],
  recentTrips: [
    { id: 'T001', route: 'Colombo - Kandy', date: '2024-03-20', fare: 'Rs 450' },
    { id: 'T002', route: 'Colombo - Galle', date: '2024-03-18', fare: 'Rs 350' },
    { id: 'T003', route: 'Kandy - Nuwara Eliya', date: '2024-03-15', fare: 'Rs 200' },
  ],
};

// Conductor profile data
export interface ConductorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  employeeId: string;
  joinedDate: string;
  lastLogin: string;
  assignedBus: string;
  assignedRoute: string;
  totalTrips: number;
  rating: number;
}

const mockConductorProfile: ConductorProfile = {
  id: 'USR-002',
  name: 'Pradeep Kumara Silva',
  email: 'kumara.silva@slbus.lk',
  phone: '+94 72 234 5678',
  status: 'Active',
  employeeId: 'COND-2345',
  joinedDate: '2023-11-20',
  lastLogin: '3 hours ago',
  assignedBus: 'NB-1234',
  assignedRoute: 'Colombo - Kandy',
  totalTrips: 1250,
  rating: 4.5,
};

// Fleet profile data
export interface FleetProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationNumber: string;
  joinedDate: string;
  lastLogin: string;
  totalBuses: number;
  activeBuses: number;
  totalRoutes: number;
  buses: {
    id: string;
    registrationNumber: string;
    type: string;
    status: string;
    route: string;
  }[];
}

const mockFleetProfile: FleetProfile = {
  id: 'USR-003',
  name: 'Lanka Express Transport (Pvt) Ltd',
  email: 'lankaxpress.transport@yahoo.com',
  phone: '+94 11 234 5678',
  status: 'Suspended',
  registrationNumber: 'PV-12345',
  joinedDate: '2023-06-10',
  lastLogin: '2 days ago',
  totalBuses: 25,
  activeBuses: 20,
  totalRoutes: 8,
  buses: [
    { id: 'B001', registrationNumber: 'NB-1234', type: 'AC', status: 'Active', route: 'Colombo - Kandy' },
    { id: 'B002', registrationNumber: 'NB-1235', type: 'Non-AC', status: 'Active', route: 'Colombo - Galle' },
    { id: 'B003', registrationNumber: 'NB-1236', type: 'AC', status: 'Maintenance', route: 'N/A' },
  ],
};

// Timekeeper profile data
export interface TimekeeperProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  employeeId: string;
  joinedDate: string;
  lastLogin: string;
  assignedStop: string;
  shift: string;
  busesProcessed: number;
}

const mockTimekeeperProfile: TimekeeperProfile = {
  id: 'USR-004',
  name: 'Chaminda Bandara',
  email: 'chaminda.p@busmate.lk',
  phone: '+94 77 345 6789',
  status: 'Active',
  employeeId: 'TK-0123',
  joinedDate: '2024-02-01',
  lastLogin: '1 hour ago',
  assignedStop: 'Colombo Fort Bus Terminal',
  shift: '6:00 AM - 2:00 PM',
  busesProcessed: 450,
};

// MOT profile data
export interface MOTProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  officerId: string;
  department: string;
  joinedDate: string;
  lastLogin: string;
  permissions: string[];
}

const mockMOTProfile: MOTProfile = {
  id: 'USR-005',
  name: 'Sunimal Nimantha',
  email: 'samantha.perera@mot.lk',
  phone: '+94 76 456 7890',
  status: 'Active',
  officerId: 'MOT-0045',
  department: 'Route Management',
  joinedDate: '2023-08-15',
  lastLogin: '5 hours ago',
  permissions: ['route_management', 'schedule_management', 'operator_management', 'analytics'],
};

// API functions (to be replaced with real API calls)
export function getUsers(filter?: UserFilter): User[] {
  // TODO: Replace with API call
  // return await api.get('/admin/users', { params: filter });
  let filtered = [...mockUsers];
  
  if (filter?.search) {
    const search = filter.search.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(search) || 
      u.email.toLowerCase().includes(search)
    );
  }
  
  if (filter?.type && filter.type !== 'all') {
    filtered = filtered.filter(u => u.type === filter.type);
  }
  
  if (filter?.status && filter.status !== 'all') {
    filtered = filtered.filter(u => u.status === filter.status);
  }
  
  return filtered;
}

export function getUserById(id: string): User | undefined {
  // TODO: Replace with API call
  // return await api.get(`/admin/users/${id}`);
  return mockUsers.find(u => u.id === id);
}

export function getUserStats(): UserStats {
  // TODO: Replace with API call
  // return await api.get('/admin/users/stats');
  return mockUserStats;
}

export function getPassengerProfile(id: string): PassengerProfile {
  // TODO: Replace with API call
  return mockPassengerProfile;
}

export function getConductorProfile(id: string): ConductorProfile {
  // TODO: Replace with API call
  return mockConductorProfile;
}

export function getFleetProfile(id: string): FleetProfile {
  // TODO: Replace with API call
  return mockFleetProfile;
}

export function getTimekeeperProfile(id: string): TimekeeperProfile {
  // TODO: Replace with API call
  return mockTimekeeperProfile;
}

export function getMOTProfile(id: string): MOTProfile {
  // TODO: Replace with API call
  return mockMOTProfile;
}

export async function updateUserStatus(id: string, status: User['status']): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.patch(`/admin/users/${id}/status`, { status });
  console.log(`Updating user ${id} status to ${status}`);
  return true;
}

export async function deleteUser(id: string): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.delete(`/admin/users/${id}`);
  console.log(`Deleting user ${id}`);
  return true;
}

export async function createMOTUser(data: Partial<MOTProfile>): Promise<MOTProfile> {
  // TODO: Replace with API call
  // return await api.post('/admin/users/mot', data);
  console.log('Creating MOT user:', data);
  return { ...mockMOTProfile, ...data };
}

// Export mock data for direct access if needed
export const mockData = {
  users: mockUsers,
  userStats: mockUserStats,
  passengerProfile: mockPassengerProfile,
  conductorProfile: mockConductorProfile,
  fleetProfile: mockFleetProfile,
  timekeeperProfile: mockTimekeeperProfile,
  motProfile: mockMOTProfile,
};
