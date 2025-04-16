"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navigation = [
    { name: "ダッシュボード", href: "/", icon: LayoutDashboard },
    { name: "見積依頼", href: "/quote-requests", icon: FileText },
    { name: "得意先管理", href: "/customers", icon: Users },
    { name: "設定", href: "/settings", icon: Settings },
  ]

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6" />
          <span>見積管理システム</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
              )}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            U
          </div>
          <div>
            <div className="text-sm font-medium">ユーザー名</div>
            <div className="text-xs text-muted-foreground">user@example.com</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start mt-2">
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </div>
    </>
  )

  return (
    <>
      {isMobile && (
        <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40" onClick={toggleSidebar}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {isMobile ? (
        <div
          className={cn(
            "fixed inset-0 z-30 bg-background transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full w-72 flex-col">{sidebarContent}</div>
        </div>
      ) : (
        <div className="hidden border-r bg-background md:flex md:w-72 md:flex-col">{sidebarContent}</div>
      )}
    </>
  )
}
