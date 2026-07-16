# UI/UX Specification — Bloom

**Version**: 2.0 (Custom Playful Theme & Streak Unlocks)
**Philosophy**: Calm, Playful, Human-Centered, and Clutter-Free

---

## 1. Design Philosophy

Bloom is built as a warm, cozy relationship garden rather than a sterile tracking sheet. The visual language emphasizes **safety, encouragement, and joint progress** over gamified competition or shame.

* **Calm over Pressure**: Never shame users. Streaks are always recoverable, and visual indicators remain soft.
* **Encouragement over Competition**: We show each other's statistics side-by-side to foster companionship, rather than ranking scores.
* **Playful over Rigid**: Custom hand-drawn or clean rounded elements that feel organic and approachable.

---

## 2. Styling System & Foundations

* **Framework**: React Native + Expo + TailwindCSS (NativeWind).
* **Bespoke Design Language**: **No Material Design 3 or pre-packaged UI libraries (React Native Paper/Material UI are deprecated)**. Every card, button, modal, and checkmark is custom-coded using NativeWind utility classes to ensure a unique, cohesive brand identity.
* **Border Radii**: Extra-large, pill-shaped curves (typically `rounded-3xl` (24px) or `rounded-[40px]`) are used across the dashboard, buttons, and popups.
* **Touch Targets**: All interactive elements (toggles, cards, calendar items) maintain a minimum target size of `48dp x 48dp` for ease of use.

---

## 3. Typography & Google Fonts

* **Primary Font**: **Outfit** (loaded dynamically via Google Fonts).
  * Why: A stylish, geometric, bold sans-serif that strikes the perfect balance between professional readability and friendly, playful terminals.
* **Font Scaling**:
  * **Brand / Hero Display**: `text-5xl` (48px) to `text-[56px]` (56px) with extra-bold weight for splash screens and logo texts.
  * **Screen Headers**: `text-3xl` (30px) with heavy tracking-tight weights.
  * **Card & Section Headers**: `text-lg` (18px) to `text-xl` (20px), semi-bold.
  * **Body / Descriptions**: `text-sm` (14px) to `text-base` (16px), regular/medium weights.
  * **Details / Labels / Overlines**: `text-xs` (12px) with extra tracking-wider parameters.

---

## 4. The Default Theme: Lavender Pastels

The default visual theme for Bloom is soft, organic, and clean:

* **Primary Tone**: Pastel soft purple (Lavender: `#8C7AB8` / `#584B82`).
* **Background Context**: Creamy white (`#FBFBFD`) and light lavender-gray (`#F5F3F7`) to minimize eye strain.
* **Accent Colors**: 
  * Sage Green (`#4B7E4F`) for completed missions and focus timelines.
  * Peach Coral (`#F29F8F`) for warning conditions and deletes.
* **Visual Styling**: Thin, light gray borders (`border-[#EBEBEB]`), soft shadows, and clean, high-contrast, rounded text inputs.

---

## 5. Theme Unlocks & Streak Milestones

Users can customize their entire application's color stylesheet directly from the Profile Tab. Custom themes are locked behind **Streak Milestones** to incentivize daily consistency.

| Streak Milestone | Theme Name | Visual Style |
| :--- | :--- | :--- |
| **0 Days** | **Default Lavender** | Pastel soft purples, creamy whites, Outfit typography. |
| **7 Days** | **Sakura** | Cherry blossom pinks, soft rose highlights, cozy Japanese spring feel. |
| **14 Days** | **Minimal** | Sleek grays, matte dark modes, monochrome borders. |
| **30 Days** | **Honey Amber** | Warm golden ambers, cream backgrounds, honey highlights. |
| **60 Days** | **Nordic Winter** | Frosty icy blues, snow whites, cold grays. |
| **100 Days** | **Retro Arcade** | Retro neon purples, chiptune yellows, pixelated grid aesthetics. |
| **180 Days** | **Mario** | 8-bit retro gaming theme, pixel styling, pixel art buttons. |

---

## 6. Onboarding & First-Visit Experience

* **Splash Screen**: Centered app logo showing animated rotating taglines:
  * *"Small Steps, Every Day."*
  * *"Keep Growing."*
  * *"Stay in Sync."*
  * *"Grow Together."*
  * *"Show up today."*
* **Onboarding**: A 3-page swipe layout with illustrations detailing Habits, Reflections, and Focus, utilizing smooth pagination indicators.
* **Introduction Flow**: A questionnaire setup that captures display names and generates invite codes for partner connection. Provides a "Log In" shortcut button for returning users.

---

## 7. Key Screen UX Guidelines

### 7.1 Habits & Missions UX
* Habit checklist items are displayed in clean rounded card blocks.
* Complete actions trigger a micro-spring scale-down animation on tap and overlay a soft checkmark.
* Adding/editing missions uses a custom bottom-sheet modal.
* Auto-verified LeetCode/DSA tasks display a verified check badge.

### 7.2 Pomodoro Focus Timer UX
* Preset selectors (15m, 25m, 45m, 60m) are rendered as rounded buttons.
* The timer displays a circular progress ring matching the theme color (green for Focus, blue for Short Break, purple for Long Break).
* **Partner Focus Together (Live)**: Side-by-side progress circles (You vs. Partner) and a custom chat window at the bottom showing simulated encouragement messages.
* **Completion Celebrations**: Shows a 5-smiley emoji selector to log your mood, a Focus vs. Break horizontal timeline ratio bar, and achievement cards list.

### 7.3 Shared Calendar UX
* Grid-based monthly calendar with dot markers.
* **Color Legends**:
  * Blue: User's scheduled tasks.
  * Green: Partner's tasks.
  * Purple: Joint events.
  * Orange: Interview reminders.
  * Red: Deadlines.
* Tap agenda items to reveal summaries or long press to create tasks.

### 7.4 Reflections & Daily Notes UX
* Minimal, clean diary notes input field.
* Focuses on daily reflections or "Thoughts of the day" with a simple save button.

### 7.5 Nightly Check-in UX
* Evening modal asks: *"How are you feeling today?"* with a 1-to-5 emoji scale.
* Trigger a secondary survey: *"What distracted you today?"* (featuring selection chips for Social Media, Gaming, Friends, College, Overslept) if a bad mood is selected or if logged focus time is low.
