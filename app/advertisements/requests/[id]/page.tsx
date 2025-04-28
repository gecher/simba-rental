import { Suspense } from 'react'
import AdvertisementRequestDetailClient from './page.client'

export default function AdvertisementRequestDetail({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <AdvertisementRequestDetailClient id={params.id} />
    </Suspense>
  )
} 