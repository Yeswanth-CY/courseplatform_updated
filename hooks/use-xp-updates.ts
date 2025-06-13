"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"

// Define the structure of XP update events
interface XPUpdateEvent {
  type: "xp_update" | "achievement_unlocked" | "level_up"
  data: any
}

export function useXPUpdates() {
  const { user, setUser } = useUser()
  const { toast } = useToast()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Function to handle XP updates
  const handleXPUpdate = useCallback(
    (event: XPUpdateEvent) => {
      if (!user) return

      setLastUpdate(new Date())

      if (event.type === "xp_update") {
        // Update user XP
        setUser({
          ...user,
          total_xp: event.data.newTotalXP,
        })

        // Show toast notification
        toast({
          title: `+${event.data.xpGained} XP`,
          description: event.data.reason || "XP awarded!",
          variant: "default",
        })
      } else if (event.type === "achievement_unlocked") {
        // Show achievement notification
        toast({
          title: `Achievement Unlocked! 🏆`,
          description: event.data.title,
          variant: "success",
        })

        // Update user XP from achievement reward
        setUser({
          ...user,
          total_xp: user.total_xp + event.data.xp_reward,
        })
      } else if (event.type === "level_up") {
        // Show level up notification
        toast({
          title: `Level Up! 🎉`,
          description: `You're now level ${event.data.newLevel}!`,
          variant: "success",
        })
      }
    },
    [user, setUser, toast],
  )

  // Function to manually refresh user data
  const refreshUserData = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/users/by-id?id=${user.id}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setLastUpdate(new Date())
        return userData
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }

    return null
  }, [user, setUser])

  // Set up event source for server-sent events
  useEffect(() => {
    if (!user) return

    // Create a function to simulate real-time updates
    // In a production app, you'd use WebSockets or Server-Sent Events
    const setupEventSource = () => {
      // Simulate connection
      setIsConnected(true)

      // Initial data refresh
      refreshUserData()

      // Set up polling at a reasonable interval (5 seconds)
      const interval = setInterval(refreshUserData, 5000)

      return () => {
        clearInterval(interval)
        setIsConnected(false)
      }
    }

    const cleanup = setupEventSource()
    return cleanup
  }, [user, refreshUserData])

  return {
    lastUpdate,
    isConnected,
    refreshUserData,
  }
}
