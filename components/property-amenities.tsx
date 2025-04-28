import type React from "react"
import {
  Bath,
  Bed,
  Car,
  Coffee,
  Utensils,
  Wifi,
  Tv,
  Snowflake,
  Waves,
  DumbbellIcon,
  FishIcon as Swim,
  Trees,
  ShipWheelIcon as Wheelchair,
  Dog,
  Baby,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface PropertyAmenityProps {
  icon: React.ReactNode
  label: string
  available?: boolean
}

export function PropertyAmenity({ icon, label, available = true }: PropertyAmenityProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-md",
        available ? "text-foreground" : "text-muted-foreground opacity-60",
      )}
    >
      <div className="shrink-0">{icon}</div>
      <span className="text-sm">{label}</span>
      {!available && <span className="text-xs text-muted-foreground ml-auto">(Not available)</span>}
    </div>
  )
}

interface PropertyAmenitiesProps {
  amenities: {
    name: string
    available: boolean
  }[]
}

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  // Map of amenity names to their icons
  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="h-4 w-4" />,
    TV: <Tv className="h-4 w-4" />,
    Kitchen: <Utensils className="h-4 w-4" />,
    "Air Conditioning": <Snowflake className="h-4 w-4" />,
    Parking: <Car className="h-4 w-4" />,
    Pool: <Swim className="h-4 w-4" />,
    "Hot Tub": <Waves className="h-4 w-4" />,
    Gym: <DumbbellIcon className="h-4 w-4" />,
    "Coffee Maker": <Coffee className="h-4 w-4" />,
    Bathroom: <Bath className="h-4 w-4" />,
    Bedroom: <Bed className="h-4 w-4" />,
    Garden: <Trees className="h-4 w-4" />,
    "Wheelchair Accessible": <Wheelchair className="h-4 w-4" />,
    "Pet Friendly": <Dog className="h-4 w-4" />,
    "Family Friendly": <Baby className="h-4 w-4" />,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {amenities.map((amenity) => (
        <PropertyAmenity
          key={amenity.name}
          icon={amenityIcons[amenity.name] || <Coffee className="h-4 w-4" />}
          label={amenity.name}
          available={amenity.available}
        />
      ))}
    </div>
  )
}
