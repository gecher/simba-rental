"use client"

import { useEffect, useState } from 'react'
import { Advertisement } from '@/lib/types/advertisement'
import { AdvertisementTrackingService } from '@/lib/services/advertisement-tracking'

interface BaseAdProps {
  ad: Advertisement
  className?: string
  children?: React.ReactNode
}

export function BaseAd({ ad, className, children }: BaseAdProps) {
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false)
  const tracker = AdvertisementTrackingService.getInstance()

  useEffect(() => {
    if (!hasTrackedImpression) {
      tracker.trackImpression(ad.id)
      setHasTrackedImpression(true)
    }
  }, [ad.id, hasTrackedImpression, tracker])

  const handleClick = async () => {
    if (ad.linkUrl) {
      await tracker.trackClick(ad.id)
      window.open(ad.linkUrl, '_blank')
    }
  }

  const getStyles = () => {
    return {
      backgroundColor: ad.style.backgroundColor,
      color: ad.style.textColor,
      borderColor: ad.style.borderColor,
      borderRadius: ad.style.borderRadius,
      padding: ad.style.padding,
      width: ad.style.width,
      height: ad.style.height,
      ...getAnimationStyles(),
    }
  }

  const getAnimationStyles = () => {
    switch (ad.style.animation) {
      case 'fade':
        return { animation: 'fadeIn 0.5s ease-in' }
      case 'slide':
        return { animation: 'slideIn 0.5s ease-out' }
      case 'bounce':
        return { animation: 'bounce 0.5s ease-in-out' }
      default:
        return {}
    }
  }

  return (
    <div
      className={`advertisement ${className || ''}`}
      style={getStyles()}
      onClick={handleClick}
      role={ad.linkUrl ? 'button' : 'presentation'}
    >
      {children}
    </div>
  )
} 