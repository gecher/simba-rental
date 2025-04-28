import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type NotificationType = "message" | "status_change" | "changes_requested"

interface Notification {
  type: NotificationType
  title: string
  message: string
  adId?: string
  timestamp: string
}

export function useNotifications(userId: string) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!userId) return

    const eventSource = new EventSource(`/api/notifications?userId=${userId}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "connected") {
        console.log("Connected to notification stream")
        return
      }

      const notification: Notification = {
        type: data.type,
        title: data.title,
        message: data.message,
        adId: data.adId,
        timestamp: new Date().toISOString(),
      }

      setNotifications(prev => [notification, ...prev])

      // Show toast for new notifications
      toast({
        title: notification.title,
        description: notification.message,
      })
    }

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [userId, toast])

  return {
    notifications,
    clearNotifications: () => setNotifications([]),
    markAsRead: (timestamp: string) => {
      setNotifications(prev =>
        prev.filter(n => n.timestamp !== timestamp)
      )
    },
  }
} 