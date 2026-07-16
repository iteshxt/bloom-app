# Product Requirements Document (PRD) — Bloom

**Version**: 2.0 (Updated MVP)
**Focus**: Accountability, Shared Focus, and Habit Consistency

---

## 1. Product Overview

### Product Name

Bloom

### Vision

Build the best accountability platform for two people preparing for a common goal—placements, interviews, university exams, competitive programming, fitness, reading, or any habit requiring consistency.

Unlike traditional habit trackers, Bloom emphasizes **verified progress, shared visibility, active focus, and consistency**.

### Core Question

> Did we both become better today?

### Rotating Taglines

These taglines rotate dynamically across the splash, onboarding, and loading/skeleton screens:

* "Small Steps, Every Day."
* "Keep Growing."
* "Stay in Sync."
* "Grow Together."
* "Show up today."

---

## 2. Target Users

* **Primary**: Couples, best friends, coding partners, study buddies, roommates.
* **Secondary**: Solo developers/individuals looking for habit consistency with post-registration partner linking options.

---

## 3. Platform

* **MVP**: Android & iOS (React Native + Expo Dev Clients).
* **Design Language**: Material 3 Sage Theme, bold typography, card surfaces, micro-animations, and pulsing skeleton loader states.

---

## 4. Goals

* Build long-term consistency.
* Increase shared accountability.
* Prevent fake study tracking using strict foreground-only focus rules.
* Encourage positive daily habits.
* Make progress visible between partners without competitive pressure.

---

## 5. First-Time User Flow

1. **Splash Screen**: Displaying rotating taglines.
2. **Onboarding**: 3-page horizontal swipe scroll illustrating core benefits (Habits, Shared Focus, Reflections).
3. **First-Visit Hub**:
   - **New Users**: Introduction questionnaire -> Basic profile setup -> Link account with partner -> Supabase Sign Up.
   - **Returning Users**: Shortcut option to skip setup and jump directly to the **Supabase Email Sign-In** screen.

*Note: Partners can be linked later in the Profile Tab if skipped at onboarding.*

---

## 6. Navigation

Mobile-first **Bottom Navigation Bar** containing 5 tabs:

1. **Home**: Daily checklists, streaks, and partner status.
2. **Focus**: Pomodoro session timer and shared active states.
3. **Calendar**: Shared event and task scheduler.
4. **Insights**: Visual analytics, weekly bar charts, and mood trends.
5. **Profile**: Account configurations, streak freeze tokens, and theme unlock progress.

---

## 7. Home Dashboard

Displays:

* Streak indicator (number of consecutive active days).
* Today's missions checklist (completed vs pending).
* Partner Status Card showing their current active status (Offline, Online, Studying, On Break, Idle).
* Weekly progress preview bar chart.
* Quick shortcut link to log daily reflection notes.

---

## 8. Daily Missions & Habits

Each user manages a list of customizable habits.

* **Mission Types**: Counters, target minutes/hours, checklist items.
* **Attributes**: Category, goal details, repeat schedule, visual color code.
* **Missions Auto-Verification (LeetCode / DSA)**:
  * Users can connect their LeetCode/DSA username.
  * The app auto-syncs daily solved counts and automatically verifies the "Solve DSA Questions" mission when targets are met.

---

## 9. Focus Mode (Pomodoro Timer)

Track genuine, verified study/work time.

### Custom Sessions

* Pomodoro preset selectors (15, 25, 45, 60 minutes) and custom durations.
* Categories selection ( Custom Categories ).

### Foreground-Only Timing Rule

* If the user navigates away from the app or locks the phone, the timer **pauses automatically** to prevent false study tracking.
* Resumes automatically or via confirmation when the user returns.

### Live Focus Status

* Real-time sync displaying your focus phase (*Studying*, *On Break*, *Idle*) on your partner's dashboard.
* **Focus Together (Live)**: A dual split-timer screen showing side-by-side active session progress (You vs. Partner) and a live typing chat feed for sharing encouraging feedback messages.

### Session Complete & Review

* Celebratory check banner with decorative leaf graphics.
* **Mood Rating**: Interactive 5-smiley emoji selector to rate the session mood.
* **Timeline Review**: Color-coded segmented bar illustrating Focus vs. Break ratio.
* **Achievements**: Achievement checkmarks list (e.g., "Completed 1 Pomodoro", "No phone usage").

---

## 10. Reflections Tab

* A clean, daily notepad/journal where users log their thoughts, reflections, daily challenges, and wins.
* Logs are saved to the profile database and searchable later.

---

## 11. Mood & Distraction Tracking

* **Daily Check-in**: A nightly popup/notification prompts the user with a 5-point scale: *"How are you feeling today?"*.
* **Distraction Prompt**: If a low focus time is recorded or a bad mood scale is selected, the app triggers the question: *"What distracted you today?"*.
* **Logged Options**: Social Media, Gaming, Friends, College, Family, Overslept, or custom text. Responses are stored for analytics trends.

---

## 12. Shared Calendar

* Interactive calendar grid visible to both partners.
* **Add Task/Event**: Both partners can create events, reminders, or tasks.
* **Visual Color Coding**:
  * Blue: User's personal event
  * Green: Partner's event
  * Purple: Shared event
  * Orange: Interview
  * Red: Urgent Deadline

---

## 13. Habit Heatmaps

* Generates a separate github-like contributions heatmap grid for **each custom habit/mission** on the insights tab.
* Heatmaps are rendered in different custom colors corresponding to the habit category (e.g., green for DSA, blue for gym).

---

## 14. Streak Milestones & Theme Unlocks

* **Streak Milestones**: Unlocks visual cosmetic dashboard themes at milestones (7, 14, 30, 60, 100, 180, 365 days).
* **Themes**: Unlocks 5 to 6 unique cosmetic stylesheets (e.g. Forest, Midnight, Ocean, Sakura, Aurora, Galaxy).
* **Daily Freeze**: Monthly allowance of freeze tokens. If a user misses a day, a freeze token auto-fires to preserve their streak without completing the habit.
* *Note: The XP/Economy system is put on hold.*

---

## 15. Analytics Page

* Graphs tracking daily, weekly, and monthly focus averages.
* Consistency percentages, mood correlation trends, and top distraction causes.
* Comparative (non-competitive) reports of partner's weekly statistics.

---

## 16. Technical Stack

* **Frontend**: React Native, Expo Dev Clients, TypeScript, NativeWind.
* **Backend**: Supabase Database, Supabase Realtime (for live timer sync), Edge Functions.
* **Authentication**: Supabase Email/Password authentication.
* **Push Notifications**: Expo Notifications.
