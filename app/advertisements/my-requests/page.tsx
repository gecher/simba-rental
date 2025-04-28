"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Advertisement, AdvertisementStatus } from '@/lib/types/advertisement'
import { Plus, MessageCircle } from 'lucide-react'

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function MyRequests() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [requests, setRequests] = useState<Advertisement[]>([])

  useEffect(() => {
    setIsClient(true)
    // TODO: Fetch user's advertisement requests
    // This is mock data for now
    setRequests([
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
    ])
  }, [])

  const getStatusBadge = (status: AdvertisementStatus) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
      expired: 'bg-purple-100 text-purple-800'
    }

    return (
      <Badge className={statusStyles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Advertisement Requests</h1>
          <p className="text-gray-500 mt-1">
            Manage and track your advertisement requests
          </p>
        </div>
        <Button onClick={() => router.push('/advertisements/request')}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">No Advertisement Requests</h3>
            <p className="text-gray-500 text-center mb-4">
              You haven't submitted any advertisement requests yet.
            </p>
            <Button onClick={() => router.push('/advertisements/request')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-gray-600">{request.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {request.messages.some(m => !m.read && m.senderType === 'admin') && (
                      <div className="flex items-center text-blue-600">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {request.messages.filter(m => !m.read && m.senderType === 'admin').length} new
                        </span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/advertisements/requests/${request.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{request.type.charAt(0).toUpperCase() + request.type.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium">{formatDate(new Date(request.createdAt))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(new Date(request.updatedAt))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Messages</p>
                    <div className="font-medium flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{request.messages.length}</span>
                      {request.messages.some(m => !m.read && m.senderType === 'admin') && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                          {request.messages.filter(m => !m.read && m.senderType === 'admin').length} new
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {request.messages.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium mb-2">Latest Message</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{request.messages[request.messages.length - 1].content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(new Date(request.messages[request.messages.length - 1].timestamp))}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 