"use client"

import { useState } from "react"
import {
  addDays,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  isBefore,
  isAfter,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RecurringBookingCalendarProps {
  onDatesChange: (dates: Date[]) => void
  selectedDates: Date[]
}

// Mock availability data - in a real app, this would come from an API
const getAvailabilityForDate = (date: Date): "high" | "medium" | "low" | "none" => {
  // Example logic - every weekend has high availability
  const day = date.getDay()
  if (day === 0 || day === 6) return "high"

  // Every Monday and Wednesday has medium availability
  if (day === 1 || day === 3) return "medium"

  // Every Tuesday and Thursday has low availability
  if (day === 2 || day === 4) return "low"

  // Friday has no availability
  return "none"
}

export function RecurringBookingCalendar({ onDatesChange, selectedDates }: RecurringBookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  const toggleDateSelection = (date: Date) => {
    const availability = getAvailabilityForDate(date)
    if (availability === "none") return

    const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, date))

    let newSelectedDates: Date[]
    if (isSelected) {
      // Remove date if already selected
      newSelectedDates = selectedDates.filter((selectedDate) => !isSameDay(selectedDate, date))
    } else {
      // Add date if not already selected
      newSelectedDates = [...selectedDates, date]
    }

    // Sort dates chronologically
    newSelectedDates.sort((a, b) => a.getTime() - b.getTime())
    onDatesChange(newSelectedDates)
  }

  const renderDays = () => {
    const days = []
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "EEE"
    const weekDays = []

    let day = startDate
    for (let i = 0; i < 7; i++) {
      weekDays.push(
        <div key={`header-${i}`} className="text-center text-sm font-medium py-2">
          {format(day, dateFormat)}
        </div>,
      )
      day = addDays(day, 1)
    }

    day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      const week = []
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d")
        const cloneDay = day
        const availability = getAvailabilityForDate(cloneDay)
        const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, cloneDay))
        const isCurrentMonth = isSameDay(day, currentMonth) || (isAfter(day, monthStart) && isBefore(day, monthEnd))
        const isPast = isBefore(day, new Date()) && !isToday(day)

        week.push(
          <button
            key={day.toString()}
            onClick={() => !isPast && toggleDateSelection(cloneDay)}
            disabled={isPast || availability === "none"}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center text-sm relative",
              isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50",
              isPast && "opacity-30 cursor-not-allowed",
              isSelected && "bg-primary text-primary-foreground font-bold",
              !isSelected && !isPast && availability === "high" && "hover:bg-primary/10 font-bold",
              !isSelected && !isPast && availability === "medium" && "hover:bg-primary/10",
              !isSelected && !isPast && availability === "low" && "hover:bg-primary/10 opacity-70",
              !isSelected && !isPast && availability === "none" && "opacity-30 cursor-not-allowed",
            )}
          >
            {formattedDate}
            {!isPast && availability !== "none" && (
              <span
                className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                  availability === "high" && "bg-green-500",
                  availability === "medium" && "bg-yellow-500",
                  availability === "low" && "bg-red-500",
                )}
              />
            )}
          </button>,
        )
        day = addDays(day, 1)
      }
      days.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {week}
        </div>,
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1">{weekDays}</div>
        {days}
      </div>
    )
  }

  return (
    <div className="p-2 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      {renderDays()}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>Low</span>
        </div>
      </div>
    </div>
  )
}
