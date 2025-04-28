"use client"

import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Advertisement } from "@/lib/types/advertisement"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeaturedAdProps {
  ad: Advertisement
  className?: string
}

export function FeaturedAd({ ad, className = "" }: FeaturedAdProps) {
  if (ad.status !== "active") return null

  return (
    <Link href={`/properties/${ad.propertyId}`}>
      <Card 
        className={`overflow-hidden transition-all hover:shadow-md ${className}`}
        onClick={() => {
          // TODO: Track ad click
        }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={ad.images[0]} 
            alt={ad.title} 
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{ad.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {ad.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="font-bold text-lg">${ad.price}</div>
          <div className="text-sm text-muted-foreground">Limited Time Offer</div>
        </CardFooter>
      </Card>
    </Link>
  )
} 