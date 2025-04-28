"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AuthHeader } from "@/components/auth-header"

export default function ContactPage() {
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions about our rental properties? Get in touch with our team.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Reach out to us through any of these channels</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-sm text-muted-foreground">contact@simbarental.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-sm text-muted-foreground">
                          123 Rental Avenue
                          <br />
                          Suite 456
                          <br />
                          San Francisco, CA 94105
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Office Hours</CardTitle>
                    <CardDescription>When you can reach our customer service team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Saturday</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Enter subject" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Enter your message" className="min-h-[150px]" />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Our Location</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Visit our office in the heart of San Francisco
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
                {/* This would be replaced with an actual map component in a real implementation */}
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Interactive Map Would Be Displayed Here</p>
                </div>
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
