"use client"

import { useState } from "react"
import { Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface PropertyReviewsProps {
  propertyId: string
  reviews: Review[]
  currentUser?: { id: string; name: string } | null
}

export function PropertyReviews({ propertyId, reviews, currentUser }: PropertyReviewsProps) {
  const [userReview, setUserReview] = useState("")
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [userReviews, setUserReviews] = useState<Review[]>(reviews)

  const averageRating =
    userReviews.length > 0 ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length : 0

  const handleSubmitReview = () => {
    if (!currentUser || userRating === 0 || userReview.trim() === "") return

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: userRating,
        comment: userReview,
        date: new Date().toISOString().split("T")[0],
      }

      setUserReviews([newReview, ...userReviews])
      setUserReview("")
      setUserRating(0)
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-5 w-5",
                star <= Math.floor(averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : star - 0.5 <= averageRating
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "text-muted-foreground",
              )}
            />
          ))}
        </div>
        <span className="font-medium">{averageRating.toFixed(1)}</span>
        <span className="text-muted-foreground">({userReviews.length} reviews)</span>
      </div>

      {currentUser && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your experience with this property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-medium">Your Rating</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        (hoveredRating ? star <= hoveredRating : star <= userRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground hover:text-yellow-400",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Textarea
                placeholder="Write your review here..."
                className="min-h-[100px]"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitReview} disabled={userRating === 0 || userReview.trim() === "" || submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {!currentUser && (
        <Card>
          <CardContent className="p-6 text-center">
            <p>
              Please{" "}
              <a href="/sign-in" className="text-primary hover:underline">
                sign in
              </a>{" "}
              to leave a review.
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>

        {userReviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this property!</p>
        ) : (
          <div className="space-y-4">
            {userReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{review.userName}</CardTitle>
                        <CardDescription className="text-xs">{review.date}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
