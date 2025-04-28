"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Advertisement } from '@/lib/types/advertisement'
import { BaseAd } from './base-ad'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AdvertisementTrackingService } from '@/lib/services/advertisement-tracking'

interface NewsletterAdProps {
  ad: Advertisement
}

export function NewsletterAd({ ad }: NewsletterAdProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const tracker = AdvertisementTrackingService.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      await tracker.trackConversion(ad.id)
      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to subscribe:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseAd ad={ad}>
      <Card className="p-6">
        <div className="space-y-4">
          {ad.imageUrl && (
            <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">{ad.title}</h3>
            <p className="text-muted-foreground">{ad.content}</p>
          </div>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Send className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="ml-2">Subscribe</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div className="text-center text-primary">
              <p className="font-semibold">Thank you for subscribing!</p>
              <p className="text-sm text-muted-foreground">
                Check your email for a confirmation message.
              </p>
            </div>
          )}
        </div>
      </Card>
    </BaseAd>
  )
} 