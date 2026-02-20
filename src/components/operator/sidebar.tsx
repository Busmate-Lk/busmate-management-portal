"use client";

import {
  Bus,
  Users,
  BarChart3,
  Navigation,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  FileText,
  Bell,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  href: string;
}

interface SidebarProps {
  activeItem?: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ activeItem = "dashboard", isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { icon: BarChart3, label: "Dashboard", active: activeItem === "dashboard", href: "/operator/dashboard" },
    { icon: FileText, label: "Service Permits", active: activeItem === "passenger-service-permits", href: "/operator/passenger-service-permits" },
    { icon: Bus, label: "Fleet Management", active: activeItem === "fleetmanagement", href: "/operator/fleet-management" },
    { icon: Navigation, label: "Trip Management", active: activeItem === "trips", href: "/operator/trips" },
    { icon: Users, label: "Staff Management", active: activeItem === "staff", href: "/operator/staffManagement" },
    { icon: UserCheck, label: "Staff Assignment", active: activeItem === "staff-assignment", href: "/operator/staff-assignment" },
    { icon: Bell, label: "Notifications", active: activeItem === "notifications", href: "/operator/notifications/received" },
    { icon: DollarSign, label: "Revenue Management", active: activeItem === "revenue", href: "/operator/revenueManagement" },
  ];

  const displayName = user?.email?.split('@')[0] ?? "Operator";
  const displayEmail = user?.email ?? "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`${isCollapsed ? "w-16" : "w-64"} bg-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-40`}>
      {/* ── Logo / Header ─── */}
      <div className="p-4 border-b border-blue-700 h-20 flex items-center justify-center overflow-hidden">
        {isCollapsed ? (
          <Image
            src="/busmate-logo-icon.png"
            alt="BusMate LK"
            width={1408}
            height={768}
            className="w-10 h-7 object-cover"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Image
              src="/busmate-logo-icon.png"
              alt="BusMate LK"
              width={1408}
              height={768}
              className="w-14 h-9 object-cover shrink-0"
            />
            <div>
              <p className="text-base font-bold text-white leading-tight">BUSMATE LK</p>
              <p className="text-xs text-blue-300 leading-tight">Operator Portal</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ─── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
              } rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                item.active
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`shrink-0 transition-transform duration-200 ${
                  item.active
                    ? "text-blue-700 scale-110"
                    : "text-blue-200 group-hover:text-white group-hover:scale-105"
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>

              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-14 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── User profile ─── */}
      <div className="border-t border-blue-700 p-3">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div
              className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold"
              title={displayName}
            >
              {initials || "OP"}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
              {initials || "OP"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              {displayEmail && <p className="text-xs text-blue-300 truncate">{displayEmail}</p>}
            </div>
          </div>
        )}
      </div>

      {/* ── Collapse toggle ─── */}
      <div className="p-2 border-t border-blue-700 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-all duration-200"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex">
              <ChevronLeft className="w-5 h-5 mr-[-10px]" />
              <ChevronLeft className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
