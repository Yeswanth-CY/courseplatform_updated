"use client"

import { XpNotificationDemo } from "@/components/xp-notification-demo"

export default function XpDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">XP Notification System Demo</h1>
      <p className="mb-8 text-gray-600">
        This page demonstrates all the different XP notification types in the EduBuzzX system. Click the buttons below
        to see each category of notifications.
      </p>

      <XpNotificationDemo />

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">XP System Overview</h2>

        <h3 className="text-lg font-medium mt-6 mb-2">1. Base XP Awards</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Video watching</strong>: 50 XP
          </li>
          <li>
            <strong>Video liking</strong>: 15 XP
          </li>
          <li>
            <strong>Quiz completion</strong>: 100 XP
          </li>
          <li>
            <strong>Challenge completion</strong>: 200 XP
          </li>
          <li>
            <strong>Course completion</strong>: 500 XP
          </li>
        </ul>

        <h3 className="text-lg font-medium mt-6 mb-2">2. Bonus XP Factors</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>First-time bonuses</strong>: +50 XP for first-time activities
          </li>
          <li>
            <strong>Perfect scores</strong>: +100 XP for perfect quiz scores
          </li>
          <li>
            <strong>Completion rate bonuses</strong>: +30 XP for 95%+ completion
          </li>
          <li>
            <strong>Time-based bonuses</strong>:
            <ul className="list-circle pl-6 mt-1 space-y-1">
              <li>Early Bird (5-8 AM): +20 XP</li>
              <li>Night Owl (10 PM-2 AM): +15 XP</li>
              <li>Weekend Warrior: +25 XP</li>
            </ul>
          </li>
          <li>
            <strong>Streak multipliers</strong>: Up to 3x for 100+ day streaks
          </li>
        </ul>

        <h3 className="text-lg font-medium mt-6 mb-2">3. Level Calculation</h3>
        <p className="mb-2">The level formula uses a progressive curve:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Level n requires <code>100 * 1.4^(n-1)</code> XP points
          </li>
          <li>This creates an exponential curve where higher levels require more XP</li>
        </ul>

        <h3 className="text-lg font-medium mt-6 mb-2">4. Achievement System</h3>
        <p className="mb-2">Achievements are grouped into categories:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Learning</strong>: Video watching milestones (1, 10, 50, 100, 500)
          </li>
          <li>
            <strong>Consistency</strong>: Streak milestones (3, 7, 30, 100 days)
          </li>
          <li>
            <strong>Time</strong>: Study duration milestones (10, 100, 1000 hours)
          </li>
          <li>
            <strong>Social</strong>: Interaction milestones (50, 200 likes)
          </li>
          <li>
            <strong>Mastery</strong>: XP milestones (1K, 10K, 100K, 1M)
          </li>
        </ul>
      </div>
    </div>
  )
}
