"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, CheckCircle2, ShoppingCartIcon as PaypalIcon, Banknote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentFormProps {
  totalAmount: number
  onPaymentComplete: () => void
  onCancel: () => void
}

export function PaymentForm({ totalAmount, onPaymentComplete, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (paymentMethod === "credit-card") {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
        setError("Please enter a valid card number")
        return false
      }
      if (!cardDetails.cardName) {
        setError("Please enter the cardholder name")
        return false
      }
      if (!cardDetails.expiryDate || !cardDetails.expiryDate.includes("/")) {
        setError("Please enter a valid expiry date (MM/YY)")
        return false
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        setError("Please enter a valid CVV")
        return false
      }
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Store payment method in localStorage
    localStorage.setItem("paymentMethod", paymentMethod)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      // Notify parent component after a brief delay to show success state
      setTimeout(() => {
        onPaymentComplete()
      }, 1500)
    }, 2000)
  }

  if (isComplete) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-4">Your booking has been confirmed.</p>
          <p className="font-medium">Total Paid: ${totalAmount.toFixed(2)}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your booking by providing payment information</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label className="text-base">Select Payment Method</Label>
              <RadioGroup
                defaultValue="credit-card"
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col space-y-1 mt-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Credit / Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                    <PaypalIcon className="h-4 w-4" />
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                    <Banknote className="h-4 w-4" />
                    Cash on Arrival
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Smith"
                    value={cardDetails.cardName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" name="cvv" placeholder="123" value={cardDetails.cvv} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="p-4 text-center border rounded-md bg-muted/30">
                <p className="mb-2">You will be redirected to PayPal to complete your payment.</p>
                <p className="text-sm text-muted-foreground">
                  PayPal securely processes payments without sharing your financial information.
                </p>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="p-4 text-center border rounded-md bg-muted/30">
                <p className="mb-2">You will pay in cash when you arrive at the property.</p>
                <p className="text-sm text-muted-foreground">
                  Please bring the exact amount of ${totalAmount.toFixed(2)} in cash.
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
