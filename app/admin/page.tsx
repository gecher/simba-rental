"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminTabs } from "@/components/admin/admin-tabs"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("simbaRentalUser")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Redirect if not admin
      if (parsedUser.role !== "admin") {
        router.push("/")
      }
    } else {
      // Redirect to login if not logged in
      router.push("/sign-in?redirect=/admin")
    }
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("simbaRentalUser")
    router.push("/")
  }

  // Don't render admin content until we've verified the user is an admin
  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Home className="h-5 w-5" />
              <span>Simba Rental</span>
            </Link>
            <span className="text-sm text-muted-foreground">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">View Website</Link>
            </Button>
            <Button size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <AdminTabs />
        </div>
      </main>
    </div>
  )
}
