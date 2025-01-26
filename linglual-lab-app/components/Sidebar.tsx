'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  PenLine, 
  Book
} from "lucide-react"

const menuItems = [
  {
    title: "홈",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "작문 연습",
    href: "/write",
    icon: PenLine
  },
  {
    title: "단어장",
    href: "/vocabulary",
    icon: Book
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-[240px] bg-card border-r p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12">
          {/* public/logo.svg 파일이 필요합니다 */}
          <img src="/logo.svg" alt="Lingual Lab" />
        </div>
        <span className="font-bold text-lg">Lingual Lab</span>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 