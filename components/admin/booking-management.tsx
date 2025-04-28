"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Check, Eye, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock booking data
const mockBookings = [
  {
    id: "B001",
    propertyId: "1",
    propertyTitle: "Luxury Beachfront Villa",
    customerName: "John Smith",
    date: "2024-05-15",
    slots: ["09:00 - 11:00", "11:00 - 13:00"],
    totalPrice: 450,
    status: "Confirmed",
  },
  {
    id: "B002",
    propertyId: "2",
    propertyTitle: "Downtown Event Hall",
    customerName: "Sarah Johnson",
    date: "2024-05-20",
    slots: ["Full Day"],
    totalPrice: 1500,
    status: "Pending",
  },
  {
    id: "B003",
    propertyId: "3",
    propertyTitle: "Professional Soccer Field",
    customerName: "Michael Brown",
    date: "2024-05-18",
    slots: ["14:00 - 16:00", "16:00 - 18:00"],
    totalPrice: 240,
    status: "Confirmed",
  },
  {
    id: "B004",
    propertyId: "4",
    propertyTitle: "Boutique Hotel Suite",
    customerName: "Emily Davis",
    date: "2024-05-25",
    slots: ["Full Day"],
    totalPrice: 540,
    status: "Cancelled",
  },
]

export function BookingManagement() {
  const [bookings, setBookings] = useState(mockBookings)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredBookings = bookings.filter((booking) => {
    let matchesDate = true
    let matchesStatus = true

    if (filterDate) {
      matchesDate = booking.date === format(filterDate, "yyyy-MM-dd")
    }

    if (filterStatus !== "all") {
      matchesStatus = booking.status.toLowerCase() === filterStatus.toLowerCase()
    }

    return matchesDate && matchesStatus
  })

  const viewBookingDetails = (booking: any) => {
    setCurrentBooking(booking)
    setIsViewDialogOpen(true)
  }

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)))
  }

  const clearFilters = () => {
    setFilterDate(undefined)
    setFilterStatus("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>View and manage property bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="filter-date" className="mb-2 block">
                  Filter by Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="filter-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? format(filterDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label htmlFor="filter-status" className="mb-2 block">
                  Filter by Status
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.propertyTitle}</TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewBookingDetails(booking)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {booking.status === "Pending" && (
                              <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "Confirmed")}>
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Booking
                              </DropdownMenuItem>
                            )}
                            {booking.status !== "Cancelled" && (
                              <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "Cancelled")}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No bookings found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information about this booking</DialogDescription>
          </DialogHeader>
          {currentBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Booking ID</h4>
                  <p>{currentBooking.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      currentBooking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : currentBooking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentBooking.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Property</h4>
                <p className="font-medium">{currentBooking.propertyTitle}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                <p>{currentBooking.customerName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                <p>{currentBooking.date}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Time Slots</h4>
                <ul className="list-disc list-inside">
                  {currentBooking.slots.map((slot: string, index: number) => (
                    <li key={index}>{slot}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Price</h4>
                <p className="font-bold">${currentBooking.totalPrice}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {currentBooking && currentBooking.status === "Pending" && (
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  updateBookingStatus(currentBooking.id, "Confirmed")
                  setIsViewDialogOpen(false)
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Confirm Booking
              </Button>
            )}
            {currentBooking && currentBooking.status !== "Cancelled" && (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  updateBookingStatus(currentBooking.id, "Cancelled")
                  setIsViewDialogOpen(false)
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
