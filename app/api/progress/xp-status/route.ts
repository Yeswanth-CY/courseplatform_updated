import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { XPCalculator } from "@/lib/xp-system"
import { AchievementSystem } from "@/lib/achievement-system"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    // Get user data
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get recent XP transactions
    const { data: recentXP, error: xpError } = await supabase
      .from("xp_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (xpError) {
      console.error("Error fetching XP transactions:", xpError)
    }

    // Get achievement progress
    const achievementProgress = AchievementSystem.getAchievementProgress(userData)

    // Calculate level data
    const levelData = XPCalculator.calculateLevel(userData.total_xp || 0)

    return NextResponse.json({
      user: userData,
      xp: {
        total: userData.total_xp,
        level: levelData.level,
        currentLevelXP: levelData.currentLevelXP,
        nextLevelXP: levelData.nextLevelXP,
        progress: levelData.progress,
      },
      achievements: {
        total: achievementProgress.length,
        unlocked: achievementProgress.filter((a) => a.unlocked).length,
        recent: achievementProgress
          .filter((a) => a.unlocked)
          .sort((a, b) => (b.unlocked_at || "").localeCompare(a.unlocked_at || ""))
          .slice(0, 5),
      },
      recentTransactions: recentXP || [],
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in XP status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
