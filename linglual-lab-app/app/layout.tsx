import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { JetBrains_Mono as FontMono } from "next/font/google"
import "./globals.css"
import { initializeDb } from "@/lib/db"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/Sidebar"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Linglual Lab",
  description: "AI-powered English writing assistant",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 데이터베이스 초기화
  await initializeDb()

  return (
    <html lang="ko">
      <body className={cn(
        "min-h-screen bg-background antialiased",
        fontSans.variable,
        fontMono.variable
      )}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-[240px] min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-8">
              <header className="mb-12">
                <nav className="flex items-center justify-between mb-8">
                  <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
                    Linglual Lab
                  </Link>
                  <div className="flex items-center gap-6">
                    <Link href="/vocabulary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      단어장
                    </Link>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                    <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                    <Button size="sm" className="animate-hover">
                      Get Started
                    </Button>
                  </div>
                </nav>
              </header>
              <main>{children}</main>
              <footer className="mt-16 text-center text-sm text-muted-foreground">
                <p>© 2025 Linglual Lab. All rights reserved.</p>
                <p className="mt-2">AI로 더 쉽게, 더 효과적인 영어 학습</p>
              </footer>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}

