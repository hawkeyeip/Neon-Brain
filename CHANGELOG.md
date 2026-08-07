# Changelog - Neon Brain

All notable changes to **Neon Brain** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-08-07

### Preserved
- **💼 Career Vault Retained (`CareerVault.jsx`)**: Kept Career Vault active and accessible within the Resource Hub sub-navigation tabs as requested.

---

## [2.0.0] - 2026-08-07

### Major Release - 100% Resource Tracker & Career Vault Integration
- **💳 Full Resource & Subscription Master Hub (`ResourceTracker.jsx`)**:
  - Integrated 100% of the standalone Resource Tracker components and sub-modules without compromise.
  - **`DashboardStats.jsx`**: Financial analytics, monthly run-rate ($/mo), annual run-rate ($/yr), travel credit balances, category breakdown charts, and business tax write-offs.
  - **`ResourceList.jsx`**: Grid, Table, and Compact List views with status filters (active, expiring soon, expired/used) and search.
  - **`CalendarView.jsx`**: Dedicated graphical subscription renewal and credit expiration calendar.
  - **`ResourceForm.jsx`**: Full resource editor with custom attributes, coupon codes, serials, purchase dates, warranty info, payment methods, and tax write-off toggles.
  - **💼 `CareerVault.jsx`**: Full Career, Job Applications, Resumes, Portfolio, & Interview Command Center.
  - **📊 `ImportWizard.jsx`**: Multi-format CSV / JSON importer wizard with automated column mapping.
  - **🚀 `OnboardingWizard.jsx` & `UserGuide.jsx`**: Guided setup and built-in interactive documentation.

---

## [1.5.0] - 2026-08-07

### Added
- **💳 Resource Hub Integration (`ResourceTracker.jsx`)**:
  - Integrated your Antigravity Resource & Subscription Tracker directly into Neon Brain as a core module.
  - **Financial Run-Rate Analytics**: Real-time monthly SaaS spend ($/mo), annual run-rate ($/yr), available travel credits, and business tax write-off deductions.
  - **Asset Categories**: Subscriptions, Travel Credits & Vouchers, Hardware Assets, and Software Licenses.
  - **Cross-System Duty Sync**: 1-Click `⚡ Sync Duty to Task Center` button to automatically create renewal task reminders and calendar deadlines in Task Center!
  - Added `resources` data model to `db.js` with full JSON backup import/export support.

---

## [1.4.0] - 2026-08-07

### Added
- **⏩ 1-Click Task Deadline Snooze & Rescheduling (`TaskCenter.jsx`)**:
  - **1-Click "+1 Day" Button**: Added `⏩ +1 Day` quick button on task cards to instantly push duties to tomorrow.
  - **Inline Due Date Editor**: Editable date picker on task cards to change deadline target dates on the fly.
  - **Bulk Overdue Reschedule Banner**: Surface 1-click banner when overdue duties exist (`⏩ Push All Overdue to Today`).

---

## [1.3.0] - 2026-08-07

### Added
- **📅 Graphical Calendar Timeline View (`TaskCalendarView.jsx`)**:
  - Interactive Month & Day grid view displaying duty deadlines visually.
  - Priority color pills (`🔴 High`, `🔵 Medium`, `🟢 Low`) on date cells.
  - Click any date cell to filter duties or set quick deadline target dates.
  - Month navigation controls (*◀ Prev Month*, *Next Month ▶*, *Today*).
- **Target Deadline Picker & Badges**:
  - Added target date selector to quick duty creation form.
  - Added deadline status badges on task cards (`⚠️ Overdue`, `📅 Due Today`, `📅 Due: YYYY-MM-DD`).
  - Animated glowing red pulse alerts for overdue tasks.

---

## [1.2.2] - 2026-08-07

### Added & Fixed
- **Subtask Deletion (`TaskCenter.jsx`)**: Added hover trash action to remove accidental additions made to individual subtasks without deleting the parent duty.

---

## [1.2.1] - 2026-08-07

### Added & Fixed
- **Smart Duty Sorting & Historical Archive (`TaskCenter.jsx`)**:
  - Automatically moves completed tasks to the bottom of the list into a dedicated, collapsible **Completed Duties Archive** section.
  - Keeps active task list 100% clean and sorted by priority (*High* -> *Medium* -> *Low*).
  - Preserves 100% of historical completion records for verification without needing deletion.
  - Allows 1-click unchecking to instantly restore accidentally completed tasks back into active priority focus.

---

## [1.2.0] - 2026-08-07

### Added
- **🔔 Configurable Push Notifications & Reminders (`notificationService.js`, `NotificationSettingsModal.jsx`)**:
  - Native browser desktop/mobile OS push notification engine.
  - **Cyber Audio Chimes**: Web Audio API futuristic sound effects for alert notifications (with 1-tap mute toggle).
  - **Memory Refresh Engine**: Surfaces random notes, execution strategies, or AI prompts at custom intervals (*Every 1 hr*, *Every 3 hrs*, *Daily*) to keep key ideas fresh in your mind.
  - Test Notification & Test Memory Flash buttons.
  - Added glowing Bell icon button in `Navbar`.

---

## [1.1.0] - 2026-08-07

### Added
- **🕸️ Neural Knowledge Graph View (`KnowledgeGraph.jsx`)**:
  - Interactive force-directed neural node visualization connecting notes, tasks, and AI prompts.
  - Interactive physics canvas with drag-and-drop node physics, link attraction, and smooth 60fps rendering.
  - Hover tooltips, zoom controls (+ / - / reset), and click-to-inspect node drawer.
  - Integrated View Switcher (*Card Deck* ↔ *Neural Graph*) in Second Brain.

---

## [1.0.2] - 2026-08-07

### Fixed & Enhanced
- **Dynamic Neon Card Glows**: Fixed issue where card hover glows defaulted to cyan regardless of selected color accent.
- **Expanded Neon Palette**: Added 7 distinct neon color accent themes for Second Brain cards:
  - 🩵 **Neon Cyan**
  - 🩷 **Neon Pink / Magenta**
  - 💚 **Neon Emerald**
  - 💛 **Neon Gold / Amber**
  - 💜 **Neon Violet / Purple**
  - ❤️ **Neon Crimson / Red**
  - ❄️ **Neon Ice Blue**
- Updated note category badges to dynamically mirror card accent colors.

---

## [1.0.1] - 2026-08-07

### Fixed
- **Watch Mode Navigation Lock**: Fixed bug where toggling Watch Mode prevented navigating back to Desktop views.
- Added explicit "Exit Watch Mode" action button in `WatchCompanionView`.
- Updated `Navbar` tab switching logic to automatically exit Watch Mode when selecting any main tab (Second Brain, Task Center, AI Prompts).

---

## [1.0.0] - 2026-08-07

### Added
- **Glassmorphic Neon Aesthetics**: Dark cyber theme with ambient neural canvas particles, frosted glass containers (`backdrop-filter: blur`), animated neon glowing borders (cyan, magenta, emerald, amber), and responsive device simulator.
- **Second Brain & Memory Hub**: Categorized thoughts & execution plans with bi-directional search, note tagging, pin-to-top feature, and card deck layouts.
- **Tasks & Duty Command Center**: Duty tracker with progress ring, priority tagging (High/Medium/Low), subtask checklist tree, and recurring daily/weekly/monthly duty badges.
- **AI Prompt Engineering Vault**: Historical tracking of AI system instructions and task prompts, version iteration logs (e.g. v1.0 -> v2.0 improvements), model badges, variable placeholder syntax (`{{input}}`), star rating, and 1-click copy to clipboard.
- **Smartwatch Companion Mode**: Realistic watch bezel simulator with glanceable touch actions, rapid duty checkoff, instant voice dictation simulation, and top prompt lookup.
- **Global Quick Capture Modal**: Accessible via `Cmd + K` or `Ctrl + K` hotkeys for zero-friction brain dumps.
- **Data Sovereignty & Local Storage**: 100% offline local persistence with `IndexedDB` / `localStorage` auto-sync and full JSON export/import sync capabilities.
- **Progressive Web Application (PWA)**: Web app manifest (`manifest.json`) and Service Worker (`sw.js`) for full offline availability and installation on Mac, Windows, iOS, and Android.
