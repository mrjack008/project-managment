"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Calendar,
  ChevronDown,
  CircleDot,
  ClipboardList,
  Files,
  Home,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: ClipboardList,
    href: "/projects",
  },
  {
    label: "Leads",
    icon: Users,
    href: "/leads",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Documents",
    icon: Files,
    href: "/documents",
  },
  {
    label: "Companies",
    icon: Building2,
    href: "/companies",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="border-r bg-muted/10 w-64">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-6 w-6" />
          <span>Project Hub</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("justify-start gap-2")}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Active Projects</div>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CircleDot className="h-4 w-4 text-green-500" />
                Website Redesign
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CircleDot className="h-4 w-4 text-blue-500" />
                Mobile App Dev
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CircleDot className="h-4 w-4 text-yellow-500" />
                Marketing Campaign
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

