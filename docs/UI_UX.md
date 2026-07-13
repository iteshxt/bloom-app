# UI_UX.md

# Bloom --- UI / UX Specification

Version: 1.0

------------------------------------------------------------------------

# 1. Design Philosophy

Bloom is not a productivity app.

Bloom is a calm accountability companion designed for two people.

Every design decision should reinforce:

-   Calm over pressure
-   Encouragement over competition
-   Consistency over intensity
-   Presence over messaging
-   Growth over perfection

The app should feel closer to a journal than a task manager.

------------------------------------------------------------------------

# 2. Design Language

Framework:
-   React Native
-   Material Design 3 (utilizing React Native Paper for MD3 components)
-   NativeWind (v4 for unified Tailwind styling and utility classes mapped to MD3 tokens)

Visual Style:
-   Minimal, Spacious, Rounded (shapes following standard MD3 guidelines)
-   Elevation using tonal color overlays (MD3 elevation model) rather than heavy drop shadows
-   Large touch targets (minimum 48dp x 48dp)
-   Motion used sparingly (standard MD3 easings: Emphasized, Standard, Decelerate)

Avoid:
-   Clutter
-   Heavy gradients
-   Neon colors
-   Dense dashboards
-   Excessive gamification

------------------------------------------------------------------------

# 3. Material 3 Principles

Use:
-   **Cards**: Filled, Elevated, and Outlined cards (16dp rounded corners)
-   **Buttons**: Filled, Tonal, Outlined, Text, and Elevated buttons
-   **FAB**: Extended FAB (or standard 56dp/small 40dp FAB with 28dp rounded corners)
-   **Navigation Bar**: Bottom Navigation with pill-shaped active state indicators
-   **Sheets**: Modal Bottom Sheets with a drag handle (28dp top-corner radius)
-   **Feedback**: Snackbars for non-intrusive statuses, Material Dialogs (24dp corners) for critical prompts
-   **Pickers**: MD3 Date/Time pickers

Corner Radius (MD3 Shapes):
-   Extra Small: 4dp (e.g., text fields, tooltips)
-   Small: 8dp (e.g., chips)
-   Medium: 12dp (e.g., small menus)
-   Large: 16dp (e.g., cards, selection dialogs)
-   Extra Large: 28dp (e.g., bottom sheets, FAB, time pickers)

Spacing:
-   4dp grid
-   Primary layout spacing: 8dp, 16dp, 24dp, 32dp

Typography (MD3 Font Scale):
-   **Display**: Large (57sp), Medium (45sp), Small (36sp) - for big stats/streaks
-   **Headline**: Large (32sp), Medium (28sp), Small (24sp) - for screen headers
-   **Title**: Large (22sp), Medium (16sp), Small (14sp) - for card headers, dialog titles
-   **Body**: Large (16sp), Medium (14sp), Small (12sp) - for main descriptions and presence text
-   **Label**: Large (14sp), Medium (12sp), Small (11sp) - for buttons, captions, and overlines

Never use custom typography unless branding requires it.

------------------------------------------------------------------------

# 4. Brand

Name: Bloom

Launch Screen

Logo

Bloom

Random rotating tagline:

-   Grow together.
-   Better, together.
-   Small steps. Every day.
-   Stay in sync.
-   Keep growing.

Future taglines may be added.

------------------------------------------------------------------------

# 5. Color Philosophy

Material You Dynamic Color:
-   Full support on Android 12+ via native system themes.
-   Static fallback theme based on "Bloom Green" palette for iOS and older Android devices.

MD3 Color Tokens & Mapping (Bloom Theme):
-   `primary` / `on-primary`: Bloom Green (#2E7D32) / White (#FFFFFF)
-   `primary-container` / `on-primary-container`: Soft Green (#E8F5E9) / Dark Green (#1B5E20)
-   `secondary` / `on-secondary`: Calm Slate/Teal (#4A7C59) / White (#FFFFFF)
-   `secondary-container` / `on-secondary-container`: Soft Slate (#D8F3DC) / Dark Slate (#1B4332)
-   `tertiary` (Partner/Shared): Soft Purple (#6750A4) / White (#FFFFFF)
-   `tertiary-container` / `on-tertiary-container`: Pastel Purple (#E8DDFF) / Deep Purple (#21005D)
-   `surface` / `on-surface`: Muted Light Background (#FDFDFD) / Dark Charcoal (#1C1B1F)
-   `surface-variant` / `on-surface-variant`: Light Muted Grey (#E7E0EC) / Muted Grey (#49454F)
-   `outline`: Border color (#79747E)
-   `error` / `error-container` (Missed/Late): Red (#B3261E) / Soft Pink (#F9DEDC)

Status Indicator Colors:
-   Active Focus / Studying: `primary-container`
-   On Break: `secondary-container`
-   Offline / Idle: `surface-variant`
-   Busy: `tertiary-container`

Heatmaps:
-   Each habit uses a specific color scheme (e.g., DSA uses green hues, Reading uses blue/teal, Gym uses orange).
-   Heatmaps dynamically match the respective token's container colors.

------------------------------------------------------------------------

# 6. Iconography

Rounded Material Symbols.

No outlined icon mixing.

Prefer: Filled or Rounded set.

------------------------------------------------------------------------

# 7. Motion

Animations: 150--300ms

Use: Fade Scale Slide

Avoid: Bouncy Flashy Attention-seeking motion

------------------------------------------------------------------------

# 8. Navigation

Bottom Navigation (MD3 Navigation Bar):
-   Exactly 5 destinations: Home, Focus, Calendar, Insights, Profile.
-   Active destination displays a pill-shaped background behind the icon.
-   Labels are persistent (always visible) for maximum readability.
-   Height: 80dp (standard MD3 Navigation Bar height).

Secondary navigation:
-   Modal Bottom Sheets for quick actions (e.g., adding a mission, changing status).
-   Standard Stack Navigation for sub-flows (e.g., profile editing, detailed insight views).

------------------------------------------------------------------------

# 9. Home UX

Priority order:

1 Partner Presence 2 Your Progress 3 Today's Missions 4 Recent Activity
5 Reflection Reminder

The partner card should always be visible above the fold.

------------------------------------------------------------------------

# 10. Focus UX

Primary action: Start Focus Session

During session: Large timer

Secondary: Partner status

Rules: Leaving app pauses timer. Returning prompts to resume.

Only verified foreground time counts.

Focus mode suppresses non-essential notifications.

------------------------------------------------------------------------

# 11. Missions UX

Mission cards contain:

Title Goal Progress Verification type Status

Auto verified missions display a verified badge.

Editing uses bottom sheet.

Completion feedback: Small celebration animation.

------------------------------------------------------------------------

# 12. Calendar UX

Month view first.

Color Legend:

Blue My Events

Green Partner

Purple Shared

Orange Important

Red Deadline

Tap day → Day agenda

Long press → Create event

------------------------------------------------------------------------

# 13. Reflections UX

Journal-first experience.

Prompts: Reflection Thought of the Day Win Challenge

Writing area should feel distraction-free.

No unnecessary formatting toolbar.

------------------------------------------------------------------------

# 14. Insights UX

Sections:

Focus Time

Habit Completion

Heatmaps

Mood Trend

Distractions

Partner Progress

Reports

Never overload charts on one screen.

------------------------------------------------------------------------

# 15. Notifications Strategy

Notifications are part of the experience.

Categories:

Daily reminder

Partner started studying

Partner completed mission

Reflection reminder

Mood check

Daily summary

Weekly report

Calendar reminder

Streak warning

Freeze available

Morning motivation

Notifications should encourage---not guilt users.

Never compare users negatively.

------------------------------------------------------------------------

# 16. Night Check-in Flow

Around configurable evening time:

Notification: How are you feeling today?

App opens modal.

Mood selection: 😁 😊 😐 😔 😭

If negative or skipped: Prompt:

What distracted you today?

Quick chips: Social Media Gaming Friends College Family Overslept Other

Optional free-text response.

------------------------------------------------------------------------

# 17. Empty States

Every empty state should feel positive.

Examples:

No reflections yet.

"Every journey starts with one thought."

No focus sessions.

"Ready to begin?"

No partner connected.

"Invite someone to grow with."

------------------------------------------------------------------------

# 18. Accessibility

Support: Material accessibility

Touch target: Minimum 48dp

Dark Mode: Full support

High contrast: Supported

Animations: Respect reduced motion settings

------------------------------------------------------------------------

# 19. Theme System

Themes unlocked through streaks.

Initial: Bloom

Future: Forest Ocean Midnight Aurora Sakura Harvest

Themes affect: Colors Illustrations Backgrounds

Never affect usability.

------------------------------------------------------------------------

# 20. UX Rules

Never shame users.

Never display rankings.

Never use aggressive streak-loss messages.

Celebrate consistency.

Encourage restarting.

Progress is always recoverable.

------------------------------------------------------------------------

# 21. Future UX

Widgets

Lock screen timer

Dynamic Island support (iOS)

Wear OS

Live Activities

AI-generated weekly summaries

Smart insights

Voice reflections

Shared study room presence

------------------------------------------------------------------------

# 22. Design Principles Checklist

✓ Calm

✓ Minimal

✓ Mobile-first

✓ Material Design 3

✓ One-handed navigation

✓ Presence over chat

✓ Accountability over competition

✓ Verified progress over manual input

✓ Encouraging notifications

✓ Beautiful analytics

✓ Consistency over perfection
