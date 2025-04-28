import { Advertisement } from "@/lib/types/advertisement"

// Mock data - replace with your API calls
const mockActiveAds: Advertisement[] = [
  {
    id: "1",
    userId: "user1",
    propertyId: "prop1",
    title: "Luxury Beachfront Villa - Special Offer",
    description: "Experience luxury living with our special summer discount. Book now and save 20% on your stay!",
    type: "banner",
    status: "active",
    startDate: "2024-04-01",
    endDate: "2024-05-01",
    price: 399,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  },
  {
    id: "2",
    userId: "user2",
    propertyId: "prop2",
    title: "Downtown Event Hall - Early Bird Discount",
    description: "Plan your next event with us and get 15% off for early bookings. Perfect for corporate events and celebrations.",
    type: "featured",
    status: "active",
    startDate: "2024-04-15",
    endDate: "2024-05-15",
    price: 199,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  },
  {
    id: "3",
    userId: "user3",
    propertyId: "prop3",
    title: "Professional Soccer Field - Team Package",
    description: "Book our professional soccer field for your team practice or tournament. Special rates for regular bookings.",
    type: "sidebar",
    status: "active",
    startDate: "2024-04-01",
    endDate: "2024-06-01",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  },
]

export async function getActiveAds(type?: string): Promise<Advertisement[]> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
  
  if (type) {
    return mockActiveAds.filter(ad => ad.type === type)
  }
  
  return mockActiveAds
}

export async function getAdsByPage(page: string): Promise<Advertisement[]> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
  
  return mockActiveAds.filter(ad => {
    // Check if the ad should be shown on all pages
    if (ad.type === "banner") return true
    
    // Return ads specific to the page
    switch (page) {
      case "home":
        return ad.type === "featured"
      case "properties":
        return ad.type === "sidebar" || ad.type === "featured"
      default:
        return false
    }
  })
}

export async function trackAdClick(adId: string): Promise<void> {
  // TODO: Implement ad click tracking
  console.log(`Ad clicked: ${adId}`)
}

// Mock storage for advertisements
const advertisements = new Map<string, Advertisement>();

export const createAdvertisement = async (advertisement: Advertisement): Promise<Advertisement> => {
  // In a real application, this would make an API call
  advertisements.set(advertisement.id, advertisement);
  return advertisement;
};

export const getAdvertisement = async (id: string): Promise<Advertisement | undefined> => {
  return advertisements.get(id);
};

export const updateAdvertisement = async (advertisement: Advertisement): Promise<Advertisement> => {
  if (!advertisements.has(advertisement.id)) {
    throw new Error('Advertisement not found');
  }
  advertisements.set(advertisement.id, advertisement);
  return advertisement;
};

export const deleteAdvertisement = async (id: string): Promise<void> => {
  advertisements.delete(id);
}; 