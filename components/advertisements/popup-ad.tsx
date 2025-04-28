"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Advertisement } from '@/lib/types/advertisement'
import { BaseAd } from './base-ad'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface PopupAdProps {
  ad: Advertisement
}

export function PopupAd({ ad }: PopupAdProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const showPopup = () => {
      const hasSeenPopup = sessionStorage.getItem(`popup-${ad.id}`)
      if (!hasSeenPopup) {
        setIsOpen(true)
        sessionStorage.setItem(`popup-${ad.id}`, 'true')
      }
    }

    // Show popup after a delay
    const timer = setTimeout(showPopup, 3000)
    return () => clearTimeout(timer)
  }, [ad.id])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{ad.title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <BaseAd ad={ad} className="p-6">
          <div className="space-y-4">
            {ad.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-lg">{ad.content}</p>
              {ad.linkUrl && (
                <Button className="w-full">
                  Learn More
                </Button>
              )}
            </div>
          </div>
        </BaseAd>
      </DialogContent>
    </Dialog>
  )
} 