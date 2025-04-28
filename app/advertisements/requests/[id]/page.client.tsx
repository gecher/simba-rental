"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Advertisement, Message } from '@/lib/types/advertisement'
import { ArrowLeft } from 'lucide-react'

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getStatusBadge = (status: string) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-blue-100 text-blue-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-purple-100 text-purple-800'
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function AdvertisementRequestDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [request, setRequest] = useState<Advertisement | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API call with mock data
    const mockRequest: Advertisement = {
      id,
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
    }

    setRequest(mockRequest)
    setIsLoading(false)
  }, [id])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !request) return

    const message: Message = {
      id: `m${request.messages.length + 1}`,
      content: newMessage,
      senderId: 'user123',
      senderType: 'user',
      timestamp: new Date(),
      read: false
    }

    setRequest({
      ...request,
      messages: [...request.messages, message],
      updatedAt: new Date()
    })

    setNewMessage('')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Advertisement Request Not Found</h3>
            <p className="text-gray-500 text-center mb-4">
              The advertisement request you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/advertisements/my-requests')}>
              Back to My Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/advertisements/my-requests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Requests
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(request.status)}
              <span className="text-gray-500">
                Last updated {formatDate(new Date(request.updatedAt))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advertisement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-gray-600">{request.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Content</h3>
                <p className="text-gray-600">{request.content}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Type</h3>
                <p className="text-gray-600">{request.type.charAt(0).toUpperCase() + request.type.slice(1)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Target Locations</h3>
                <div className="flex gap-2">
                  {request.targeting.locations.map((location) => (
                    <Badge key={location} variant="secondary">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Property Types</h3>
                <div className="flex gap-2">
                  {request.targeting.propertyTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderType === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderType === 'user'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(new Date(message.timestamp))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 