'use client';

import {
  Bus,
  Users,
  BarChart3,
  Calendar,
  MapPin,
  Route,
  LayoutDashboard,
  FileText,
  Truck,
  MessageSquare,
  Navigation,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Menu,
  X,
  Clock,
  Settings,
  Pen,
  Briefcase,
  AlertCircle,
  TicketIcon,
  Users2,
  Shield,
  User,
  LogOut,
  CircleUser,
  ListCollapseIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  icon: any;
  label: string;
  active: boolean;
  href: string;
}

interface SidebarProps {
  activeItem?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  role?: string;
}

export function Sidebar({
  activeItem = 'dashboard',
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
  role,
}: SidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use external state if provided, otherwise use internal state
  const isCollapsed =
    externalIsCollapsed !== undefined
      ? externalIsCollapsed
      : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  const motSidebarItems: SidebarItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: activeItem === 'dashboard',
      href: '/mot/dashboard',
    },
    {
      icon: MapPin,
      label: 'Bus Stops',
      active: activeItem === 'bus-stops',
      href: '/mot/bus-stops',
    },
    {
      icon: Route,
      label: 'Routes Management',
      active: activeItem === 'routes',
      href: '/mot/routes',
    },
    {
      icon: Calendar,
      label: 'Schedule Management',
      active: activeItem === 'schedules',
      href: '/mot/schedules',
    },
    {
      icon: Bus,
      label: 'Trip Management',
      active: activeItem === 'trips',
      href: '/mot/trips',
    },
    {
      icon: Truck,
      label: 'Trip Assignment',
      active: activeItem === 'trip-assignment',
      href: '/mot/trip-assignment',
    },
    {
      icon: Users,
      label: 'Operator Management',
      active: activeItem === 'operators',
      href: '/mot/users/operators',
    },
    {
      icon: Bus,
      label: 'Bus Management',
      active: activeItem === 'buses',
      href: '/mot/buses',
    },
    {
      icon: TicketIcon,
      label: 'Permit Management',
      active: activeItem === 'passenger-service-permits',
      href: '/mot/passenger-service-permits',
    },
    {
      icon: Navigation,
      label: 'Location Tracking',
      active: activeItem === 'location-tracking',
      href: '/mot/location-tracking',
    },
    {
      icon: DollarSign,
      label: 'Fare Management',
      active: activeItem === 'fares',
      href: '/mot/fares',
    },
    {
      icon: Users2,
      label: 'Staff Management',
      active: activeItem === 'staff',
      href: '/mot/staff-management',
    },
    {
      icon: Bell,
      label: 'Notifications',
      active: activeItem === 'notifications',
      href: '/mot/notifications',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      active: activeItem === 'analytics',
      href: '/mot/analytics',
    },
    {
      icon: Shield,
      label: 'Policies',
      active: activeItem === 'policies',
      href: '/mot/policies',
    },
  ];

  const timeKeeperSidebarItems: SidebarItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: activeItem === 'dashboard',
      href: '/timekeeper/dashboard',
    },
    {
      icon: Users,
      label: 'Attendance',
      active: activeItem === 'attendance',
      href: '/timekeeper/attendance',
    },
    {
      icon: Bus,
      label: 'Trips',
      active: activeItem === 'trips',
      href: '/timekeeper/trips',
    },
  ];

  const operatorSidebarItems: SidebarItem[] = [
    {
      icon: BarChart3,
      label: 'Dashboard',
      active: activeItem === 'dashboard',
      href: '/operator/dashboard',
    },
    {
      icon: FileText,
      label: 'Service Permits',
      active: activeItem === 'passenger-service-permits',
      href: '/operator/passenger-service-permits',
    },
    {
      icon: Bus,
      label: 'Fleet Management',
      active: activeItem === 'fleetmanagement',
      href: '/operator/fleet-management',
    },
    {
      icon: Navigation,
      label: 'Trip Management',
      active: activeItem === 'trips',
      href: '/operator/trips',
    },
    {
      icon: Users,
      label: 'Staff Management',
      active: activeItem === 'staff',
      href: '/operator/staffManagement',
    },
    {
      icon: DollarSign,
      label: 'Revenue Management',
      active: activeItem === 'revenue',
      href: '/operator/revenueManagement',
    },
  ];

  const adminSidebarItems: SidebarItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: activeItem === 'dashboard',
      href: '/admin',
    },
    {
      icon: Users,
      label: 'User Management',
      active: activeItem === 'users',
      href: '/admin/users',
    },
    {
      icon: MessageSquare,
      label: 'Notifications',
      active: activeItem === 'notifications',
      href: '/admin/notifications',
    },
    {
      icon: BarChart3,
      label: 'System Monitoring',
      active: activeItem === 'monitoring',
      href: '/admin/monitoring',
    },
    {
      icon: FileText,
      label: 'System Logs',
      active: activeItem === 'logs',
      href: '/admin/logs',
    },
    {
      icon: Settings,
      label: 'System Settings',
      active: activeItem === 'settings',
      href: '/admin/settings',
    },
  ];

  let sidebarItems = null;
  switch (role) {
    case 'mot':
      sidebarItems = motSidebarItems;
      break;
    case 'timeKeeper':
      sidebarItems = timeKeeperSidebarItems;
      break;
    case 'operator':
      sidebarItems = operatorSidebarItems;
      break;
    case 'admin':
      sidebarItems = adminSidebarItems;
      break;
    default:
      sidebarItems = motSidebarItems;
  }

  return (
    <div
      className={`${isCollapsed ? 'w-20' : 'w-68'
        } bg-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-blue-500 h-17 flex items-center justify-center">
        <div className="flex items-center justify-center w-full">
          <div
            className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''
              }`}
          >
            {!isCollapsed ? (
              <div className="bg-blue-800 ml-[-25px] rounded-lg shrink-0 flex items-center justify-center">
                <Image
                  src="/busmate-logo-icon.png"
                  alt="Busmate LK Logo"
                  width={1408}
                  height={768}
                  className="w-15 h-7 object-cover"
                />
                <Image
                  src="/busmate-logo-text.png"
                  alt="Busmate LK Logo"
                  width={1408}
                  height={768}
                  className="w-36 h-12 object-cover ml-[-15px] mt-[3px]"
                />
              </div>
            ) : (
              <Image
                src="/busmate-logo-icon.png"
                alt="Busmate LK Logo"
                width={1408}
                height={768}
                className="w-12 h-8 object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'
                } rounded-lg text-sm font-medium transition-all duration-200 group relative ${item.active
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active indicator line */}
              {item.active && !isCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-lg" />
              )}

              {/* Icon with enhanced styling */}
              <div
                className={`shrink-0 transition-all duration-200 ${item.active
                  ? 'text-blue-600 scale-110'
                  : 'text-blue-100 group-hover:text-white group-hover:scale-105'
                  }`}
              >
                <item.icon className="w-5 h-5" />
              </div>

              {/* Label */}
              {!isCollapsed && (
                <span className="truncate ml-2 transition-all duration-200">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Section with User Menu + Collapse Button */}
      <div className="border-t border-blue-500">
        <div className={`flex ${isCollapsed ? 'flex-col items-center gap-4 py-4' : 'flex-row items-center'} p-2`}>
          {/* User Menu Container */}
          <div className="relative flex-1" ref={userMenuRef}>
            {/* Dropdown (opens upward) */}
            {userMenuOpen && (
              <div className={`absolute bottom-full ${isCollapsed ? 'left-1/2 transform -translate-x-1/7' : 'left-0 right-3'} mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[200px]`}>
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.email || 'Administrator'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user?.user_role || role || 'Admin'}
                  </p>
                </div>

                {/* Menu items */}
                <Link
                  href={`/${role || 'admin'}/profile`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <CircleUser className="w-4 h-4 text-gray-400" />
                  Profile
                </Link>
                <Link
                  href={`/${role || 'admin'}/settings`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            {/* User button */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-3  text-blue-100 hover:bg-blue-700 transition-colors ${
                isCollapsed ? 'justify-center w-full p-0 rounded-full' : 'flex-1 px-3 py-2 rounded-lg'
              } ${userMenuOpen ? 'bg-blue-700' : ''}`}
              title={isCollapsed ? (user?.email || 'Account') : undefined}
            >
              <div className={`${isCollapsed ? 'w-9 h-9' : 'w-8 h-8'} rounded-full bg-blue-600 flex items-center justify-center shrink-0 ring-2 ring-blue-400/30`}>
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email || 'Administrator'}
                    </p>
                    <p className="text-xs text-blue-300 truncate">
                      {user?.user_role || role || 'Admin'}
                    </p>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 bg-blue-600 rounded-lg transition-all duration-200 ${isCollapsed
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'text-blue-100 hover:bg-blue-500 hover:text-white ml-2'
              }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <div className='flex'>
                <ChevronRight className="w-5 h-5" />
              </div>
            ) : (
              <div className='flex'>
                <ChevronLeft className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
