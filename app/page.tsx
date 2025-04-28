"use client"

import { CalendarDays, Search, Users } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property-card"
import { PropertyTypeFilter } from "@/components/property-type-filter"
import { AuthHeader } from "@/components/auth-header"
import { BannerAd } from "@/components/advertisements/banner-ad"
import { FeaturedAd } from "@/components/advertisements/featured-ad"
import { getAdsByPage } from "@/lib/services/advertisement"
import { Advertisement } from "@/lib/types/advertisement"

// Mock property data with images
const mockProperties = [
  {
    id: "1",
    title: "Luxury Beachfront Villa",
    type: "Apartment",
    location: "Miami, FL",
    price: 250,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
    category: "hotels",
  },
  {
    id: "2",
    title: "Downtown Event Hall",
    type: "Event Hall",
    location: "New York, NY",
    price: 500,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    category: "events",
  },
  {
    id: "3",
    title: "Professional Soccer Field",
    type: "Sports Field",
    location: "Los Angeles, CA",
    price: 120,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop",
    category: "sports",
  },
  {
    id: "4",
    title: "Boutique Hotel Suite",
    type: "Hotel",
    location: "Chicago, IL",
    price: 180,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
    category: "hotels",
  },
  {
    id: "5",
    title: "Tennis Court Complex",
    type: "Sports Field",
    location: "Boston, MA",
    price: 90,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop",
    category: "sports",
  },
  {
    id: "6",
    title: "Wedding Venue Hall",
    type: "Event Hall",
    location: "Seattle, WA",
    price: 800,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    category: "events",
  },
  {
    id: "7",
    title: "Luxury Resort Suite",
    type: "Hotel",
    location: "Orlando, FL",
    price: 350,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
    category: "hotels",
  },
  {
    id: "8",
    title: "Basketball Court",
    type: "Sports Field",
    location: "Houston, TX",
    price: 75,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=1000&auto=format&fit=crop",
    category: "sports",
  },
]

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [user, setUser] = useState<any>(null)
  const [ads, setAds] = useState<Advertisement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAds = async () => {
      try {
        const pageAds = await getAdsByPage("home")
        setAds(pageAds)
      } catch (error) {
        console.error('Failed to load ads:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAds()
  }, [])

  const bannerAd = ads.find(ad => ad.type === "banner")
  const featuredAds = ads.filter(ad => ad.type === "featured")

  const filteredProperties = mockProperties.filter(
    (property) => activeFilter === "all" || property.category === activeFilter
  )

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="flex-1">
        {!isLoading && bannerAd && (
          <section className="relative py-24 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="container px-4 md:px-6">
              <BannerAd ad={bannerAd} />
            </div>
          </section>
        )}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Properties</h2>
                <p className="text-muted-foreground">Explore our most popular rental spaces</p>
              </div>
              <PropertyTypeFilter onFilterChange={setActiveFilter} />
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {!isLoading && featuredAds.map((ad) => (
                <FeaturedAd key={ad.id} ad={ad} />
              ))}
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  type={property.type}
                  location={property.location}
                  price={property.price}
                  rating={property.rating}
                  image={property.image}
                />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button variant="outline" size="lg">
                View All Properties
              </Button>
            </div>
          </div>
        </section>
        <section className="py-12 bg-muted/50 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How It Works</h2>
                <p className="text-muted-foreground max-w-[700px] mx-auto">
                  Simba Rental makes it easy to find and book your perfect space in just a few steps
                </p>
              </div>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Discover</h3>
                  <p className="text-muted-foreground text-center">
                    Browse through our diverse collection of rental properties
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Book</h3>
                  <p className="text-muted-foreground text-center">
                    Select available dates and time slots with our smart calendar
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Enjoy</h3>
                  <p className="text-muted-foreground text-center">
                    Experience your rental with confidence and support
                  </p>
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
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
