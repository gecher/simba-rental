"use client";

import { Message, Advertisement, AdvertisementType, AdvertisementStatus } from "@/lib/types/advertisement";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const defaultAd: Partial<Advertisement> = {
  title: "",
  description: "",
  content: "",
  type: "listing" as AdvertisementType,
  status: "pending" as AdvertisementStatus,
  imageUrl: "",
  startDate: null,
  expiryDate: null,
  targeting: {
    locations: [],
    propertyTypes: [],
    budget: {
      min: 0,
      max: 0
    }
  },
  style: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    animation: 'none'
  },
  performance: {
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    lastUpdated: new Date()
  },
  messages: []
};

const adTypes: AdvertisementType[] = ['listing', 'featured', 'banner'];
const adStatuses: AdvertisementStatus[] = ['pending', 'approved', 'rejected', 'active', 'inactive', 'expired'];

export default function AdvertisementsPage() {
  const router = useRouter();
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: '1',
      title: 'Luxury Villa Advertisement',
      description: 'Promote our luxury villa to high-end clients',
      content: 'Experience luxury living at its finest in our Mediterranean-style villa. Features include infinity pool, private tennis court, and stunning ocean views.',
      type: 'featured',
      status: 'pending',
      imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070',
      url: 'https://example.com/luxury-villa',
      targeting: {
        locations: ['Miami', 'Los Angeles'],
        propertyTypes: ['Luxury', 'Villa'],
        budget: { min: 0, max: 1000 }
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        animation: 'none'
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date('2024-03-15T10:30:00'),
      updatedAt: new Date('2024-03-15T14:45:00'),
      createdBy: 'user123',
      messages: [
        {
          id: 'm1',
          content: 'Your advertisement request has been received. We\'ll review it shortly.',
          senderId: 'admin1',
          senderType: 'admin',
          timestamp: new Date('2024-03-15T10:35:00'),
          read: true
        },
        {
          id: 'm2',
          content: 'Could you please provide more details about the villa\'s amenities?',
          senderId: 'admin1',
          senderType: 'admin',
          timestamp: new Date('2024-03-15T11:20:00'),
          read: true
        },
        {
          id: 'm3',
          content: 'The villa includes 6 bedrooms, 7 bathrooms, a private chef\'s kitchen, wine cellar, and a 4-car garage. Should I add these details to the content?',
          senderId: 'user123',
          senderType: 'user',
          timestamp: new Date('2024-03-15T13:45:00'),
          read: true
        }
      ]
    },
    {
      id: '2',
      title: 'Modern Downtown Apartment',
      description: 'Highlight our newly renovated apartment in the heart of the city',
      content: 'Stunning downtown apartment with modern amenities, perfect for young professionals.',
      type: 'listing',
      status: 'approved',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080',
      url: 'https://example.com/downtown-apartment',
      targeting: {
        locations: ['New York', 'Chicago'],
        propertyTypes: ['Apartment', 'Modern'],
        budget: { min: 0, max: 500 }
      },
      style: {
        backgroundColor: '#f8f9fa',
        textColor: '#212529',
        animation: 'fade'
      },
      performance: {
        impressions: 245,
        clicks: 32,
        conversions: 3,
        ctr: 13.06,
        lastUpdated: new Date()
      },
      createdAt: new Date('2024-03-10T09:00:00'),
      updatedAt: new Date('2024-03-14T16:30:00'),
      createdBy: 'user123',
      messages: [
        {
          id: 'm4',
          content: 'Your advertisement has been approved! It will go live within 24 hours.',
          senderId: 'admin2',
          senderType: 'admin',
          timestamp: new Date('2024-03-12T15:20:00'),
          read: true
        },
        {
          id: 'm5',
          content: 'Great news! Your ad is performing well with a 13% click-through rate.',
          senderId: 'admin2',
          senderType: 'admin',
          timestamp: new Date('2024-03-14T16:30:00'),
          read: false
        }
      ]
    },
    {
      id: '3',
      title: 'Beachfront Condo Special Offer',
      description: 'Promote special spring rates for our beachfront property',
      content: 'Limited time offer: Book our beachfront condo for spring and get 15% off! Ocean views, private beach access, and resort-style amenities.',
      type: 'banner',
      status: 'rejected',
      imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070',
      url: 'https://example.com/beachfront-special',
      targeting: {
        locations: ['Miami Beach', 'Fort Lauderdale'],
        propertyTypes: ['Condo', 'Vacation'],
        budget: { min: 0, max: 800 }
      },
      style: {
        backgroundColor: '#e3f2fd',
        textColor: '#0d47a1',
        animation: 'slide'
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date('2024-03-13T11:20:00'),
      updatedAt: new Date('2024-03-14T09:15:00'),
      createdBy: 'user123',
      messages: [
        {
          id: 'm6',
          content: 'Thank you for your submission. We\'re reviewing your advertisement request.',
          senderId: 'admin1',
          senderType: 'admin',
          timestamp: new Date('2024-03-13T11:25:00'),
          read: true
        },
        {
          id: 'm7',
          content: 'We cannot approve this advertisement as it doesn\'t comply with our pricing display guidelines. Please revise the offer details to include all applicable terms and conditions.',
          senderId: 'admin1',
          senderType: 'admin',
          timestamp: new Date('2024-03-14T09:15:00'),
          read: true
        },
        {
          id: 'm8',
          content: 'I\'ll update the content to include the terms. Should I mention blackout dates and minimum stay requirements?',
          senderId: 'user123',
          senderType: 'user',
          timestamp: new Date('2024-03-14T10:30:00'),
          read: true
        },
        {
          id: 'm9',
          content: 'Yes, please include those details. Also add any seasonal rate variations.',
          senderId: 'admin1',
          senderType: 'admin',
          timestamp: new Date('2024-03-14T10:45:00'),
          read: true
        }
      ]
    }
  ]);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [newAd, setNewAd] = useState<Partial<Advertisement>>(defaultAd);
  const [isCreating, setIsCreating] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleCreateAd = () => {
    const now = new Date();
    const ad: Advertisement = {
      ...defaultAd,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
      createdBy: 'admin',
    } as Advertisement;

    setAds([...ads, ad]);
    setIsCreating(false);
    setNewAd(defaultAd);
  };

  const handleUpdateAdStatus = (adId: string, newStatus: AdvertisementStatus) => {
    setAds(ads.map(ad => {
      if (ad.id === adId) {
        return {
          ...ad,
          status: newStatus,
          updatedAt: new Date()
        };
      }
      return ad;
    }));
  };

  const handleSendMessage = (adId: string, content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      senderId: "admin-1",
      senderType: "admin",
      timestamp: new Date(),
      read: false
    };

    setAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === adId
          ? { 
              ...ad, 
              messages: [...(ad.messages || []), newMessage],
              updatedAt: new Date()
            }
          : ad
      )
    );

    setNewMessage('');
  };

  if (isCreating) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setIsCreating(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Advertisements
          </Button>
          <h1 className="text-3xl font-bold">Create New Advertisement</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAd.title || ''}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                  placeholder="Enter advertisement title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAd.description || ''}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  placeholder="Enter advertisement description"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newAd.type}
                  onValueChange={(value: AdvertisementType) => setNewAd({ ...newAd, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {adTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newAd.imageUrl || ''}
                  onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                  placeholder="Enter image URL"
                  type="url"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={newAd.startDate ? new Date(newAd.startDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewAd({ 
                    ...newAd, 
                    startDate: e.target.value ? new Date(e.target.value) : null 
                  })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="datetime-local"
                  value={newAd.expiryDate ? new Date(newAd.expiryDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewAd({ 
                    ...newAd, 
                    expiryDate: e.target.value ? new Date(e.target.value) : null 
                  })}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAd}>Create Advertisement</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Advertisements</h1>
        <Button onClick={() => setIsCreating(true)}>Create New Ad</Button>
      </div>

      <div className="grid gap-6">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600">{ad.description}</p>
                    <div className="flex items-center text-gray-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{ad.messages?.length || 0}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created: {ad.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {ad.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateAdStatus(ad.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateAdStatus(ad.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {ad.status === 'active' && (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateAdStatus(ad.id, 'inactive')}
                    >
                      Deactivate
                    </Button>
                  )}
                  {ad.status === 'inactive' && (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateAdStatus(ad.id, 'active')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Messages</h4>
                <div className="space-y-2">
                  {ad.messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded ${
                        message.senderType === 'admin'
                          ? 'bg-blue-100 ml-auto'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {message.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage(ad.id, newMessage);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleSendMessage(ad.id, newMessage)}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 