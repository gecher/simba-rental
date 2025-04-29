export type AdvertisementType = 'listing' | 'featured' | 'banner';
export type AdvertisementStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'expired';
export type AnimationType = 'fade' | 'slide' | 'bounce' | 'none';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: 'user' | 'admin';
  timestamp: Date;
  read: boolean;
}

export interface Performance {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  lastUpdated: Date;
}

export interface Style {
  backgroundColor: string;
  textColor: string;
  animation: AnimationType;
}

export interface Targeting {
  locations: string[];
  propertyTypes: string[];
  budget: {
    min: number;
    max: number;
  };
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  content: string;
  type: AdvertisementType;
  status: AdvertisementStatus;
  imageUrl: string;
  uploadedImage?: File | null;
  url: string;
  targeting: Targeting;
  style: Style;
  performance: Performance;
  startDate: Date | null;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  messages: Message[];
}

export type AdRequest = Omit<Advertisement, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'performance' | 'messages' | 'notes' | 'rejectionReason' | 'changesRequested'> 