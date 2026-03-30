# ZoneBar

A tiny Mac menu bar app for comparing time zones. No more mental math.

**[Download the latest release](https://github.com/yazinsai/zonebar/releases/latest)**

## How it works

1. Download the DMG, drag ZoneBar to Applications, and launch it
2. A clock icon appears in your menu bar — click it
3. You'll see the current time across your selected zones
4. Drag the slider to compare times up to 12 hours ahead or behind
5. Click the time to type a specific time (e.g. "3pm") and see it everywhere
6. Right-click the menu bar icon to quit

## Features

- **Instant access** — lives in your menu bar, one click away
- **Time slider** — drag to scrub through time, see all zones update live
- **Type a time** — click the green time, type "3pm" or "15:00", hit Enter
- **Add/remove zones** — click "+ add" to search and add any timezone
- **Drag to reorder** — arrange zones however you like
- **Remembers your setup** — zones and order persist between launches
- **Relative offsets** — shows +3, -5, +5:30 relative to your local time
- **Day boundary labels** — shows +1d / -1d when a zone crosses midnight

## Default zones

Pacific, Eastern, London, Dubai, Mumbai, Singapore — customize to your needs.

## Building from source

Requires [Rust](https://rustup.rs/) and [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/yazinsai/zonebar.git
cd zonebar
npm install
npm run tauri dev     # development
npm run tauri build   # release build
```

## Tech

Built with [Tauri v2](https://tauri.app), React, TypeScript, and Tailwind CSS. The app is ~5MB and uses native macOS APIs for the menu bar and window positioning.
