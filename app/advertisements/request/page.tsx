"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AdvertisementType } from "@/lib/types/advertisement"

const adTypes: AdvertisementType[] = ["listing", "featured", "banner"]

const adTypePrices = {
  listing: 50,
  featured: 100,
  banner: 200,
}

const adTypeDurations = {
  listing: 30,
  featured: 14,
  banner: 7,
}

interface FormData {
  title: string;
  description: string;
  content: string;
  type: AdvertisementType;
  imageUrl: string;
  url: string;
  budget: number;
  startDate: Date;
  expiryDate: Date;
}

interface FormErrors {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  url?: string;
}

export default function RequestAdvertisement() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const expiryDate = new Date(tomorrow);
    expiryDate.setDate(expiryDate.getDate() + adTypeDurations.listing);
    
    return {
      title: "",
      description: "",
      content: "",
      type: "listing",
      imageUrl: "",
      url: "",
      budget: adTypePrices.listing,
      startDate: tomorrow,
      expiryDate: expiryDate,
    }
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required"
    } else {
      try {
        new URL(formData.imageUrl)
      } catch {
        newErrors.imageUrl = "Please enter a valid URL"
      }
    }

    if (!formData.url.trim()) {
      newErrors.url = "Landing page URL is required"
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = "Please enter a valid URL"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // TODO: Replace with your API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      toast({
        title: "Advertisement Request Submitted",
        description: "Your request has been submitted for review. You will be notified once it's approved.",
      })
      
      router.push("/advertisements/my-requests")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit advertisement request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTypeChange = (value: AdvertisementType) => {
    const startDate = new Date(formData.startDate);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(startDate.getDate() + adTypeDurations[value]);

    setFormData({
      ...formData,
      type: value,
      budget: adTypePrices[value],
      expiryDate: expiryDate,
    })
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/advertisements")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Advertisements
        </Button>
        <h1 className="text-3xl font-bold">Request Advertisement</h1>
        <p className="text-gray-500 mt-2">
          Fill out the form below to submit your advertisement request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Advertisement Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {adTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} - ${adTypePrices[type]} ({adTypeDurations[type]} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Select the type of advertisement you want to create.
                  Different types have different visibility levels, prices, and durations.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate.toISOString().split('T')[0]}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newStartDate = new Date(e.target.value);
                      const newExpiryDate = new Date(newStartDate);
                      newExpiryDate.setDate(newStartDate.getDate() + adTypeDurations[formData.type]);
                      setFormData({
                        ...formData,
                        startDate: newStartDate,
                        expiryDate: newExpiryDate,
                      });
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Advertisement will start at 00:00 on this date
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date (Auto-calculated)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate.toISOString().split('T')[0]}
                    disabled
                  />
                  <p className="text-sm text-gray-500">
                    Based on {adTypeDurations[formData.type]} days duration
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a compelling title for your advertisement"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a brief description of what you're advertising"
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the main content of your advertisement"
                  className={errors.content ? "border-red-500" : ""}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Enter the URL of your advertisement image"
                  className={errors.imageUrl ? "border-red-500" : ""}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-500">{errors.imageUrl}</p>
                )}
                <p className="text-sm text-gray-500">
                  Provide a URL to a high-quality image for your advertisement.
                  The image should be at least 1200x800 pixels.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="url">Landing Page URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Enter the URL where users will be directed"
                  className={errors.url ? "border-red-500" : ""}
                />
                {errors.url && (
                  <p className="text-sm text-red-500">{errors.url}</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Price Summary</h3>
                <p className="text-sm text-gray-600">
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Advertisement: ${formData.budget}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Prices are for a 30-day period. Your advertisement will be reviewed before going live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/advertisements")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  )
} 