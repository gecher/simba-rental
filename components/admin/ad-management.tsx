"use client"

import type React from "react"

import { useState } from "react"
import { Edit, Eye, MoreHorizontal, Plus, Trash, Calendar, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"

import { Advertisement, AdvertisementType, AdvertisementStatus, Message } from "@/lib/types/advertisement"
import { AdvertisementTrackingService } from "@/lib/services/advertisement-tracking"

// Mock ad data
const mockAds: Advertisement[] = [
  {
    id: "1",
    userId: "user1",
    propertyId: "prop1",
    title: "Summer Special: 20% Off Beach Properties",
    description: "Get 20% off on all beach properties for bookings made in June and July.",
    content: "Limited time offer! Book your dream beach getaway with a special 20% discount.",
    type: "premium",
    status: "active",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f",
    targeting: {
      pages: ["home", "properties"],
      userTypes: ["user", "guest"]
    },
    style: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      animation: "none"
    },
    performance: {
      impressions: 1245,
      clicks: 89,
      ctr: 7.1,
      conversions: 15,
      lastUpdated: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin",
    priority: 1,
    isArchived: false,
    messages: []
  },
  {
    id: "2",
    userId: "user2",
    propertyId: "prop2",
    title: "New Sports Fields Available",
    description: "Check out our newly added professional sports fields.",
    content: "Book our professional-grade sports facilities for your next game or practice.",
    type: "featured",
    status: "pending",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f",
    targeting: {
      pages: ["properties"],
      userTypes: ["user"]
    },
    style: {
      backgroundColor: "#f5f5f5",
      textColor: "#000000",
      animation: "none"
    },
    performance: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      lastUpdated: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin",
    priority: 2,
    isArchived: false,
    messages: []
  },
  {
    id: "3",
    userId: "user3",
    propertyId: "prop3",
    title: "Wedding Venue Promotion",
    description: "Book our premium wedding venues now and get a free catering package.",
    content: "Experience the magic of our premium wedding venues with a free catering package.",
    type: "banner",
    status: "inactive",
    price: 399.99,
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f",
    targeting: {
      pages: ["all"],
      userTypes: ["user", "guest"]
    },
    style: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      animation: "none"
    },
    performance: {
      impressions: 876,
      clicks: 42,
      ctr: 4.8,
      conversions: 10,
      lastUpdated: new Date()
    },
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-31"),
    createdBy: "admin",
    priority: 3,
    isArchived: false,
    messages: []
  },
  {
    id: "4",
    userId: "user4",
    propertyId: "prop4",
    title: "Refer a Friend Program",
    description: "Refer a friend and both get $50 off your next booking.",
    content: "Refer a friend and both get $50 off your next booking.",
    type: "banner",
    status: "active",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f",
    targeting: {
      pages: ["account"],
      userTypes: ["user"]
    },
    style: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      animation: "none"
    },
    performance: {
      impressions: 532,
      clicks: 67,
      ctr: 12.6,
      conversions: 8,
      lastUpdated: new Date()
    },
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-12-31"),
    createdBy: "admin",
    priority: 4,
    isArchived: false,
    messages: []
  }
]

const adTypes: AdvertisementType[] = ["banner", "featured", "premium", "sidebar"]
const adStatuses: AdvertisementStatus[] = ["active", "inactive", "pending", "rejected", "changes_requested", "expired"]

export function AdManagement() {
  const { toast } = useToast()
  const [ads, setAds] = useState<Advertisement[]>(mockAds)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false)
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredAds = ads.filter((ad) => {
    if (filterStatus === "all") return true
    return ad.status === filterStatus
  })

  const getStatusBadge = (status: AdvertisementStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "changes_requested":
        return <Badge className="bg-orange-100 text-orange-800">Changes Requested</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleCreateAd = async (formData: FormData) => {
    try {
      // In a real app, this would send data to an API
      const newAd: Advertisement = {
        id: String(ads.length + 1),
        userId: "user1", // This would come from auth context
        propertyId: formData.get("propertyId") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        type: formData.get("type") as AdvertisementType,
        status: "pending",
        price: Number(formData.get("price")),
        imageUrl: formData.get("imageUrl") as string,
        targeting: {
          pages: [formData.get("targeting.pages") as string],
          userTypes: [formData.get("targeting.userTypes") as string]
        },
        style: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          animation: "none"
        },
        performance: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          lastUpdated: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "user1", // This would come from auth context
        priority: 1,
        isArchived: false,
        messages: []
      }

      setAds(prev => [...prev, newAd])
      setIsAddDialogOpen(false)
      toast({
        title: "Advertisement Created",
        description: "Your advertisement has been created and is pending review."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create advertisement. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateAd = async (id: string, updates: Partial<Advertisement>) => {
    try {
      // In a real app, this would send data to an API
      setAds(prev => prev.map(ad => 
        ad.id === id 
          ? { ...ad, ...updates, updatedAt: new Date() }
          : ad
      ))
      setIsEditDialogOpen(false)
      toast({
        title: "Advertisement Updated",
        description: "Your advertisement has been updated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update advertisement. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAd = async (id: string) => {
    try {
      // In a real app, this would send data to an API
      setAds(prev => prev.filter(ad => ad.id !== id))
      toast({
        title: "Advertisement Deleted",
        description: "Your advertisement has been deleted successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete advertisement. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisement Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Advertisement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Advertisement</DialogTitle>
              <DialogDescription>Create a new advertisement to promote properties or special offers</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleCreateAd(formData)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Enter advertisement title" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Enter advertisement description" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" placeholder="Enter advertisement content" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {adTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" min="0" step="0.01" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" placeholder="Enter image URL" required />
                </div>
                <div className="grid gap-2">
                  <Label>Targeting</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targeting.pages">Pages</Label>
                      <Select name="targeting.pages" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="properties">Properties</SelectItem>
                          <SelectItem value="property-details">Property Details</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="targeting.userTypes">User Types</Label>
                      <Select name="targeting.userTypes" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guest">Guest</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="host">Host</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Advertisement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advertisements</CardTitle>
          <CardDescription>Manage your promotional advertisements and campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {adStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell className="capitalize">{ad.type}</TableCell>
                  <TableCell>{getStatusBadge(ad.status)}</TableCell>
                  <TableCell>${ad.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Impressions: {ad.performance.impressions}</div>
                      <div>CTR: {ad.performance.ctr.toFixed(2)}%</div>
                    </div>
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
                        <DropdownMenuItem onClick={() => {
                          setCurrentAd(ad);
                          setIsPerformanceDialogOpen(true);
                        }}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Stats
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setCurrentAd(ad);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteAd(ad.id)} className="text-destructive">
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

      {currentAd && (
        <>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Advertisement</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateAd(currentAd.id, {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  content: formData.get('content') as string,
                  type: formData.get('type') as AdvertisementType,
                  status: formData.get('status') as AdvertisementStatus,
                  price: Number(formData.get('price')),
                  imageUrl: formData.get('imageUrl') as string,
                });
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      defaultValue={currentAd.title}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={currentAd.description}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea
                      id="edit-content"
                      name="content"
                      defaultValue={currentAd.content}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-type">Type</Label>
                      <Select name="type" defaultValue={currentAd.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {adTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select name="status" defaultValue={currentAd.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {adStatuses.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={currentAd.price}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-imageUrl">Image URL</Label>
                    <Input
                      id="edit-imageUrl"
                      name="imageUrl"
                      type="url"
                      defaultValue={currentAd.imageUrl}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isPerformanceDialogOpen} onOpenChange={setIsPerformanceDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Performance Metrics - {currentAd.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Impressions</h4>
                    <p className="text-2xl font-bold">{currentAd.performance.impressions}</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Clicks</h4>
                    <p className="text-2xl font-bold">{currentAd.performance.clicks}</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">CTR</h4>
                    <p className="text-2xl font-bold">{currentAd.performance.ctr.toFixed(2)}%</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Conversions</h4>
                    <p className="text-2xl font-bold">{currentAd.performance.conversions}</p>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
