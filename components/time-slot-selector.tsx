"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TimeSlotSelectorProps {
  date: Date
  basePrice: number
  onSlotsSelected: (slots: string[], totalPrice: number) => void
}

// Mock time slot data - in a real app, this would come from an API
const getMockTimeSlots = (date: Date) => {
  const day = date.getDay()

  // Weekend slots (more slots, higher prices)
  if (day === 0 || day === 6) {
    return [
      { id: "1", time: "08:00 - 10:00", price: 300, available: true },
      { id: "2", time: "10:00 - 12:00", price: 350, available: true },
      { id: "3", time: "12:00 - 14:00", price: 400, available: true },
      { id: "4", time: "14:00 - 16:00", price: 400, available: true },
      { id: "5", time: "16:00 - 18:00", price: 350, available: true },
      { id: "6", time: "18:00 - 20:00", price: 300, available: false },
      { id: "7", time: "20:00 - 22:00", price: 250, available: true },
    ]
  }

  // Weekday slots
  return [
    { id: "1", time: "09:00 - 11:00", price: 200, available: true },
    { id: "2", time: "11:00 - 13:00", price: 250, available: day !== 5 },
    { id: "3", time: "13:00 - 15:00", price: 250, available: true },
    { id: "4", time: "15:00 - 17:00", price: 200, available: day !== 3 },
    { id: "5", time: "17:00 - 19:00", price: 300, available: true },
    { id: "6", time: "19:00 - 21:00", price: 250, available: day !== 1 },
  ]
}

export function TimeSlotSelector({ date, basePrice, onSlotsSelected }: TimeSlotSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<string>("day")
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<any[]>([])

  useEffect(() => {
    // Fetch time slots for the selected date
    const slots = getMockTimeSlots(date)
    setTimeSlots(slots)
    setSelectedSlots([])
  }, [date])

  useEffect(() => {
    // Calculate total price based on selected slots
    const total = selectedSlots.reduce((sum, slotId) => {
      const slot = timeSlots.find((s) => s.id === slotId)
      return sum + (slot ? slot.price : 0)
    }, 0)

    onSlotsSelected(selectedSlots, total)
  }, [selectedSlots, timeSlots, onSlotsSelected])

  const toggleSlot = (slotId: string) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId)
      } else {
        return [...prev, slotId]
      }
    })
  }

  const handleFullDaySelect = () => {
    if (selectedSlots.length === timeSlots.filter((slot) => slot.available).length) {
      // If all available slots are selected, deselect all
      setSelectedSlots([])
    } else {
      // Otherwise, select all available slots
      setSelectedSlots(timeSlots.filter((slot) => slot.available).map((slot) => slot.id))
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="day" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="day">Day Rate</TabsTrigger>
          <TabsTrigger value="slots">Time Slots</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="space-y-4 pt-2">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Full Day Rental</h4>
                <p className="text-sm text-muted-foreground">{format(date, "EEEE, MMMM d, yyyy")}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">${basePrice * 3}</div>
                <p className="text-xs text-muted-foreground">Special day rate</p>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => onSlotsSelected(["full-day"], basePrice * 3)}>
              Book Full Day
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="slots" className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{format(date, "EEEE, MMMM d, yyyy")}</p>
            <Button variant="outline" size="sm" onClick={handleFullDaySelect}>
              {selectedSlots.length === timeSlots.filter((slot) => slot.available).length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
          <div className="grid gap-2">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "rounded-lg border p-3 flex justify-between items-center",
                  !slot.available && "opacity-50",
                  selectedSlots.includes(slot.id) && "border-primary bg-primary/5",
                )}
              >
                <div>
                  <h4 className="font-medium">{slot.time}</h4>
                  {!slot.available && <p className="text-xs text-muted-foreground">Not available</p>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-bold">${slot.price}</div>
                  <Button
                    variant={selectedSlots.includes(slot.id) ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => toggleSlot(slot.id)}
                  >
                    {selectedSlots.includes(slot.id) ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
