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
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Settings,
  TicketIcon,
  Users2,
  Shield,
  User,
  LogOut,
  CircleUser,
  Text,
  FileTextIcon,
  PlaneTakeoffIcon,
  ChartAreaIcon,
  CircleDollarSignIcon,
  SquareActivityIcon,
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
      icon: PlaneTakeoffIcon,
      label: 'Trip Management',
      active: activeItem === 'trips',
      href: '/mot/trips',
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
      icon: FileTextIcon,
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
      icon: CircleDollarSignIcon,
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
      icon: ChartAreaIcon,
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
      href: '/operator/staff-management',
    },
    {
      icon: DollarSign,
      label: 'Revenue Management',
      active: activeItem === 'revenue',
      href: '/operator/revenue-management',
    },
  ];

  const adminSidebarItems: SidebarItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: activeItem === 'dashboard',
      href: '/admin/dashboard',
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
      icon: SquareActivityIcon,
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
      className={`${
        isCollapsed ? 'w-20' : 'w-68'
      } bg-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl`}
    >
      {/* Header Section */}
      <div className="px-4 py-3 border-b border-blue-700 flex items-center justify-center min-h-16">
        <div className="flex items-center justify-center w-full overflow-hidden">
          {!isCollapsed ? (
            <div className="flex items-center gap-0">
              <Image
                src="/busmate-logo-icon.png"
                alt="Busmate LK"
                width={1408}
                height={768}
                className="w-18 h-8 object-cover shrink-0"
              />
              <Image
                src="/busmate-logo-text.png"
                alt="Busmate LK"
                width={1408}
                height={768}
                className="w-32 h-10 object-cover shrink-0 -ml-2"
              />
            </div>
          ) : (
            <Image
              src="/busmate-logo-icon.png"
              alt="Busmate LK"
              width={1408}
              height={768}
              className="w-10 h-8 object-cover"
            />
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div
        className="flex-1 overflow-y-auto py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <nav className="px-3 space-y-3">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
              } rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                item.active
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-700/60 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {item.active && !isCollapsed && (
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-400 rounded-r-full" />
              )}

              {/* Icon */}
              <div
                className={`shrink-0 transition-all duration-200 ${
                  item.active
                    ? 'text-blue-600 scale-110'
                    : 'text-blue-200 group-hover:text-white group-hover:scale-105'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>

              {/* Label — fades with collapse */}
              {!isCollapsed && (
                <span className="truncate transition-all duration-200 leading-none">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
                  {item.label}
                  {/* Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer: user menu + collapse toggle */}
      <div className="border-t border-blue-700 px-2 py-2">
        <div
          className={`flex items-center ${
            isCollapsed ? 'flex-col gap-2' : 'flex-row gap-1'
          }`}
        >
          {/* User Menu */}
          <div className={`relative ${isCollapsed ? 'w-full flex justify-center' : 'flex-1'}`} ref={userMenuRef}>
            {/* Dropdown (opens upward) */}
            {userMenuOpen && (
              <div
                className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[210px] ${
                  isCollapsed
                    ? '-left-2 ml-2 bottom-0 top-auto'
                    : 'left-0 right-0'
                }`}
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.email || 'Administrator'}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5 capitalize">
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
              className={`flex items-center gap-2.5 text-blue-100 rounded-lg transition-all duration-200 ${
                isCollapsed
                  ? 'justify-center p-2 w-full'
                  : 'flex-1 px-3 py-2 w-full'
              } ${
                userMenuOpen
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-700/60 hover:text-white'
              }`}
              title={isCollapsed ? (user?.email || 'Account') : undefined}
            >
              <div
                className={`${
                  isCollapsed ? 'w-9 h-9' : 'w-8 h-8'
                } rounded-full bg-blue-600 flex items-center justify-center shrink-0 ring-2 ring-blue-400/40`}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate leading-tight">
                    {user?.email || 'Administrator'}
                  </p>
                  <p className="text-xs text-blue-300 truncate capitalize leading-tight mt-0.5">
                    {user?.user_role || role || 'Admin'}
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Collapse toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`shrink-0 flex items-center justify-center rounded-lg transition-all duration-200 text-blue-200 hover:bg-blue-700/60 hover:text-white ${
              isCollapsed ? 'w-full p-2' : 'p-2'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
