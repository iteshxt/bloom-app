# PRD --- Accountability

Version: 1.0 (Vision)

## 1. Product Overview

### Product Name

Bloom (working title)

### Vision

Build the best accountability platform for two people preparing for a
common goal---placements, interviews, university exams, competitive
programming, fitness, reading, or any habit requiring consistency.

Unlike traditional habit trackers, Accountability emphasizes **verified
progress, shared visibility, focus, and consistency**.

Core question:

> Did we both become better today?

---

# 2. Target Users

Primary: - Couples - Best friends - Coding partners - Study buddies -
Roommates

Future: - Mentor & mentee - Small accountability groups - Teams

---

# 3. Platform

## MVP

- Android (React Native + Expo)

Future - iOS - Tablet - Web Dashboard

---

# 4. Goals

- Build long-term consistency
- Increase accountability
- Prevent fake study tracking
- Encourage positive habits
- Make progress visible
- Keep experience beautiful and minimal

---

# 5. User Flow

1. Splash
2. Google Login
3. Create Profile
4. Invite Partner (code/link)
5. Partner Accepts
6. Connected
7. Home Dashboard

Only one active partner per account.

---

# 6. Navigation

Bottom Navigation (5 tabs)

1. Home
2. Focus
3. Calendar
4. Insights
5. Profile

---

# 7. Home

Shows: - Greeting - Current streak - Today's progress - Today's
missions - Partner card - Partner status - Recent activity - Reflection
reminder - Daily summary shortcut

Partner Card includes: - Avatar - Name - Status - Current focus timer -
Today's completion % - Streak - Last active

---

# 8. Daily Missions

Each user creates customizable missions.

Mission Types: - Counter - Minutes - Duration - Boolean - Checklist -
Questions - Pages - Hours

Properties: - Name - Category - Goal - Verification Type - Repeat
Schedule - Color - Reminder

Verification: - Manual - Timer - LeetCode (MVP) - Future integrations

Examples: - Solve 6 LeetCode problems - Revise 10 DBMS questions - Read
20 pages - Gym 45 minutes - Project work 60 minutes

---

# 9. Focus Mode

Purpose: Track genuine study time.

Features: - Pomodoro presets (25/50/90) - Custom timer - Pause -
Resume - Break mode - Session history

Critical Rule: Foreground-only timing.

If user leaves the app: - Pause timer automatically. When app returns: -
Resume after confirmation or automatically.

Only active app time counts.

Partner can see: - Studying - On Break - Idle - Offline

Future: - Live session animations - Ambient sounds - Deep work
statistics

---

# 10. Presence System

Statuses: - Offline - Online - Studying - On Break - Busy - Sleeping
(manual)

Visible to partner in real time.

---

# 11. Auto Verification

MVP: LeetCode

Flow: - Connect username - Daily sync - Compare solved count -
Auto-complete DSA mission

Future: - GitHub - Codeforces - CodeChef - HackerRank - GeeksforGeeks -
Notion - Google Calendar - Todoist

---

# 12. Calendar

Monthly calendar.

Color Coding: - Blue = My event - Green = Partner - Purple = Shared -
Orange = Interview - Red = Deadline

Supports: - Events - Tasks - Shared events - Reminders - Repeat events

Future: - Google Calendar sync

---

# 13. Reflections

Daily journal.

Prompts: - Reflection - Thought of the day - Wins - Challenges

Searchable later.

Future: - AI summaries - Mood correlation

---

# 14. Mood Tracking

Night notification.

Prompt: How are you feeling today?

5-point scale.

If low mood: Ask: "What distracted you today?"

Options: - Social Media - Gaming - Friends - Family - College -
Overslept - Other + free text

Analytics generated over time.

---

# 15. Heatmaps

Separate heatmap per habit.

Examples: - DSA - Revision - Reading - Gym - Projects

Independent colors.

---

# 16. Analytics

Daily Weekly Monthly

Metrics: - Focus time - Completion % - Streak - Heatmaps - Mood trend -
Distraction trend - Most productive day - Average session - Partner
comparison (non-competitive)

---

# 17. Streak System

Rules: - Daily completion threshold configurable - Freeze tokens
preserve streak

Milestones: 7 14 30 60 100 180 365 days

---

# 18. Theme Unlocks

Unlock via streaks.

Examples: - Forest - Midnight - Ocean - Sakura - Aurora - Galaxy

Cosmetic only.

---

# 19. Daily Freeze

Monthly allowance.

Used when user misses a day.

Does not grant mission completion.

Only preserves streak.

---

# 20. Notifications

Examples: - Partner started studying - Partner completed mission - Daily
reminder - Reflection reminder - Mood check - Weekly report - Calendar
reminder - Streak at risk - Freeze available

---

# 21. Weekly Reports

Includes: - Focus hours - Mission completion - Heatmaps - Mood trend -
Distractions - Calendar - Longest session - Longest streak

---

# 22. Profile

Contains: - Account - Partner - Themes - Linked Accounts - Notification
settings - Privacy - Freeze count

---

# 23. Database (High Level)

Entities: - User - PartnerLink - Mission - MissionCompletion -
FocusSession - CalendarEvent - Reflection - MoodEntry - ThemeUnlock -
Streak - Notification - Integration - WeeklyReport

---

# 24. Tech Stack

Frontend: - React Native - Expo - TypeScript - NativeWind

Backend: - Supabase - PostgreSQL - Realtime - Edge Functions

Authentication: - Google Sign-In

Push: - Expo Notifications

Storage: - Supabase Storage

---

# 25. Non-Functional Requirements

- Mobile-first
- Offline-friendly
- Fast startup (\<2s)
- Battery efficient
- Secure authentication
- Realtime updates
- Dark mode
- Accessibility

---

# 26. Phase 2+

- AI weekly summaries
- AI distraction insights
- AI study planner
- GitHub integration
- Codeforces integration
- Google Calendar sync
- Smart reminders
- Widgets
- Lock screen timer
- Wear OS support
- Shared study rooms
- Voice reflections
- File attachments
- Rich notes
- Shared resources
- Achievement system
- Optional XP economy
- Leaderboards for friend groups
- Mentor mode
- Small study groups
- Cross-device sync
- iOS app
- Web dashboard

---

# 27. Success Metrics

- Daily Active Users
- 7-day retention
- Average focus minutes/day
- Weekly completion rate
- Average streak length
- Reflection completion rate
- Mood check completion
- Partner retention
- Notification engagement

---

# 28. Design Principles

- Minimal
- Calm
- Fast
- No clutter
- Mobile-first
- Human-centered
- Accountability over competition
- Verified progress over self-reporting
- Beautiful analytics
- Presence before productivity

---

# 29. Future Vision

Become the default accountability companion for anyone pursuing
long-term goals with another person, combining verified progress, focus
tracking, presence, reflections, analytics, and AI-powered coaching into
a single, elegant mobile experience.
