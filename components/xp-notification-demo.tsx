"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationSystem } from "@/lib/notification-system"
import { useState } from "react"

export function XpNotificationDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const showBaseXpNotifications = () => {
    setIsLoading(true)
    setTimeout(() => {
      NotificationSystem.showBaseXP("video_watch", 50)
    }, 0)
    setTimeout(() => {
      NotificationSystem.showBaseXP("video_like", 15)
    }, 1500)
    setTimeout(() => {
      NotificationSystem.showBaseXP("quiz_complete", 100)
    }, 3000)
    setTimeout(() => {
      NotificationSystem.showBaseXP("challenge_complete", 200)
    }, 4500)
    setTimeout(() => {
      NotificationSystem.showBaseXP("course_complete", 500)
    }, 6000)
    setTimeout(() => setIsLoading(false), 7500)
  }

  const showBonusXpNotifications = () => {
    setIsLoading(true)
    setTimeout(() => {
      NotificationSystem.showFirstTimeBonus("video_watch", 50)
    }, 0)
    setTimeout(() => {
      NotificationSystem.showPerfectScoreBonus(100)
    }, 1500)
    setTimeout(() => {
      NotificationSystem.showCompletionBonus(95, 30)
    }, 3000)
    setTimeout(() => {
      NotificationSystem.showTimeBonus("Early Bird", 20)
    }, 4500)
    setTimeout(() => {
      NotificationSystem.showTimeBonus("Night Owl", 15)
    }, 6000)
    setTimeout(() => {
      NotificationSystem.showTimeBonus("Weekend Warrior", 25)
    }, 7500)
    setTimeout(() => {
      NotificationSystem.showStreakMultiplier(7, 1.75, 75)
    }, 9000)
    setTimeout(() => setIsLoading(false), 10500)
  }

  const showMilestoneNotifications = () => {
    setIsLoading(true)
    setTimeout(() => {
      NotificationSystem.showWatchMilestone(10, 50)
    }, 0)
    setTimeout(() => {
      NotificationSystem.showStreakMilestone(7, 150)
    }, 1500)
    setTimeout(() => {
      NotificationSystem.showTimeMilestone(10, 100)
    }, 3000)
    setTimeout(() => {
      NotificationSystem.showSocialMilestone(50, "liked", 75)
    }, 4500)
    setTimeout(() => {
      NotificationSystem.showMasteryMilestone(1000, 100)
    }, 6000)
    setTimeout(() => setIsLoading(false), 7500)
  }

  const showSystemNotifications = () => {
    setIsLoading(true)
    setTimeout(() => {
      NotificationSystem.showXPGained(150, [
        { type: "base", amount: 100, description: "Base XP" },
        { type: "bonus", amount: 50, description: "Perfect score bonus! 💯" },
      ])
    }, 0)
    setTimeout(() => {
      NotificationSystem.showLevelUp(5, 4)
    }, 1500)
    setTimeout(() => {
      NotificationSystem.showAchievementUnlocked({
        title: "Learning Enthusiast",
        description: "Watch 10 videos",
        xp_reward: 100,
      })
    }, 3000)
    setTimeout(() => {
      NotificationSystem.showStreakBonus(7, 75)
    }, 4500)
    setTimeout(() => {
      NotificationSystem.showMilestone("Halfway There!", "You've completed 50% of the course!")
    }, 6000)
    setTimeout(() => setIsLoading(false), 7500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>XP Notification Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={showBaseXpNotifications} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            Show Base XP Notifications
          </Button>
          <Button onClick={showBonusXpNotifications} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            Show Bonus XP Notifications
          </Button>
          <Button onClick={showMilestoneNotifications} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
            Show Milestone Notifications
          </Button>
          <Button onClick={showSystemNotifications} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            Show System Notifications
          </Button>
        </div>
        {isLoading && <p className="text-center text-sm text-gray-500">Showing notifications... Please wait.</p>}
      </CardContent>
    </Card>
  )
}
