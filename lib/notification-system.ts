import { toast } from "@/hooks/use-toast"

export interface NotificationData {
  type:
    | "xp_gained"
    | "level_up"
    | "achievement_unlocked"
    | "streak_bonus"
    | "milestone_reached"
    | "base_xp"
    | "bonus_xp"
    | "first_time_bonus"
    | "perfect_score"
    | "completion_bonus"
    | "time_bonus"
    | "streak_multiplier"
    | "watch_milestone"
    | "streak_milestone"
    | "time_milestone"
    | "social_milestone"
    | "mastery_milestone"
  title: string
  description: string
  xp?: number
  level?: number
  achievement?: string
  streak?: number
  icon?: string
  duration?: number
  color?: string
}

export class NotificationSystem {
  private static queue: NotificationData[] = []
  private static isProcessing = false
  private static toastIds: Record<string, string> = {}

  static async showNotification(data: NotificationData) {
    this.queue.push(data)
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  private static async processQueue() {
    this.isProcessing = true

    while (this.queue.length > 0) {
      const notification = this.queue.shift()!
      await this.displayNotification(notification)
      await this.delay(1000) // 1 second between notifications
    }

    this.isProcessing = false
  }

  private static async displayNotification(data: NotificationData) {
    const { type, title, description, xp, level, achievement, streak, duration = 4000, color } = data

    let emoji = "🎉"
    let className = color || "bg-gradient-to-r from-blue-500 to-purple-600"

    switch (type) {
      case "xp_gained":
        emoji = "⚡"
        className = "bg-gradient-to-r from-yellow-400 to-orange-500"
        break
      case "level_up":
        emoji = "🎊"
        className = "bg-gradient-to-r from-purple-500 to-pink-600"
        break
      case "achievement_unlocked":
        emoji = "🏆"
        className = "bg-gradient-to-r from-yellow-500 to-orange-600"
        break
      case "streak_bonus":
        emoji = "🔥"
        className = "bg-gradient-to-r from-red-500 to-orange-500"
        break
      case "milestone_reached":
        emoji = "🎯"
        className = "bg-gradient-to-r from-green-500 to-blue-500"
        break
      case "base_xp":
        emoji = "📚"
        className = "bg-gradient-to-r from-blue-400 to-blue-600"
        break
      case "bonus_xp":
        emoji = "✨"
        className = "bg-gradient-to-r from-purple-400 to-pink-500"
        break
      case "first_time_bonus":
        emoji = "🆕"
        className = "bg-gradient-to-r from-green-400 to-teal-500"
        break
      case "perfect_score":
        emoji = "💯"
        className = "bg-gradient-to-r from-amber-400 to-orange-500"
        break
      case "completion_bonus":
        emoji = "✅"
        className = "bg-gradient-to-r from-emerald-400 to-green-600"
        break
      case "time_bonus":
        emoji = "⏰"
        className = "bg-gradient-to-r from-cyan-400 to-blue-500"
        break
      case "streak_multiplier":
        emoji = "🔥"
        className = "bg-gradient-to-r from-red-400 to-orange-500"
        break
      case "watch_milestone":
        emoji = "👁️"
        className = "bg-gradient-to-r from-violet-500 to-purple-600"
        break
      case "streak_milestone":
        emoji = "📆"
        className = "bg-gradient-to-r from-amber-500 to-red-500"
        break
      case "time_milestone":
        emoji = "⏱️"
        className = "bg-gradient-to-r from-blue-500 to-indigo-600"
        break
      case "social_milestone":
        emoji = "👍"
        className = "bg-gradient-to-r from-pink-500 to-rose-600"
        break
      case "mastery_milestone":
        emoji = "🌟"
        className = "bg-gradient-to-r from-amber-400 to-yellow-600"
        break
    }

    // Create a unique ID for this notification type to prevent duplicates
    const notificationId = `${type}-${Date.now()}`

    toast({
      id: notificationId,
      title: (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-bold text-white">{title}</span>
        </div>
      ) as any,
      description: (
        <div className="text-white/90">
          <p>{description}</p>
          {xp && <p className="font-semibold mt-1">+{xp} XP</p>}
          {level && <p className="font-semibold mt-1">Level {level} Reached!</p>}
          {streak && <p className="font-semibold mt-1">{streak} Day Streak!</p>}
        </div>
      ) as any,
      className: `${className} border-none text-white shadow-lg`,
      duration,
    })

    // Play celebration sound effect (if available)
    this.playSound(type)
  }

  private static playSound(type: string) {
    try {
      // Create audio context for sound effects
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Different frequencies for different notification types
      const frequencies: Record<string, number[]> = {
        xp_gained: [523, 659], // C5, E5
        level_up: [523, 659, 784, 1047], // C5, E5, G5, C6
        achievement_unlocked: [392, 523, 659, 784], // G4, C5, E5, G5
        streak_bonus: [659, 784, 988], // E5, G5, B5
        milestone_reached: [523, 698, 880], // C5, F5, A5
        base_xp: [440, 554], // A4, C#5
        bonus_xp: [587, 698], // D5, F5
        first_time_bonus: [659, 784, 988], // E5, G5, B5
        perfect_score: [784, 988, 1175], // G5, B5, D6
      }

      const notes = frequencies[type] || [523, 659]

      notes.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        }, index * 100)
      })
    } catch (error) {
      // Silently fail if audio is not supported
      console.log("Audio not supported")
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Base XP notifications
  static showBaseXP(activityType: string, xp: number) {
    let title = "Base XP Earned"
    let description = `You earned base XP for this activity.`

    switch (activityType) {
      case "video_watch":
        title = "Video Watched"
        description = "You earned base XP for watching this video."
        break
      case "video_like":
        title = "Video Liked"
        description = "You earned base XP for liking this video."
        break
      case "quiz_complete":
        title = "Quiz Completed"
        description = "You earned base XP for completing this quiz."
        break
      case "challenge_complete":
        title = "Challenge Completed"
        description = "You earned base XP for completing this challenge."
        break
      case "course_complete":
        title = "Course Completed"
        description = "You earned base XP for completing this course."
        break
    }

    this.showNotification({
      type: "base_xp",
      title,
      description,
      xp,
    })
  }

  // First time bonus
  static showFirstTimeBonus(activityType: string, xp: number) {
    let activity = "activity"

    switch (activityType) {
      case "video_watch":
        activity = "video"
        break
      case "quiz_complete":
        activity = "quiz"
        break
      case "challenge_complete":
        activity = "challenge"
        break
      case "course_complete":
        activity = "course"
        break
    }

    this.showNotification({
      type: "first_time_bonus",
      title: "First Time Bonus!",
      description: `This is your first time completing this ${activity}!`,
      xp,
    })
  }

  // Perfect score bonus
  static showPerfectScoreBonus(xp: number) {
    this.showNotification({
      type: "perfect_score",
      title: "Perfect Score!",
      description: "You achieved a perfect score on this quiz!",
      xp,
    })
  }

  // Completion rate bonus
  static showCompletionBonus(rate: number, xp: number) {
    this.showNotification({
      type: "completion_bonus",
      title: "Completion Bonus",
      description: `You completed ${rate}% of the content!`,
      xp,
    })
  }

  // Time-based bonus
  static showTimeBonus(bonusType: string, xp: number) {
    let title = "Time Bonus"
    let description = "You earned a time-based bonus!"
    let emoji = "⏰"

    switch (bonusType) {
      case "Early Bird":
        title = "Early Bird Bonus"
        description = "You're learning early in the morning!"
        emoji = "🌅"
        break
      case "Night Owl":
        title = "Night Owl Bonus"
        description = "You're learning late at night!"
        emoji = "🦉"
        break
      case "Weekend Warrior":
        title = "Weekend Warrior Bonus"
        description = "You're learning on the weekend!"
        emoji = "⚡"
        break
    }

    this.showNotification({
      type: "time_bonus",
      title,
      description,
      xp,
      icon: emoji,
    })
  }

  // Streak multiplier
  static showStreakMultiplier(streak: number, multiplier: number, xpBonus: number) {
    this.showNotification({
      type: "streak_multiplier",
      title: "Streak Multiplier",
      description: `Your ${streak}-day streak gives you a ${multiplier}x XP multiplier!`,
      xp: xpBonus,
      streak,
    })
  }

  // Watch milestone
  static showWatchMilestone(count: number, xp: number) {
    this.showNotification({
      type: "watch_milestone",
      title: "Watch Milestone",
      description: `You've watched ${count} videos!`,
      xp,
    })
  }

  // Streak milestone
  static showStreakMilestone(days: number, xp: number) {
    this.showNotification({
      type: "streak_milestone",
      title: "Streak Milestone",
      description: `You've maintained a ${days}-day learning streak!`,
      xp,
      streak: days,
    })
  }

  // Time milestone
  static showTimeMilestone(hours: number, xp: number) {
    this.showNotification({
      type: "time_milestone",
      title: "Study Time Milestone",
      description: `You've studied for ${hours} hours!`,
      xp,
    })
  }

  // Social milestone
  static showSocialMilestone(count: number, type: string, xp: number) {
    this.showNotification({
      type: "social_milestone",
      title: "Social Milestone",
      description: `You've ${type} ${count} times!`,
      xp,
    })
  }

  // Mastery milestone
  static showMasteryMilestone(xpTotal: number, xpReward: number) {
    let milestone = ""
    if (xpTotal >= 1000000) milestone = "1 Million"
    else if (xpTotal >= 100000) milestone = "100K"
    else if (xpTotal >= 10000) milestone = "10K"
    else if (xpTotal >= 1000) milestone = "1K"

    this.showNotification({
      type: "mastery_milestone",
      title: "Mastery Milestone",
      description: `You've reached ${milestone} total XP!`,
      xp: xpReward,
    })
  }

  // Original methods
  static showXPGained(xp: number, bonuses: Array<{ type: string; amount: number; description: string }> = []) {
    let description = `You earned ${xp} XP!`
    if (bonuses && bonuses.length > 0) {
      description += "\n" + bonuses.map((b) => `• ${b.description}`).join("\n")
    }

    this.showNotification({
      type: "xp_gained",
      title: "XP Gained!",
      description,
      xp,
    })
  }

  static showLevelUp(newLevel: number, oldLevel: number) {
    this.showNotification({
      type: "level_up",
      title: "Level Up!",
      description: `Congratulations! You've reached Level ${newLevel}!`,
      level: newLevel,
      duration: 6000,
    })
  }

  static showAchievementUnlocked(achievement: { title: string; description: string; xp_reward: number }) {
    this.showNotification({
      type: "achievement_unlocked",
      title: "Achievement Unlocked!",
      description: `${achievement.title}: ${achievement.description}`,
      xp: achievement.xp_reward,
      duration: 6000,
    })
  }

  static showStreakBonus(streak: number, bonusXP: number) {
    this.showNotification({
      type: "streak_bonus",
      title: "Streak Bonus!",
      description: `Amazing! You're on a ${streak}-day learning streak!`,
      streak,
      xp: bonusXP,
      duration: 5000,
    })
  }

  static showMilestone(milestone: string, description: string) {
    this.showNotification({
      type: "milestone_reached",
      title: milestone,
      description,
      duration: 5000,
    })
  }
}
