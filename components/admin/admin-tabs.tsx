"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyManagement } from "@/components/admin/property-management"
import { AvailabilityManager } from "@/components/admin/availability-manager"
import { BookingManagement } from "@/components/admin/booking-management"
import { UserManagement } from "@/components/admin/user-management"
import { AdManagement } from "@/components/admin/ad-management"

export function AdminTabs() {
  return (
    <Tabs defaultValue="properties" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-flex">
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="ads">Ads</TabsTrigger>
      </TabsList>
      <TabsContent value="properties" className="space-y-6">
        <PropertyManagement />
      </TabsContent>
      <TabsContent value="availability" className="space-y-6">
        <AvailabilityManager />
      </TabsContent>
      <TabsContent value="bookings" className="space-y-6">
        <BookingManagement />
      </TabsContent>
      <TabsContent value="users" className="space-y-6">
        <UserManagement />
      </TabsContent>
      <TabsContent value="ads" className="space-y-6">
        <AdManagement />
      </TabsContent>
    </Tabs>
  )
}
