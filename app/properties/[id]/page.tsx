"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, MapPin, Star, Repeat, AlertCircle, CheckCircle2 } from "lucide-react"
import { use } from "react"
import { isBefore } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SmartCalendar } from "@/components/smart-calendar"
import { TimeSlotSelector } from "@/components/time-slot-selector"
import { BookingSummary } from "@/components/booking-summary"
import { PropertyAmenities } from "@/components/property-amenities"
import { PropertyReviews } from "@/components/property-reviews"
import { AuthHeader } from "@/components/auth-header"
import { RecurringBookingCalendar } from "@/components/recurring-booking-calendar"
import { RecurringBookingSummary } from "@/components/recurring-booking-summary"
import { PaymentForm } from "@/components/payment-form"
import { sendBookingConfirmationEmail } from "@/lib/email-service"

// Mock property data with images and amenities
const mockProperties = {
  "1": {
    id: "1",
    title: "Luxury Beachfront Villa",
    type: "Apartment",
    location: "Miami, FL",
    price: 250,
    rating: 4.9,
    description:
      "A stunning beachfront villa with panoramic ocean views, private pool, and direct beach access. Perfect for family vacations or special events. This luxurious property offers spacious living areas, modern amenities, and a prime location just steps from the beach.",
    features: ["Ocean View", "Private Pool", "5 Bedrooms", "6 Bathrooms", "Fully Equipped Kitchen", "WiFi", "Parking"],
    amenities: [
      { name: "WiFi", available: true },
      { name: "TV", available: true },
      { name: "Kitchen", available: true },
      { name: "Air Conditioning", available: true },
      { name: "Parking", available: true },
      { name: "Pool", available: true },
      { name: "Hot Tub", available: true },
      { name: "Gym", available: false },
      { name: "Coffee Maker", available: true },
      { name: "Bathroom", available: true },
      { name: "Bedroom", available: true },
      { name: "Garden", available: true },
      { name: "Wheelchair Accessible", available: false },
      { name: "Pet Friendly", available: true },
      { name: "Family Friendly", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "John Smith",
        rating: 5,
        comment:
          "Amazing property with stunning views! The beach access was perfect and the villa had everything we needed for a comfortable stay.",
        date: "2023-12-15",
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Sarah Johnson",
        rating: 4,
        comment:
          "Beautiful villa with great amenities. The pool was fantastic. Only giving 4 stars because the WiFi was a bit spotty during our stay.",
        date: "2023-11-22",
      },
      {
        id: "r3",
        userId: "u3",
        userName: "Michael Brown",
        rating: 5,
        comment:
          "Perfect location and amazing property. We had a wonderful family vacation and will definitely be back!",
        date: "2023-10-05",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Downtown Event Hall",
    type: "Event Hall",
    location: "New York, NY",
    price: 500,
    rating: 4.7,
    description:
      "An elegant event hall in the heart of downtown, perfect for corporate events, weddings, and special occasions. This versatile space features modern design, state-of-the-art sound systems, and customizable lighting to create the perfect atmosphere for your event.",
    features: ["Central Location", "Sound System", "Lighting", "Catering Kitchen", "Restrooms", "WiFi", "Parking"],
    amenities: [
      { name: "WiFi", available: true },
      { name: "TV", available: true },
      { name: "Kitchen", available: true },
      { name: "Air Conditioning", available: true },
      { name: "Parking", available: true },
      { name: "Wheelchair Accessible", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r4",
        userId: "u4",
        userName: "Emily Davis",
        rating: 5,
        comment:
          "Perfect venue for our corporate event. The staff was incredibly helpful and the space was exactly what we needed.",
        date: "2023-12-10",
      },
      {
        id: "r5",
        userId: "u5",
        userName: "David Wilson",
        rating: 4,
        comment: "Great location and beautiful space. The sound system was excellent. Only issue was limited parking.",
        date: "2023-11-18",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Professional Soccer Field",
    type: "Sports Field",
    location: "Los Angeles, CA",
    price: 120,
    rating: 4.8,
    description:
      "A professional-grade soccer field with high-quality turf, proper markings, and goals. Ideal for team practices, friendly matches, or tournaments. The facility includes changing rooms, showers, and spectator seating.",
    features: [
      "Professional Turf",
      "Changing Rooms",
      "Showers",
      "Spectator Seating",
      "Floodlights",
      "Equipment Storage",
    ],
    amenities: [
      { name: "Parking", available: true },
      { name: "Bathroom", available: true },
      { name: "Wheelchair Accessible", available: true },
      { name: "Water Fountain", available: true },
      { name: "First Aid Kit", available: true },
      { name: "Equipment Rental", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f04b7036f1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r6",
        userId: "u6",
        userName: "Carlos Rodriguez",
        rating: 5,
        comment: "Excellent field with perfect turf. Our team loved practicing here!",
        date: "2023-12-05",
      },
      {
        id: "r7",
        userId: "u7",
        userName: "Alex Thompson",
        rating: 5,
        comment: "Great facilities and well-maintained field. The changing rooms were clean and spacious.",
        date: "2023-11-20",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Boutique Hotel Suite",
    type: "Hotel",
    location: "Chicago, IL",
    price: 180,
    rating: 4.6,
    description:
      "An elegant boutique hotel suite in downtown Chicago, offering luxury accommodations with a unique blend of modern amenities and classic design. Enjoy the king-sized bed, spa-like bathroom, and stunning city views.",
    features: ["King Bed", "City View", "En-suite Bathroom", "Mini Bar", "Room Service", "WiFi", "TV"],
    amenities: [
      { name: "WiFi", available: true },
      { name: "TV", available: true },
      { name: "Air Conditioning", available: true },
      { name: "Bathroom", available: true },
      { name: "Bedroom", available: true },
      { name: "Coffee Maker", available: true },
      { name: "Mini Bar", available: true },
      { name: "Room Service", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r8",
        userId: "u8",
        userName: "Lisa Johnson",
        rating: 5,
        comment:
          "Beautiful suite with amazing city views! The bed was incredibly comfortable and the bathroom was luxurious.",
        date: "2023-12-01",
      },
      {
        id: "r9",
        userId: "u9",
        userName: "Robert Brown",
        rating: 4,
        comment: "Lovely room and great service. Only giving 4 stars because the room was a bit smaller than expected.",
        date: "2023-11-10",
      },
    ],
  },
  "5": {
    id: "5",
    title: "Tennis Court Complex",
    type: "Sports Field",
    location: "Boston, MA",
    price: 90,
    rating: 4.5,
    description: "Professional tennis courts with premium surfaces and excellent facilities. Perfect for practice sessions, matches, or tournaments. Includes changing rooms and spectator areas.",
    features: [
      "Professional Courts",
      "Premium Surface",
      "Changing Rooms",
      "Spectator Seating",
      "Equipment Storage",
      "Floodlights",
    ],
    amenities: [
      { name: "Parking", available: true },
      { name: "Bathroom", available: true },
      { name: "Water Fountain", available: true },
      { name: "Equipment Rental", available: true },
      { name: "First Aid Kit", available: true },
      { name: "Wheelchair Accessible", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531926249475-3c77816e1c46?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r13",
        userId: "u13",
        userName: "Sarah Adams",
        rating: 5,
        comment: "Fantastic tennis courts! The surface is perfect and the facilities are well maintained.",
        date: "2023-12-12",
      },
      {
        id: "r14",
        userId: "u14",
        userName: "Tom Wilson",
        rating: 4,
        comment: "Great courts and good amenities. Would be perfect with better lighting for evening games.",
        date: "2023-11-25",
      },
    ],
  },
  "6": {
    id: "6",
    title: "Wedding Venue Hall",
    type: "Event Hall",
    location: "Seattle, WA",
    price: 800,
    rating: 4.9,
    description: "A stunning wedding venue with elegant decor, spacious ballroom, and beautiful garden area. Perfect for creating unforgettable wedding memories with top-notch facilities and services.",
    features: [
      "Elegant Ballroom",
      "Garden Area",
      "Bridal Suite",
      "Catering Kitchen",
      "Dance Floor",
      "Sound System",
      "Lighting",
    ],
    amenities: [
      { name: "Parking", available: true },
      { name: "WiFi", available: true },
      { name: "Kitchen", available: true },
      { name: "Bathroom", available: true },
      { name: "Air Conditioning", available: true },
      { name: "Wheelchair Accessible", available: true },
      { name: "Changing Rooms", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r15",
        userId: "u15",
        userName: "Jennifer Parker",
        rating: 5,
        comment: "The perfect wedding venue! Everything was absolutely beautiful and the staff was amazing.",
        date: "2023-12-08",
      },
      {
        id: "r16",
        userId: "u16",
        userName: "Michael Scott",
        rating: 5,
        comment: "Stunning venue with great amenities. Our wedding was perfect thanks to this beautiful space.",
        date: "2023-11-30",
      },
    ],
  },
  "7": {
    id: "7",
    title: "Luxury Resort Suite",
    type: "Hotel",
    location: "Orlando, FL",
    price: 350,
    rating: 4.8,
    description: "Experience ultimate luxury in our resort suite featuring premium amenities, stunning views, and exclusive access to resort facilities. Perfect for a memorable vacation or special getaway.",
    features: [
      "Ocean View",
      "King Bed",
      "Private Balcony",
      "Living Area",
      "Luxury Bathroom",
      "Mini Kitchen",
      "Resort Access",
    ],
    amenities: [
      { name: "WiFi", available: true },
      { name: "TV", available: true },
      { name: "Air Conditioning", available: true },
      { name: "Mini Bar", available: true },
      { name: "Room Service", available: true },
      { name: "Coffee Maker", available: true },
      { name: "Safe", available: true },
      { name: "Pool Access", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r17",
        userId: "u17",
        userName: "Amanda White",
        rating: 5,
        comment: "Absolutely stunning suite with incredible views! The resort amenities were top-notch.",
        date: "2023-12-14",
      },
      {
        id: "r18",
        userId: "u18",
        userName: "Daniel Lee",
        rating: 4,
        comment: "Beautiful suite and great service. The resort facilities were excellent.",
        date: "2023-11-22",
      },
    ],
  },
  "8": {
    id: "8",
    title: "Basketball Court",
    type: "Sports Field",
    location: "Houston, TX",
    price: 75,
    rating: 4.3,
    description: "A professional indoor basketball court perfect for practice sessions, games, and tournaments. Features high-quality flooring, adjustable hoops, and excellent lighting.",
    features: [
      "Professional Court",
      "Indoor Facility",
      "Changing Rooms",
      "Spectator Seating",
      "Equipment Storage",
      "Scoreboard",
    ],
    amenities: [
      { name: "Parking", available: true },
      { name: "Bathroom", available: true },
      { name: "Water Fountain", available: true },
      { name: "First Aid Kit", available: true },
      { name: "Air Conditioning", available: true },
      { name: "Wheelchair Accessible", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r11",
        userId: "u11",
        userName: "Mike Johnson",
        rating: 5,
        comment: "Excellent court! Perfect for our team practice. Great facilities and very well maintained.",
        date: "2023-12-15",
      },
      {
        id: "r12",
        userId: "u12",
        userName: "Chris Williams",
        rating: 4,
        comment: "Good court with nice amenities. Would be perfect with better parking options.",
        date: "2023-11-28",
      },
    ],
  },
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [activeTab, setActiveTab] = useState("details")
  const [isRecurringBooking, setIsRecurringBooking] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [bookingStep, setBookingStep] = useState<"selection" | "payment" | "confirmation">("selection")
  const [bookingId, setBookingId] = useState<string>("")
  const [recurringPattern, setRecurringPattern] = useState<
    "daily" | 
    "weekdays" | 
    "weekends" | 
    "weekly" | 
    "biweekly" | 
    "monthly" | 
    "monthly_first" |
    "monthly_last" |
    "quarterly" |
    "yearly" |
    null
  >(null)
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("simbaRentalUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Get property data
  const property = mockProperties[id as keyof typeof mockProperties] || {
    id: id,
    title: "Property Not Found",
    type: "Unknown",
    location: "Unknown",
    price: 0,
    rating: 0,
    description: "This property could not be found.",
    features: [],
    amenities: [],
    images: ["/placeholder.svg?height=400&width=600"],
    reviews: [],
  }

  // Function to generate recurring dates based on pattern
  const generateRecurringDates = (startDate: Date, endDate: Date, pattern: string) => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    // Add maximum duration check - 365 days
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(maxEndDate.getDate() + 365);
    
    // Use the earlier of provided end date or max end date
    const effectiveEndDate = isBefore(endDate, maxEndDate) ? endDate : maxEndDate;

    const isWeekday = (date: Date) => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };

    const isWeekend = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    const isFirstDayOfMonth = (date: Date) => {
      return date.getDate() === 1;
    };

    const isLastDayOfMonth = (date: Date) => {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === lastDay;
    };

    while (currentDate <= effectiveEndDate) {
      switch (pattern) {
        case "daily":
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
          break;

        case "weekdays":
          if (isWeekday(currentDate)) {
            dates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
          break;

        case "weekends":
          if (isWeekend(currentDate)) {
            dates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
          break;

        case "weekly":
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 7);
          break;

        case "biweekly":
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 14);
          break;

        case "monthly":
          dates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;

        case "monthly_first":
          if (isFirstDayOfMonth(currentDate)) {
            dates.push(new Date(currentDate));
          }
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1);
          break;

        case "monthly_last":
          if (isLastDayOfMonth(currentDate)) {
            dates.push(new Date(currentDate));
          }
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(0);
          break;

        case "quarterly":
          dates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;

        case "yearly":
          dates.push(new Date(currentDate));
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return dates;
  };

  const handleRecurringToggle = (checked: boolean) => {
    setIsRecurringBooking(checked);
    if (!checked) {
      setRecurringPattern(null);
      setRecurringEndDate(null);
      setSelectedDates([]);
    }
    setSelectedSlots([]);
    setTotalPrice(0);
  };

  const handleRecurringPatternChange = (pattern: string) => {
    setRecurringPattern(pattern as "daily" | "weekdays" | "weekends" | "weekly" | "biweekly" | "monthly" | "monthly_first" | "monthly_last" | "quarterly" | "yearly" | null);
    if (selectedDate && recurringEndDate) {
      const dates = generateRecurringDates(selectedDate, recurringEndDate, pattern);
      setSelectedDates(dates);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    setTotalPrice(0);
    
    if (date && recurringPattern && recurringEndDate) {
      const dates = generateRecurringDates(date, recurringEndDate, recurringPattern);
      setSelectedDates(dates);
    }
  };

  const handleEndDateSelect = (date: Date | null) => {
    setRecurringEndDate(date);
    if (date && selectedDate && recurringPattern) {
      const dates = generateRecurringDates(selectedDate, date, recurringPattern);
      setSelectedDates(dates);
    }
  };

  const handleSlotSelect = (slots: string[], price: number) => {
    setSelectedSlots(slots)

    if (isRecurringBooking) {
      // For recurring bookings, multiply by number of dates
      setTotalPrice(price * selectedDates.length)
    } else {
      setTotalPrice(price)
    }
  }

  const handleProceedToPayment = () => {
    if (!user) {
      // Redirect to sign-in page if not logged in
      router.push(`/sign-in?redirect=/properties/${id}`)
      return
    }
    setBookingStep("payment")
  }

  const handlePaymentComplete = async () => {
    // Generate a booking ID
    const newBookingId = `BK-${Math.floor(Math.random() * 10000)}`;
    setBookingId(newBookingId);
    
    // Get user email from localStorage
    const storedUser = localStorage.getItem("simbaRentalUser");
    const userEmail = storedUser ? JSON.parse(storedUser).email : "guest@example.com";
    
    // Prepare booking details for email
    const bookingDetails = {
      bookingId: newBookingId,
      propertyTitle: property.title,
      propertyLocation: property.location,
      totalAmount: totalPrice,
      paymentMethod: localStorage.getItem("paymentMethod") || "Credit Card",
      date: isRecurringBooking 
        ? selectedDates[0].toISOString() 
        : selectedDate?.toISOString() || new Date().toISOString(),
      slots: selectedSlots,
      isRecurringBooking,
      recurringDates: isRecurringBooking ? selectedDates.map(d => d.toISOString()) : undefined
    };
    
    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(userEmail, bookingDetails);
      console.log("Confirmation email sent successfully");
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }
    
    // Move to confirmation step
    setBookingStep("confirmation");
  };

  const handleCancelPayment = () => {
    setBookingStep("selection")
  }

  const handleNewBooking = () => {
    // Reset all selections and go back to selection step
    setSelectedDate(undefined)
    setSelectedDates([])
    setSelectedSlots([])
    setTotalPrice(0)
    setIsRecurringBooking(false)
    setBookingStep("selection")
    setBookingId("")
    
    // Clear payment method from localStorage
    localStorage.removeItem("paymentMethod")
  }

  // Create a current user object for the reviews component if user is logged in
  const currentUserForReviews = user
    ? {
        id: user.email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.email.split("@")[0],
      }
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6">
            <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Properties</span>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  {property.type}
                </Button>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              {/* Property Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="col-span-1 md:col-span-2 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {property.images.slice(1, 3).map((image, index) => (
                  <div key={index} className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Property Tabs */}
              <Tabs defaultValue="details" className="mb-8" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-6">
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-4">About this property</h2>
                    <p>{property.description}</p>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Features</h2>
                    <ul className="grid grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="amenities" className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <PropertyAmenities amenities={property.amenities} />
                </TabsContent>
                <TabsContent value="reviews" className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                  <PropertyReviews
                    propertyId={property.id}
                    reviews={property.reviews}
                    currentUser={currentUserForReviews}
                  />
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Card className="sticky top-24">
                {bookingStep === "selection" && (
                  <>
                    <CardHeader>
                      <CardTitle>Book this property</CardTitle>
                      <CardDescription>Select dates and time slots to book</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!user && (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Sign in required</AlertTitle>
                          <AlertDescription>
                            You need to{" "}
                            <Link href="/sign-in" className="font-medium underline">
                              sign in
                            </Link>{" "}
                            or{" "}
                            <Link href="/sign-up" className="font-medium underline">
                              create an account
                            </Link>{" "}
                            to complete your booking.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="recurring-booking"
                          checked={isRecurringBooking}
                          onCheckedChange={handleRecurringToggle}
                        />
                        <Label htmlFor="recurring-booking" className="flex items-center gap-1.5">
                          <Repeat className="h-4 w-4" />
                          Recurring Booking
                        </Label>
                      </div>

                      {/* Non-recurring booking flow */}
                      {!isRecurringBooking && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              Select Date
                            </h3>
                            <SmartCalendar onDateSelect={handleDateSelect} />
                          </div>

                          {selectedDate && (
                            <div>
                              <h3 className="font-medium mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Select Time Slots
                              </h3>
                              <TimeSlotSelector
                                date={selectedDate}
                                basePrice={property.price}
                                onSlotsSelected={handleSlotSelect}
                              />
                            </div>
                          )}

                          {selectedSlots.length > 0 && (
                            <BookingSummary
                              propertyTitle={property.title}
                              date={selectedDate!}
                              slots={selectedSlots}
                              totalPrice={totalPrice}
                            />
                          )}
                        </div>
                      )}

                      {/* Recurring booking flow */}
                      {isRecurringBooking && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Repeat className="h-4 w-4" />
                              Recurring Pattern
                            </h3>
                            <Select
                              value={recurringPattern || ""}
                              onValueChange={(value: any) => handleRecurringPatternChange(value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select recurring pattern" />
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

                            {recurringPattern && (
                              <div className="text-sm text-muted-foreground mt-2">
                                {recurringPattern === "daily" && "Booking will repeat every day"}
                                {recurringPattern === "weekdays" && "Booking will repeat Monday through Friday"}
                                {recurringPattern === "weekends" && "Booking will repeat Saturday and Sunday"}
                                {recurringPattern === "weekly" && "Booking will repeat on the same day every week"}
                                {recurringPattern === "biweekly" && "Booking will repeat every two weeks"}
                                {recurringPattern === "monthly" && "Booking will repeat on the same date every month"}
                                {recurringPattern === "monthly_first" && "Booking will repeat on the first day of every month"}
                                {recurringPattern === "monthly_last" && "Booking will repeat on the last day of every month"}
                                {recurringPattern === "quarterly" && "Booking will repeat every three months"}
                                {recurringPattern === "yearly" && "Booking will repeat on the same date every year"}
                              </div>
                            )}
                          </div>

                          {recurringPattern && (
                        <>
                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                                  Start Date
                            </h3>
                                <SmartCalendar onDateSelect={handleDateSelect} />
                          </div>

                              {selectedDate && (
                                <div>
                                  <h3 className="font-medium mb-2 flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    End Date
                                  </h3>
                                  <SmartCalendar onDateSelect={(date) => handleEndDateSelect(date || null)} />
                                  <div className="text-sm text-amber-600 mt-2">
                                    <AlertCircle className="h-4 w-4 inline mr-1" />
                                    Maximum booking duration is 1 year
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {selectedDates.length > 0 && (
                            <div className="rounded-lg border p-4">
                              <h4 className="font-medium mb-2">Selected Recurring Dates:</h4>
                              <div className="space-y-1">
                                {selectedDates.map((date, index) => (
                                  <div key={index} className="text-sm">
                                    {date.toLocaleDateString()}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedDate && recurringPattern && (
                            <div>
                              <h3 className="font-medium mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Select Time Slots
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                These time slots will be applied to all recurring dates
                              </p>
                              <TimeSlotSelector
                                date={selectedDate}
                                basePrice={property.price}
                                onSlotsSelected={handleSlotSelect}
                              />
                            </div>
                          )}

                          {selectedDates.length > 0 && selectedSlots.length > 0 && (
                            <RecurringBookingSummary
                              propertyTitle={property.title}
                              dates={selectedDates}
                              slots={selectedSlots}
                              pricePerBooking={property.price * selectedSlots.length}
                            />
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={
                          (isRecurringBooking && (selectedDates.length === 0 || selectedSlots.length === 0)) ||
                          (!isRecurringBooking && selectedSlots.length === 0)
                        }
                        onClick={handleProceedToPayment}
                      >
                        {isRecurringBooking
                          ? `Proceed to Payment ($${totalPrice})`
                          : `Proceed to Payment ($${totalPrice})`}
                      </Button>
                    </CardFooter>
                  </>
                )}

                {bookingStep === "payment" && (
                  <PaymentForm
                    totalAmount={totalPrice}
                    onPaymentComplete={handlePaymentComplete}
                    onCancel={handleCancelPayment}
                  />
                )}

                {bookingStep === "confirmation" && (
                  <>
                    <CardHeader>
                      <CardTitle>Booking Confirmed!</CardTitle>
                      <CardDescription>Your booking has been successfully completed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-green-50 p-4 text-green-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <h3 className="font-semibold">Thank you for your booking</h3>
                        </div>
                        <p className="mt-2 text-sm">
                          A confirmation email has been sent to your email address. You can view your booking details in
                          your account.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-lg">SIMBA RENTAL</h3>
                          <p className="text-sm text-muted-foreground">Property Rental Receipt</p>
                        </div>
                        
                        <div className="space-y-2 border-t border-b py-3 my-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Receipt #:</span>
                            <span className="text-sm font-medium">{bookingId || `BK-${Math.floor(Math.random() * 10000)}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Date:</span>
                            <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Property:</span>
                            <span className="text-sm font-medium">{property.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Location:</span>
                            <span className="text-sm font-medium">{property.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Payment Method:</span>
                            <span className="text-sm font-medium">{localStorage.getItem("paymentMethod") || "Credit Card"}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total Amount:</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        
                        {localStorage.getItem("paymentMethod") === "cash" && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <p className="text-sm text-amber-800 font-medium">
                              <span className="font-bold">CASH PAYMENT REMINDER:</span> Please bring the exact amount of ${totalPrice.toFixed(2)} in cash when you arrive at the property.
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-4 text-center text-xs text-muted-foreground">
                          <p>Thank you for choosing Simba Rental!</p>
                          <p>This receipt serves as proof of your booking.</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Button className="w-full" onClick={handleNewBooking}>
                        Make Another Booking
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/">Return to Homepage</Link>
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
