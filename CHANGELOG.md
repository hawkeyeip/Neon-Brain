# Changelog - Neon Brain

All notable changes to **Neon Brain** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
