"use client"

import { Advertisement } from '@/lib/types/advertisement'
import { BaseAd } from './base-ad'
import { Card } from '@/components/ui/card'

interface InlineAdProps {
  ad: Advertisement
  variant?: 'default' | 'compact' | 'featured'
}

export function InlineAd({ ad, variant = 'default' }: InlineAdProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'flex items-center gap-4 p-4'
      case 'featured':
        return 'p-6 border-2 border-primary'
      default:
        return 'p-4'
    }
  }

  return (
    <BaseAd ad={ad}>
      <Card className={getVariantClasses()}>
        <div className={`grid ${variant === 'compact' ? 'grid-cols-[auto_1fr]' : 'gap-4'}`}>
          {ad.imageUrl && (
            <div className={`
              relative overflow-hidden rounded-lg
              ${variant === 'compact' ? 'w-20 h-20' : 'aspect-video w-full'}
            `}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="space-y-2">
            <h3 className={`font-semibold ${variant === 'featured' ? 'text-xl' : 'text-lg'}`}>
              {ad.title}
            </h3>
            <p className={`text-muted-foreground ${variant === 'compact' ? 'line-clamp-2' : ''}`}>
              {ad.content}
            </p>
            {variant !== 'compact' && ad.linkUrl && (
              <a
                href={ad.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-block mt-2"
              >
                Learn More →
              </a>
            )}
          </div>
        </div>
      </Card>
    </BaseAd>
  )
} 