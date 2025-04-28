"use client"

import Link from "next/link"
import { Building, CheckCircle, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthHeader } from "@/components/auth-header"
import { Home } from "lucide-react"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
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
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Simba Rental</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Revolutionizing the way you discover, book, and manage property rentals
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Simba Rental was founded in 2020 with a simple mission: to create a seamless rental experience for
                  both property owners and renters. We recognized the challenges in the traditional rental market and
                  set out to build a platform that addresses these pain points.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  What started as a small team with big dreams has grown into a comprehensive platform that handles
                  diverse property types, from sports fields and event halls to hotels and apartments. Our flexible
                  backend supports the unique requirements of each property type, while our user-friendly interface
                  makes booking a breeze.
                </p>
              </div>
              <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                <img
                  alt="About Simba Rental"
                  className="object-cover w-full h-full"
                  src="/placeholder.svg?height=400&width=800"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  To provide a user-friendly, scalable platform that connects property owners with renters, streamlining
                  the entire rental process from discovery to booking.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Property Diversity</h3>
                  <p className="text-muted-foreground text-center">
                    Supporting multiple property types with tailored features for each category
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">User Experience</h3>
                  <p className="text-muted-foreground text-center">
                    Creating intuitive interfaces for both property managers and renters
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Innovation</h3>
                  <p className="text-muted-foreground text-center">
                    Continuously improving our platform with cutting-edge features and technologies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Why Choose Simba Rental?</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed">
                    Our platform stands out with features designed to make property rental simple and efficient.
                  </p>
                </div>
                <ul className="grid gap-6 md:grid-cols-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Smart Calendar</h3>
                      <p className="text-sm text-muted-foreground">
                        Visual availability indicators make finding the perfect date easy
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Dynamic Pricing</h3>
                      <p className="text-sm text-muted-foreground">
                        Flexible pricing models for different times, days, and seasons
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Powerful Admin Tools</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive management interface for property owners
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Recurring Schedules</h3>
                      <p className="text-sm text-muted-foreground">Set up complex availability patterns with ease</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Responsive Design</h3>
                      <p className="text-sm text-muted-foreground">
                        Perfect experience on any device, from mobile to desktop
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Real-time Booking</h3>
                      <p className="text-sm text-muted-foreground">
                        Instant confirmation and management of reservations
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img
                  alt="Features"
                  className="object-cover w-full h-full"
                  src="/placeholder.svg?height=600&width=600"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Our Team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Meet the passionate individuals behind Simba Rental
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-4">
                  <div className="overflow-hidden rounded-full">
                    <img
                      alt={`Team Member ${i}`}
                      className="aspect-square object-cover"
                      height={200}
                      src="/placeholder.svg?height=200&width=200"
                      width={200}
                    />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="font-bold">Team Member {i}</h3>
                    <p className="text-sm text-muted-foreground">Position</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Join Simba Rental today and transform your rental experience
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span>Simba Rental</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Simba Rental. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
