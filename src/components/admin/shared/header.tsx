"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/admin/ui/button"
import { NotificationDropdown } from "@/components/admin/notifications/notification-dropdown"
import { User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

interface HeaderProps {
    title: string
    description?: string
}

export function Header({ title, description }: HeaderProps) {
    const { user, logout, isLoading } = useAuth()

    const getUserDisplayName = () => {
        if (!user) return "Admin User"

        // Extract first name from email or use email
        const emailName = user.email.split("@")[0]
        return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }

    const getUserInitials = () => {
        if (!user) return "AU"

        const displayName = getUserDisplayName()
        const parts = displayName.split(" ")
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase()
        }
        return displayName.substring(0, 2).toUpperCase()
    }

    const getRoleDisplayName = (role: string) => {
        switch (role?.toLowerCase()) {
            case "systemadmin":
            case "system-admin":
                return "System Administrator"
            case "fleetoperator":
            case "operator":
                return "Fleet Operator"
            case "timekeeper":
                return "Timekeeper"
            case "mot":
                return "MOT Official"
            default:
                return role || "Administrator"
        }
    }

    const handleLogout = async () => {
        try {
            // Use the logout function from AuthContext
            await logout()
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    // Show loading state if auth is still loading
    if (isLoading) {
        return (
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl mb-6">
                <div className="flex h-16 items-center justify-between px-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                        {description && <div className="h-4 bg-gray-200 rounded w-32"></div>}
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl mb-6">
            <div className="flex h-20 items-center justify-between px-6">
                {/* Left section - Dashboard Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {description && <p className="text-sm text-gray-600 mt-0.5">{description}</p>}
                </div>

                {/* Right section - Notifications & Profile */}
                <div className="flex items-center space-x-3">
                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* User Profile Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-auto rounded-full pl-2 pr-3 hover:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 ring-2 ring-white shadow-md">
                                            <AvatarImage src="/placeholder.svg" />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                                {getUserInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-slate-900">{getUserDisplayName()}</p>
                                        <p className="text-xs text-slate-500">
                                            {user ? getRoleDisplayName(user.user_role) : "System Administrator"}
                                        </p>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={5}>
                            <DropdownMenuLabel className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-2">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-slate-900">{getUserDisplayName()}</p>
                                        <p className="text-sm text-slate-500">{user?.email || "admin@busmate.lk"}</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/admin/profile" className="flex items-center space-x-2 p-2 rounded-md">
                                    <User className="h-4 w-4" />
                                    <span>Profile Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
