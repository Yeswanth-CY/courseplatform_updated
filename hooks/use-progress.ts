"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { NotificationSystem } from "@/lib/notification-system"

export function useProgress() {
  const { user, updateUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const markVideoStarted = async (videoId: string, moduleId?: string, courseId?: string) => {
    if (!user) return

    try {
      const response = await fetch("/api/progress/track-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          activityType: "video_start",
          videoId,
          moduleId,
          courseId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          updateUser(data.user)
        }
      }
    } catch (error) {
      console.error("Error marking video started:", error)
    }
  }

  const markVideoCompleted = async (videoId: string, moduleId?: string, courseId?: string) => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/progress/track-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          activityType: "video_watch",
          videoId,
          moduleId,
          courseId,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Show base XP notification
        NotificationSystem.showBaseXP("video_watch", data.xp.baseXP)

        // Show bonus notifications
        if (data.notifications) {
          // Process bonuses
          data.notifications.bonuses?.forEach((bonus: any) => {
            switch (bonus.type) {
              case "first_time":
                NotificationSystem.showFirstTimeBonus("video_watch", bonus.amount)
                break
              case "time_bonus":
                const bonusName = bonus.description.includes("Early Bird")
                  ? "Early Bird"
                  : bonus.description.includes("Night Owl")
                    ? "Night Owl"
                    : "Weekend Warrior"
                NotificationSystem.showTimeBonus(bonusName, bonus.amount)
                break
              case "streak":
                const streakDays = Number.parseInt(bonus.description.match(/\d+/)?.[0] || "0")
                const multiplier = data.xp.totalXP / data.xp.baseXP
                NotificationSystem.showStreakMultiplier(streakDays, multiplier, bonus.amount)
                break
            }
          })

          // Show level up notification
          if (data.notifications.levelUp) {
            NotificationSystem.showLevelUp(data.notifications.levelUp.newLevel, data.notifications.levelUp.oldLevel)
          }

          // Show achievement notifications
          data.notifications.achievements?.forEach((achievement: any) => {
            NotificationSystem.showAchievementUnlocked(achievement)

            // Check for milestone achievements
            if (achievement.category === "learning") {
              const count = Number.parseInt(achievement.title.match(/\d+/)?.[0] || "0")
              if (count > 0) {
                NotificationSystem.showWatchMilestone(count, achievement.xp_reward)
              }
            } else if (achievement.category === "consistency") {
              const days = Number.parseInt(achievement.title.match(/\d+/)?.[0] || "0")
              if (days > 0) {
                NotificationSystem.showStreakMilestone(days, achievement.xp_reward)
              }
            } else if (achievement.category === "mastery") {
              const xpTotal = Number.parseInt(
                achievement.title
                  .match(/\d+[KM]?/)?.[0]
                  .replace("K", "000")
                  .replace("M", "000000") || "0",
              )
              if (xpTotal > 0) {
                NotificationSystem.showMasteryMilestone(xpTotal, achievement.xp_reward)
              }
            }
          })

          // Show streak notification
          if (data.notifications.streak && data.notifications.streak >= 3) {
            NotificationSystem.showStreakBonus(data.notifications.streak, 0)
          }
        }

        // Update user data
        if (data.user) {
          updateUser(data.user)
        }
      }
    } catch (error) {
      console.error("Error marking video completed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markSectionCompleted = async (videoId: string, moduleId?: string, courseId?: string, xpGained = 10) => {
    if (!user) return

    try {
      const response = await fetch("/api/progress/simple-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          xp: xpGained,
          reason: "Section completed",
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Show XP notification
        NotificationSystem.showXPGained(xpGained, [])

        // Show level up notification if applicable
        if (data.levelUp) {
          NotificationSystem.showLevelUp(data.levelUp.newLevel, data.levelUp.oldLevel)
        }

        // Update user data
        updateUser({
          ...user,
          total_xp: data.totalXP,
        })
      }
    } catch (error) {
      console.error("Error marking section completed:", error)
    }
  }

  const markQuizCompleted = async (
    videoId: string,
    moduleId?: string,
    courseId?: string,
    score = 100,
    xpGained = 50,
  ) => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/progress/track-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          activityType: "quiz_complete",
          videoId,
          moduleId,
          courseId,
          metadata: {
            score,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Show base XP notification
        NotificationSystem.showBaseXP("quiz_complete", data.xp.baseXP)

        // Show bonus notifications
        if (data.notifications) {
          // Process bonuses
          data.notifications.bonuses?.forEach((bonus: any) => {
            switch (bonus.type) {
              case "first_time":
                NotificationSystem.showFirstTimeBonus("quiz_complete", bonus.amount)
                break
              case "perfect_score":
                NotificationSystem.showPerfectScoreBonus(bonus.amount)
                break
              case "time_bonus":
                const bonusName = bonus.description.includes("Early Bird")
                  ? "Early Bird"
                  : bonus.description.includes("Night Owl")
                    ? "Night Owl"
                    : "Weekend Warrior"
                NotificationSystem.showTimeBonus(bonusName, bonus.amount)
                break
              case "streak":
                const streakDays = Number.parseInt(bonus.description.match(/\d+/)?.[0] || "0")
                const multiplier = data.xp.totalXP / data.xp.baseXP
                NotificationSystem.showStreakMultiplier(streakDays, multiplier, bonus.amount)
                break
            }
          })

          // Show level up notification
          if (data.notifications.levelUp) {
            NotificationSystem.showLevelUp(data.notifications.levelUp.newLevel, data.notifications.levelUp.oldLevel)
          }

          // Show achievement notifications
          data.notifications.achievements?.forEach((achievement: any) => {
            NotificationSystem.showAchievementUnlocked(achievement)
          })
        }

        // Update user data
        if (data.user) {
          updateUser(data.user)
        }
      }
    } catch (error) {
      console.error("Error marking quiz completed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markChallengeCompleted = async (videoId: string, moduleId?: string, courseId?: string) => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/progress/track-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          activityType: "challenge_complete",
          videoId,
          moduleId,
          courseId,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Show base XP notification
        NotificationSystem.showBaseXP("challenge_complete", data.xp.baseXP)

        // Show bonus notifications
        if (data.notifications) {
          // Process bonuses
          data.notifications.bonuses?.forEach((bonus: any) => {
            switch (bonus.type) {
              case "first_time":
                NotificationSystem.showFirstTimeBonus("challenge_complete", bonus.amount)
                break
              case "time_bonus":
                const bonusName = bonus.description.includes("Early Bird")
                  ? "Early Bird"
                  : bonus.description.includes("Night Owl")
                    ? "Night Owl"
                    : "Weekend Warrior"
                NotificationSystem.showTimeBonus(bonusName, bonus.amount)
                break
              case "streak":
                const streakDays = Number.parseInt(bonus.description.match(/\d+/)?.[0] || "0")
                const multiplier = data.xp.totalXP / data.xp.baseXP
                NotificationSystem.showStreakMultiplier(streakDays, multiplier, bonus.amount)
                break
            }
          })

          // Show level up notification
          if (data.notifications.levelUp) {
            NotificationSystem.showLevelUp(data.notifications.levelUp.newLevel, data.notifications.levelUp.oldLevel)
          }

          // Show achievement notifications
          data.notifications.achievements?.forEach((achievement: any) => {
            NotificationSystem.showAchievementUnlocked(achievement)
          })
        }

        // Update user data
        if (data.user) {
          updateUser(data.user)
        }
      }
    } catch (error) {
      console.error("Error marking challenge completed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    markVideoStarted,
    markVideoCompleted,
    markSectionCompleted,
    markQuizCompleted,
    markChallengeCompleted,
    isLoading,
  }
}
