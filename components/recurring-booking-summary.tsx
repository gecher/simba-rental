import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RecurringBookingSummaryProps {
  propertyTitle: string
  dates: Date[]
  slots: string[]
  pricePerBooking: number
}

export function RecurringBookingSummary({
  propertyTitle,
  dates,
  slots,
  pricePerBooking,
}: RecurringBookingSummaryProps) {
  const isFullDay = slots.includes("full-day")
  const totalPrice = pricePerBooking * dates.length

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recurring Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{propertyTitle}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{dates.length} bookings</Badge>
            <span className="text-sm text-muted-foreground">
              {pricePerBooking} × {dates.length} = ${totalPrice}
            </span>
          </div>
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

        <div>
          <h4 className="font-medium mb-2">Selected Dates</h4>
          <ScrollArea className="h-[120px] rounded-md border p-2">
            <div className="space-y-1">
              {dates.map((date, index) => (
                <div key={index} className="flex justify-between items-center text-sm py-1">
                  <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
                  <span className="font-medium">${pricePerBooking}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
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
