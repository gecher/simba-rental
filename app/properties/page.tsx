"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarAd } from "@/components/advertisements/sidebar-ad"
import { FeaturedAd } from "@/components/advertisements/featured-ad"
import { getAdsByPage } from "@/lib/services/advertisement"
import { Advertisement } from "@/lib/types/advertisement"

// Mock property data
const mockProperties = [
  {
    id: "1",
    title: "Luxury Beachfront Villa",
    type: "Apartment",
    location: "Miami, FL",
    price: 250,
    rating: 4.9,
    description: "A stunning beachfront villa with panoramic ocean views, private pool, and direct beach access.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Downtown Event Hall",
    type: "Event Hall",
    location: "New York, NY",
    price: 500,
    rating: 4.7,
    description: "An elegant event hall in the heart of downtown, perfect for corporate events, weddings, and special occasions.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Professional Soccer Field",
    type: "Sports Field",
    location: "Los Angeles, CA",
    price: 120,
    rating: 4.8,
    description: "A professional-grade soccer field with high-quality turf, proper markings, and goals.",
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Boutique Hotel Suite",
    type: "Hotel",
    location: "Chicago, IL",
    price: 180,
    rating: 4.6,
    description: "An elegant boutique hotel suite in downtown Chicago, offering luxury accommodations with a unique blend of modern amenities and classic design.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Mountain View Cabin",
    type: "Cabin",
    location: "Denver, CO",
    price: 150,
    rating: 4.5,
    description: "A cozy cabin with breathtaking mountain views, perfect for a peaceful getaway in nature.",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Rooftop Garden",
    type: "Garden",
    location: "San Francisco, CA",
    price: 200,
    rating: 4.7,
    description: "A beautiful rooftop garden with city views, perfect for outdoor events and gatherings.",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000&auto=format&fit=crop",
  },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedType, setSelectedType] = useState("all")
  const [ads, setAds] = useState<Advertisement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const loadAds = async () => {
      try {
        const pageAds = await getAdsByPage("properties")
        setAds(pageAds)
      } catch (error) {
        console.error('Failed to load ads:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAds()
  }, [])

  const sidebarAds = ads.filter(ad => ad.type === "sidebar")
  const featuredAds = ads.filter(ad => ad.type === "featured")

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || property.type.toLowerCase() === selectedType
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
    return matchesSearch && matchesType && matchesPrice
  })

  if (!isMounted) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Find the perfect property for your needs</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {!isLoading && featuredAds.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Featured Properties</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {featuredAds.map((ad) => (
                    <FeaturedAd key={ad.id} ad={ad} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">All Properties</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredProperties.map((property) => (
                  <Link href={`/properties/${property.id}`} key={property.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video relative">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{property.rating}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="font-bold">${property.price}/day</span>
                        <Button size="sm">View Details</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Property Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="event hall">Event Hall</SelectItem>
                      <SelectItem value="sports field">Sports Field</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="pt-2 px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={1000}
                      step={50}
                      onValueChange={setPriceRange}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </Card>

            {!isLoading && sidebarAds.map((ad) => (
              <SidebarAd key={ad.id} ad={ad} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 