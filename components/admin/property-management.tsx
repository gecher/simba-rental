"use client"

import type React from "react"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock property data
const mockProperties = [
  { id: "1", title: "Luxury Beachfront Villa", type: "Apartment", location: "Miami, FL", status: "Active" },
  { id: "2", title: "Downtown Event Hall", type: "Event Hall", location: "New York, NY", status: "Active" },
  {
    id: "3",
    title: "Professional Soccer Field",
    type: "Sports Field",
    location: "Los Angeles, CA",
    status: "Inactive",
  },
  { id: "4", title: "Boutique Hotel Suite", type: "Hotel", location: "Chicago, IL", status: "Active" },
]

export function PropertyManagement() {
  const [properties, setProperties] = useState(mockProperties)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<any>(null)

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to an API
    setIsAddDialogOpen(false)
  }

  const handleEditProperty = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to an API
    setIsEditDialogOpen(false)
  }

  const openEditDialog = (property: any) => {
    setCurrentProperty(property)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Enter the details for the new property.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProperty}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" placeholder="Enter property title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="sports">Sports Field</SelectItem>
                      <SelectItem value="event">Event Hall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Property description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="basePrice">Base Price (per day)</Label>
                  <Input id="basePrice" type="number" placeholder="0.00" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Property</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Manage your rental properties</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        property.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {property.status}
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
                        <DropdownMenuItem onClick={() => openEditDialog(property)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>Update the property details.</DialogDescription>
          </DialogHeader>
          {currentProperty && (
            <form onSubmit={handleEditProperty}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Property Title</Label>
                  <Input id="edit-title" defaultValue={currentProperty.title} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Property Type</Label>
                  <Select defaultValue={currentProperty.type.toLowerCase().replace(" ", "-")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="sports-field">Sports Field</SelectItem>
                      <SelectItem value="event-hall">Event Hall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input id="edit-location" defaultValue={currentProperty.location} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={currentProperty.status.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
