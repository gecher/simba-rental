"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PropertyTypeFilterProps {
  onFilterChange: (filter: string) => void
}

export function PropertyTypeFilter({ onFilterChange }: PropertyTypeFilterProps) {
  const [activeFilter, setActiveFilter] = useState("all")

  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
    onFilterChange(value)
  }

  return (
    <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={handleFilterChange}>
      <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="sports">Sports</TabsTrigger>
        <TabsTrigger value="hotels">Hotels</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
