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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const defaultAd: Partial<Advertisement> = {
  title: "",
  description: "",
  content: "",
  type: "listing" as AdvertisementType,
  status: "pending" as AdvertisementStatus,
  imageUrl: "",
  uploadedImage: null,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{
    isOpen: boolean;
    adId: string | null;
    action: 'approve' | 'reject' | null;
  }>({
    isOpen: false,
    adId: null,
    action: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setNewAd({ ...newAd, uploadedImage: file });
    }
  };

  const handleCreateAd = async () => {
    const now = new Date();
    let imageUrl = newAd.imageUrl;

    if (selectedFile) {
      // Here you would typically upload the file to your storage service
      // and get back a URL. For now, we'll create a temporary object URL
      imageUrl = URL.createObjectURL(selectedFile);
    }

    const ad: Advertisement = {
      ...defaultAd,
      ...newAd,
      id: Math.random().toString(36).substr(2, 9),
      imageUrl: imageUrl,
      createdAt: now,
      updatedAt: now,
      createdBy: 'admin',
    } as Advertisement;

    setAds([...ads, ad]);
    setIsCreating(false);
    setNewAd(defaultAd);
    setSelectedFile(null);
  };

  const handleUpdateAdStatus = (adId: string, newStatus: AdvertisementStatus) => {
    setAds(ads.map(ad => {
      if (ad.id === adId) {
        const updatedAd = {
          ...ad,
          status: newStatus,
          updatedAt: new Date()
        };
        
        // Add a system message about the status change
        const statusMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          content: `Advertisement ${newStatus === 'approved' ? 'approved' : 'rejected'} by admin`,
          senderId: "system",
          senderType: "system",
          timestamp: new Date(),
          read: true
        };
        
        return {
          ...updatedAd,
          messages: [...(updatedAd.messages || []), statusMessage]
        };
      }
      return ad;
    }));
    
    setApprovalDialog({ isOpen: false, adId: null, action: null });
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

  const getStatusBadge = (status: AdvertisementStatus) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "success", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      active: { variant: "default", label: "Active" },
      inactive: { variant: "secondary", label: "Inactive" },
      expired: { variant: "secondary", label: "Expired" },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
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

              <div className="grid gap-4">
                <Label>Advertisement Image</Label>
                <div className="grid gap-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                      </div>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </Label>
                    {selectedFile && (
                      <p className="text-sm text-gray-500">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mx-2">OR</span>
                  </div>
                  <Input
                    id="imageUrl"
                    value={newAd.imageUrl || ''}
                    onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                    type="url"
                  />
                </div>
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
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Advertisement Management</h1>
          <Button onClick={() => setIsCreating(true)}>Create New Advertisement</Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="active">Active Ads</TabsTrigger>
          <TabsTrigger value="all">All Advertisements</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {ads.filter(ad => ad.status === 'pending').map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{ad.title}</CardTitle>
                    <CardDescription>{ad.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => setApprovalDialog({ isOpen: true, adId: ad.id, action: 'approve' })}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setApprovalDialog({ isOpen: true, adId: ad.id, action: 'reject' })}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Type</Label>
                      <p className="text-sm text-muted-foreground">{ad.type}</p>
                    </div>
                    <div className="flex-1">
                      <Label>Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {format(ad.createdAt, 'PPP')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <Label>Status</Label>
                      {getStatusBadge(ad.status)}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Messages</h3>
                    <ScrollArea className="h-[200px] mb-4">
                      <div className="space-y-4">
                        {ad.messages?.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderType === 'admin' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.senderType === 'admin'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {format(message.timestamp, 'p')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(ad.id, newMessage);
                          }
                        }}
                      />
                      <Button onClick={() => handleSendMessage(ad.id, newMessage)}>
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {ads.filter(ad => ad.status === 'active').map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{ad.title}</CardTitle>
                    <CardDescription>{ad.description}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateAdStatus(ad.id, 'inactive')}
                  >
                    Deactivate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Type</Label>
                      <p className="text-sm text-muted-foreground">{ad.type}</p>
                    </div>
                    <div className="flex-1">
                      <Label>Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {format(ad.createdAt, 'PPP')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <Label>Status</Label>
                      {getStatusBadge(ad.status)}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Messages</h3>
                    <ScrollArea className="h-[200px] mb-4">
                      <div className="space-y-4">
                        {ad.messages?.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderType === 'admin' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.senderType === 'admin'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {format(message.timestamp, 'p')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(ad.id, newMessage);
                          }
                        }}
                      />
                      <Button onClick={() => handleSendMessage(ad.id, newMessage)}>
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {ads.map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{ad.title}</CardTitle>
                    <CardDescription>{ad.description}</CardDescription>
                  </div>
                  {getStatusBadge(ad.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Type</Label>
                      <p className="text-sm text-muted-foreground">{ad.type}</p>
                    </div>
                    <div className="flex-1">
                      <Label>Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {format(ad.createdAt, 'PPP')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <Label>Status</Label>
                      {getStatusBadge(ad.status)}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Messages</h3>
                    <ScrollArea className="h-[200px] mb-4">
                      <div className="space-y-4">
                        {ad.messages?.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderType === 'admin' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.senderType === 'admin'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {format(message.timestamp, 'p')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(ad.id, newMessage);
                          }
                        }}
                      />
                      <Button onClick={() => handleSendMessage(ad.id, newMessage)}>
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={approvalDialog.isOpen} onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.action === 'approve' ? 'Approve Advertisement' : 'Reject Advertisement'}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.action === 'approve'
                ? 'Are you sure you want to approve this advertisement? It will be marked as active and visible to users.'
                : 'Are you sure you want to reject this advertisement? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialog({ isOpen: false, adId: null, action: null })}
            >
              Cancel
            </Button>
            <Button
              variant={approvalDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={() => {
                if (approvalDialog.adId) {
                  handleUpdateAdStatus(
                    approvalDialog.adId,
                    approvalDialog.action === 'approve' ? 'approved' : 'rejected'
                  );
                }
              }}
            >
              {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 