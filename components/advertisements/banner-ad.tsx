"use client"

import Link from "next/link"
import { Advertisement } from "@/lib/types/advertisement"

interface BannerAdProps {
  ad: Advertisement
  className?: string
}

export function BannerAd({ ad, className = "" }: BannerAdProps) {
  if (ad.status !== "active") return null

  return (
    <Link
      href={`/properties/${ad.propertyId}`}
      className={`block w-full overflow-hidden rounded-lg ${className}`}
      onClick={() => {
        // TODO: Track ad click
      }}
    >
      <div className="relative aspect-[21/9]">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{ad.title}</h3>
          <p className="text-white/90">{ad.description}</p>
        </div>
      </div>
    </Link>
  )
} 