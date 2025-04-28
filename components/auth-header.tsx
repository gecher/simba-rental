"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AuthHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const storedUser = localStorage.getItem("simbaRentalUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSignOut = () => {
    // First update the state
    setUser(null)
    // Then remove from localStorage
    localStorage.removeItem("simbaRentalUser")
    // Redirect to home page
    router.push("/")
  }

  if (!isClient) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <Home className="h-6 w-6" />
          <span>Simba Rental</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/properties" className="text-sm font-medium hover:text-primary">
            Properties
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
          {user && (
            <>
              <Link href="/properties/my-properties" className="text-sm font-medium hover:text-primary">
                My Properties
              </Link>
              <Link href="/advertisements/my-requests" className="text-sm font-medium hover:text-primary">
                My Advertisements
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin Portal
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {user.firstName || user.email.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/properties/my-properties")}>
                    My Properties
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/advertisements/my-requests")}>
                    My Advertisements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
