"use client"
import { useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { usePathname } from "next/navigation";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 80 : 272; // px
  const pathname = usePathname();

  // Map the current pathname to the corresponding active item
  const activeItem = (() => {
    if (pathname.startsWith("/operator/dashboard")) return "dashboard";
    if (pathname.startsWith("/operator/fleet-management")) return "fleetmanagement";
    if (pathname.startsWith("/operator/trips")) return "trips";
    if (pathname.startsWith("/operator/staff-management")) return "staff";
    if (pathname.startsWith("/operator/passenger-service-permits")) return "passenger-service-permits";
    if (pathname.startsWith("/operator/revenue-management")) return "revenue";
    return undefined;
  })();

  return (
    <div>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        activeItem={activeItem}
        role="operator"
      />
      <div
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s",
        }}
        className="min-h-screen bg-gray-50"
      >
        {children}
      </div>
    </div>
  );
}