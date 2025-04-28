"use client"

import { useState, useEffect } from "react"
import { addDays, format, startOfWeek, endOfWeek, addWeeks, isSameDay } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { RecurringSchedule, RecurrencePattern } from "@/lib/types/availability"

// Mock property data
const mockProperties = [
  { id: "1", title: "Luxury Beachfront Villa", type: "Apartment" },
  { id: "2", title: "Downtown Event Hall", type: "Event Hall" },
  { id: "3", title: "Professional Soccer Field", type: "Sports Field" },
  { id: "4", title: "Boutique Hotel Suite", type: "Hotel" },
]

export function AvailabilityManager() {
  const [selectedProperty, setSelectedProperty] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [recurrencePattern, setRecurrencePattern] = useState<string>("daily")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewDates, setPreviewDates] = useState<Date[]>([])
  const [timeSlots, setTimeSlots] = useState<any[]>([
    { id: 1, start: "09:00", end: "11:00", price: 200, available: true },
    { id: 2, start: "11:00", end: "13:00", price: 250, available: true },
    { id: 3, start: "13:00", end: "15:00", price: 250, available: true },
  ])

  // Update preview when dates change
  useEffect(() => {
    if (showPreview) {
      const dates = generatePreviewDates()
      setPreviewDates(dates)
    }
  }, [selectedDate, endDate])

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const prevWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1))
  }

  const addTimeSlot = () => {
    const newId = timeSlots.length > 0 ? Math.max(...timeSlots.map((slot) => slot.id)) + 1 : 1
    setTimeSlots([...timeSlots, { id: newId, start: "09:00", end: "11:00", price: 200, available: true }])
  }

  const removeTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
  }

  const updateTimeSlot = (id: number, field: string, value: any) => {
    setTimeSlots(timeSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)))
  }

  const handleDaySelection = (dayIndex: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex)
      } else {
        return [...prev, dayIndex]
      }
    })
  }

  const generatePreviewDates = () => {
    if (!selectedDate) return []
    
    const dates: Date[] = []
    const startDate = new Date(selectedDate)
    const calculatedEndDate = endDate 
      ? new Date(endDate) 
      : (() => {
          const defaultEnd = new Date(startDate)
          defaultEnd.setDate(defaultEnd.getDate() + 365)
          return defaultEnd
        })()

    let currentDate = new Date(startDate)
    while (currentDate <= calculatedEndDate) {
      const dayOfWeek = currentDate.getDay()
      
      switch (recurrencePattern) {
        case 'daily':
          dates.push(new Date(currentDate))
          break
          
        case 'weekdays':
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            dates.push(new Date(currentDate))
          }
          break
          
        case 'weekends':
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            dates.push(new Date(currentDate))
          }
          break
          
        case 'weekly':
          if (selectedDays.includes(dayOfWeek)) {
            dates.push(new Date(currentDate))
          }
          break
          
        case 'biweekly': {
          const weekDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
          if (weekDiff % 2 === 0 && selectedDays.includes(dayOfWeek)) {
            dates.push(new Date(currentDate))
          }
          break
        }
          
        case 'monthly':
          if (currentDate.getDate() === startDate.getDate()) {
            dates.push(new Date(currentDate))
          }
          break
          
        case 'monthly_first':
          if (currentDate.getDate() === 1) {
            dates.push(new Date(currentDate))
          }
          break
          
        case 'monthly_last': {
          const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
          if (currentDate.getDate() === lastDay) {
            dates.push(new Date(currentDate))
          }
          break
        }
          
        case 'quarterly': {
          const monthDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (currentDate.getMonth() - startDate.getMonth())
          if (monthDiff % 3 === 0 && currentDate.getDate() === startDate.getDate()) {
            dates.push(new Date(currentDate))
          }
          break
        }
          
        case 'yearly':
          if (currentDate.getMonth() === startDate.getMonth() && 
              currentDate.getDate() === startDate.getDate()) {
            dates.push(new Date(currentDate))
          }
          break
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return dates
  }

  const handlePreview = () => {
    const dates = generatePreviewDates()
    setPreviewDates(dates)
    setShowPreview(true)
  }

  const handleSaveRecurringSchedule = () => {
    if (!selectedProperty || !selectedDate) return

    const schedule: RecurringSchedule = {
      id: crypto.randomUUID(),
      propertyId: selectedProperty,
      pattern: recurrencePattern as RecurrencePattern,
      daysOfWeek: selectedDays,
      startTime: timeSlots[0]?.start || "09:00",
      endTime: timeSlots[timeSlots.length - 1]?.end || "17:00",
      interval: 60,
      priority: 1,
      startDate: selectedDate.toISOString().split('T')[0]
    }

    // Here you would call your availability service
    console.log('Saving schedule:', schedule)
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    // If end date exists and is before new start date, clear it
    if (date && endDate && endDate < date) {
      setEndDate(undefined)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
  }

  const renderWeekView = () => {
    const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Start from Monday
    const endDate = endOfWeek(currentWeek, { weekStartsOn: 1 })
    const days = []

    let day = startDate
    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </h3>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => (
            <div key={i} className="text-center">
              <div className="mb-1 text-sm font-medium">{format(day, "EEE")}</div>
              <button
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "h-10 w-full rounded-md flex items-center justify-center",
                  selectedDate && isSameDay(day, selectedDate)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {format(day, "d")}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Availability Manager</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Property Availability</CardTitle>
          <CardDescription>Set up availability and pricing for your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="property-select">Select Property</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProperty && (
              <Tabs defaultValue="calendar">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  <TabsTrigger value="recurring">Recurring Schedule</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="space-y-4 pt-4">
                  {renderWeekView()}

                  {selectedDate && (
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Time Slots for {format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                        <Button size="sm" onClick={addTimeSlot}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Slot
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {timeSlots.map((slot) => (
                          <div key={slot.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="grid grid-cols-2 gap-2 flex-1">
                              <div>
                                <Label htmlFor={`start-${slot.id}`} className="text-xs">
                                  Start Time
                                </Label>
                                <Input
                                  id={`start-${slot.id}`}
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) => updateTimeSlot(slot.id, "start", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`end-${slot.id}`} className="text-xs">
                                  End Time
                                </Label>
                                <Input
                                  id={`end-${slot.id}`}
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) => updateTimeSlot(slot.id, "end", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`price-${slot.id}`} className="text-xs">
                                  Price ($)
                                </Label>
                                <Input
                                  id={`price-${slot.id}`}
                                  type="number"
                                  value={slot.price}
                                  onChange={(e) => updateTimeSlot(slot.id, "price", Number.parseInt(e.target.value))}
                                />
                              </div>
                              <div className="flex items-end">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`available-${slot.id}`}
                                    checked={slot.available}
                                    onCheckedChange={(checked) => updateTimeSlot(slot.id, "available", checked)}
                                  />
                                  <Label htmlFor={`available-${slot.id}`}>Available</Label>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTimeSlot(slot.id)}
                              className="text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="recurring" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Create Recurring Schedule</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Set up recurring availability patterns for this property
                      </p>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label>Recurrence Pattern</Label>
                          <Select value={recurrencePattern} onValueChange={setRecurrencePattern}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekdays">Weekdays Only (Mon-Fri)</SelectItem>
                              <SelectItem value="weekends">Weekends Only (Sat-Sun)</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                              <SelectItem value="monthly">Monthly (Same Date)</SelectItem>
                              <SelectItem value="monthly_first">Monthly (First Day)</SelectItem>
                              <SelectItem value="monthly_last">Monthly (Last Day)</SelectItem>
                              <SelectItem value="quarterly">Every 3 Months</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(recurrencePattern === 'weekly' || recurrencePattern === 'biweekly') && (
                          <div className="grid gap-2">
                            <Label>Select Days</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { label: "Mon", value: 1 },
                                { label: "Tue", value: 2 },
                                { label: "Wed", value: 3 },
                                { label: "Thu", value: 4 },
                                { label: "Fri", value: 5 },
                                { label: "Sat", value: 6 },
                                { label: "Sun", value: 0 }
                              ].map(({ label, value }) => (
                                <Button
                                  key={label}
                                  variant={selectedDays.includes(value) ? "default" : "outline"}
                                  className="flex-1"
                                  size="sm"
                                  onClick={() => handleDaySelection(value)}
                                >
                                  {label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={handleStartDateSelect}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid gap-2">
                            <Label>End Date (Optional)</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={endDate}
                                  onSelect={handleEndDateSelect}
                                  disabled={(date) => date < (selectedDate || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Time Slots</h3>
                            <Button size="sm" onClick={addTimeSlot}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Slot
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {timeSlots.map((slot) => (
                              <div key={slot.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                  <div>
                                    <Label htmlFor={`rec-start-${slot.id}`} className="text-xs">
                                      Start Time
                                    </Label>
                                    <Input
                                      id={`rec-start-${slot.id}`}
                                      type="time"
                                      value={slot.start}
                                      onChange={(e) => updateTimeSlot(slot.id, "start", e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`rec-end-${slot.id}`} className="text-xs">
                                      End Time
                                    </Label>
                                    <Input
                                      id={`rec-end-${slot.id}`}
                                      type="time"
                                      value={slot.end}
                                      onChange={(e) => updateTimeSlot(slot.id, "end", e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`rec-price-${slot.id}`} className="text-xs">
                                      Price ($)
                                    </Label>
                                    <Input
                                      id={`rec-price-${slot.id}`}
                                      type="number"
                                      value={slot.price}
                                      onChange={(e) =>
                                        updateTimeSlot(slot.id, "price", Number.parseInt(e.target.value))
                                      }
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id={`rec-available-${slot.id}`}
                                        checked={slot.available}
                                        onCheckedChange={(checked) => updateTimeSlot(slot.id, "available", checked)}
                                      />
                                      <Label htmlFor={`rec-available-${slot.id}`}>Available</Label>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTimeSlot(slot.id)}
                                  className="text-destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={handlePreview}>
                            Preview Schedule
                          </Button>
                          <Button className="flex-1" onClick={handleSaveRecurringSchedule}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Schedule
                          </Button>
                        </div>

                        {showPreview && (
                          <div className="mt-6 space-y-4">
                            <h3 className="font-medium">Preview Schedule</h3>
                            <p className="text-sm text-muted-foreground">
                              {endDate 
                                ? `Showing scheduled dates from ${format(selectedDate!, "PPP")} to ${format(endDate, "PPP")}`
                                : "Showing next 365 days of scheduled dates"}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {previewDates.map((date, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                  <div className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</div>
                                  <div className="mt-2 space-y-1">
                                    {timeSlots.map((slot) => (
                                      <div key={slot.id} className="text-sm">
                                        {slot.start} - {slot.end} (${slot.price})
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
