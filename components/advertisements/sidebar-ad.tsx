"use client"

import Link from "next/link"
import { Advertisement } from "@/lib/types/advertisement"
import { Card, CardContent } from "@/components/ui/card"

interface SidebarAdProps {
  ad: Advertisement
  className?: string
}

export function SidebarAd({ ad, className = "" }: SidebarAdProps) {
  if (ad.status !== "active") return null

  return (
    <Card className={`overflow-hidden ${className}`}>
      <Link
        href={`/properties/${ad.propertyId}`}
        onClick={() => {
          // TODO: Track ad click
        }}
      >
        <div className="aspect-[4/3] relative">
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">{ad.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {ad.description}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
} 