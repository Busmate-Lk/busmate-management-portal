"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, MessageSquare, BarChart3, Settings, ChevronRight, ChevronLeft, FileText } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Notification Center",
    href: "/admin/notifications",
    icon: MessageSquare,
  },
  {
    name: "System Monitoring",
    href: "/admin/monitoring",
    icon: BarChart3,
  },
  {
    name: "System Logs",
    href: "/admin/logs",
    icon: FileText,
  },
  {
    name: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-blue-800 text-blue-100 flex flex-col shadow-2xl transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-500 h-20 flex items-center bg-blue-800">
        <div className="flex items-center justify-between w-full">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            {!isCollapsed && (
              <div className="bg-blue-800 rounded-lg shrink-0 flex items-center justify-center" style={{ width: 48, height: 48 }}>
                <Image
                  src="/Busmate Lk.svg"
                  alt="Busmate LK Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                  priority
                />
              </div>
            )}
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">BUSMATE LK</h1>
                <p className="text-blue-200 text-sm">Admin Portal</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/admin" && pathname === "/admin") ||
              (item.href === "/admin/notifications" && pathname.startsWith("/admin/notifications")) ||
              (item.href === "/admin/users" && pathname.startsWith("/admin/users")) ||
              (item.href === "/admin/monitoring" && pathname.startsWith("/admin/monitoring")) ||
              (item.href === "/admin/logs" && pathname.startsWith("/admin/logs")) ||
              (item.href === "/admin/settings" && pathname.startsWith("/admin/settings"));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  `relative w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'} rounded-lg text-sm font-medium transition-all duration-200 group min-h-[44px]`,
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-blue-100 hover:bg-blue-500 hover:text-white"
                )}
                title={isCollapsed ? item.name : undefined}
                style={{ minHeight: 44 }}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-600" : "")} />
                {!isCollapsed && (
                  <span className="truncate ml-3">{item.name}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: only show when expanded */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-500">
          <div className="flex items-center space-x-3 p-4 bg-blue-500 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">System Online</p>
              <p className="text-xs text-blue-200">All services operational</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
