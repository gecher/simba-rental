"use client";

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
import { Separator } from '@/components/ui/separator';
import { Advertisement, AdvertisementType, AdvertisementStatus, Style, AnimationType } from '@/lib/types/advertisement';
import { ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { createAdvertisement } from '@/lib/services/advertisement';

interface Category {
  id: string;
  name: string;
  description: string;
  baseMultiplier: number;
  type: AdvertisementType;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Property Listing',
    description: 'Showcase your property to potential renters',
    baseMultiplier: 1.0,
    type: 'listing'
  },
  {
    id: '2',
    name: 'Featured Property',
    description: 'Get premium placement for your property',
    baseMultiplier: 1.5,
    type: 'featured'
  },
  {
    id: '3',
    name: 'Banner Ad',
    description: 'Display your ad in the banner section',
    baseMultiplier: 2.0,
    type: 'banner'
  }
];

const pricingTiers = [
  {
    id: '1',
    name: 'Basic',
    basePrice: 50,
    duration: 7,
    features: ['Standard visibility', 'Basic analytics'],
  },
  {
    id: '2',
    name: 'Professional',
    basePrice: 150,
    duration: 30,
    features: ['Enhanced visibility', 'Advanced analytics', 'Priority support'],
  },
  {
    id: '3',
    name: 'Premium',
    basePrice: 300,
    duration: 30,
    features: ['Maximum visibility', 'Complete analytics suite', '24/7 support', 'Custom branding'],
  },
];

const targetingOptions = [
  {
    id: '1',
    name: 'Global',
    type: 'location',
    priceMultiplier: 2.0,
  },
  {
    id: '2',
    name: 'Regional',
    type: 'location',
    priceMultiplier: 1.5,
  },
  {
    id: '3',
    name: 'Local',
    type: 'location',
    priceMultiplier: 1.0,
  },
];

export default function NewAdvertisement() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    startDate: '',
    endDate: '',
    budget: 0,
    targeting: {
      location: '',
      ageRange: '',
      interests: [],
      pages: [],
      userTypes: []
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
    isArchived: false,
    priority: 3
  });
  const [selectedCategory, setSelectedCategory] = useState(categories[1]);
  const [selectedPricingTier, setSelectedPricingTier] = useState(pricingTiers[0]);
  const [selectedTargeting, setSelectedTargeting] = useState(targetingOptions[2]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

  const calculateTotalPrice = () => {
    const basePrice = selectedPricingTier.basePrice;
    const categoryMultiplier = selectedCategory.baseMultiplier;
    const targetingMultiplier = selectedTargeting.priceMultiplier;
    return basePrice * categoryMultiplier * targetingMultiplier;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    const now = new Date();
    const newAd: Advertisement = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      content: formData.content,
      type: selectedCategory.type,
      status: 'pending',
      imageUrl: formData.imageUrl,
      url: formData.linkUrl,
      targeting: {
        locations: selectedLocations,
        propertyTypes: selectedPropertyTypes,
        budget: {
          min: 0,
          max: formData.budget
        }
      },
      style: {
        backgroundColor: formData.style.backgroundColor,
        textColor: formData.style.textColor,
        animation: formData.style.animation as AnimationType
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        lastUpdated: now
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'user123',
      messages: []
    };

    try {
      await createAdvertisement(newAd);
      router.push('/admin/advertisements');
    } catch (error) {
      console.error('Error submitting advertisement:', error);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/advertisements/my-requests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Advertisements
        </Button>
        <h1 className="text-3xl font-bold">Create New Advertisement</h1>
        <p className="text-gray-500 mt-2">
          Fill out the form below to submit a new advertisement request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Advertisement Details</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a compelling title for your advertisement"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a brief description of what you're advertising"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the main content of your advertisement"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Enter the URL of your advertisement image"
                  type="url"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Advertisement Settings</h2>
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory.id}
                  onValueChange={(value) => setSelectedCategory(categories.find(c => c.id === value)!)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">{selectedCategory.description}</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pricingTier">Pricing Tier</Label>
                <Select
                  value={selectedPricingTier.id}
                  onValueChange={(value) => setSelectedPricingTier(pricingTiers.find(p => p.id === value)!)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingTiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name} - ${tier.basePrice} for {tier.duration} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Features included:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {selectedPricingTier.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="targeting">Targeting</Label>
                <Select
                  value={selectedTargeting.id}
                  onValueChange={(value) => setSelectedTargeting(targetingOptions.find(t => t.id === value)!)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select targeting" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetingOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Base Price ({selectedPricingTier.name})</span>
                <span>${selectedPricingTier.basePrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Category Multiplier ({selectedCategory.name})</span>
                <span>{selectedCategory.baseMultiplier}x</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Targeting Multiplier ({selectedTargeting.name})</span>
                <span>{selectedTargeting.priceMultiplier}x</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Total Price</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">
                Duration: {selectedPricingTier.duration} days
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/advertisements/my-requests')}
          >
            Cancel
          </Button>
          <Button type="submit">Submit Advertisement Request</Button>
        </div>
      </form>
    </div>
  );
} 