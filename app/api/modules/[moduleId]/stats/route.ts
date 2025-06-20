import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { moduleId: string } }) {
  try {
    const { moduleId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Add basic rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"
    const cacheKey = `${clientIp}:${moduleId}:${userId || "anonymous"}`

    // First, get the module with its videos
    const { data: module, error: moduleError } = await supabase
      .from("modules")
      .select(`
        *,
        videos (*)
      `)
      .eq("id", moduleId)
      .single()

    if (moduleError) {
      console.error("Error fetching module:", moduleError)

      // Handle Supabase specific errors
      if (moduleError.code === "429") {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
      }

      if (moduleError.code === "PGRST116") {
        return NextResponse.json({ error: "Module not found" }, { status: 404 })
      }

      return NextResponse.json({ error: `Database error: ${moduleError.message}` }, { status: 500 })
    }

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    // Get course information separately
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", module.course_id)
      .single()

    if (courseError) {
      console.error("Error fetching course:", courseError)
      // Continue without course data rather than failing completely
    }

    // Attach course to module
    module.course = course || null

    // Calculate stats
    const totalVideos = module.videos?.length || 0
    let completedVideos = 0
    let userProgress = []

    // Get user progress if userId is provided
    if (userId && totalVideos > 0) {
      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("module_id", moduleId)

      if (progressError) {
        console.error("Error fetching user progress:", progressError)
        // Continue with empty progress rather than failing
      } else {
        userProgress = progress || []
        completedVideos = userProgress.filter((p: any) => p.completed).length
      }
    }

    const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

    const stats = {
      totalVideos,
      completedVideos,
      progressPercentage,
      estimatedTime: totalVideos * 15,
    }

    return NextResponse.json({
      module,
      stats,
      userProgress,
    })
  } catch (error) {
    console.error("Error fetching module stats:", error)

    // Ensure we always return a valid JSON response
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: `Failed to fetch module stats: ${errorMessage}` }, { status: 500 })
  }
}
