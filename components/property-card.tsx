import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface PropertyCardProps {
  id: string
  title: string
  type: string
  location: string
  price: number
  rating: number
  image: string
}

export function PropertyCard({ id, title, type, location, price, rating, image }: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
          <Badge className="absolute top-2 right-2">{type}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{rating}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="font-bold text-lg">${price}</div>
          <div className="text-sm text-muted-foreground">per day</div>
        </CardFooter>
      </Card>
    </Link>
  )
}
