import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BookingSummaryProps {
  propertyTitle: string
  date: Date
  slots: string[]
  totalPrice: number
}

export function BookingSummary({ propertyTitle, date, slots, totalPrice }: BookingSummaryProps) {
  const isFullDay = slots.includes("full-day")

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{propertyTitle}</h4>
          <p className="text-sm text-muted-foreground">{format(date, "EEEE, MMMM d, yyyy")}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Selected Time</h4>
          {isFullDay ? (
            <p>Full Day Rental</p>
          ) : (
            <ul className="space-y-1">
              {slots.map((slotId) => (
                <li key={slotId} className="text-sm">
                  • Time Slot {slotId}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center font-bold">
          <span>Total Price</span>
          <span>${totalPrice}</span>
        </div>
      </CardContent>
    </Card>
  )
}
