<div align="center">

# ZoneBar

**Stop doing timezone math in your head.**

A macOS and Windows tray app that shows the time everywhere you care about.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![macOS](https://img.shields.io/badge/macOS-14%2B-000?logo=apple&logoColor=white)](https://github.com/yazinsai/zonebar/releases/latest)
[![Windows](https://img.shields.io/badge/Windows-10%2B-0078D4?logo=windows&logoColor=white)](https://github.com/yazinsai/zonebar/releases/latest)
[![GitHub release](https://img.shields.io/github/v/release/yazinsai/zonebar?color=%234ade80)](https://github.com/yazinsai/zonebar/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/yazinsai/zonebar/total?color=%234ade80)](https://github.com/yazinsai/zonebar/releases/latest)

<br />

<a href="https://github.com/yazinsai/zonebar/releases/latest">
  <img src="https://img.shields.io/badge/Download_for_Mac-000000?style=for-the-badge&logo=apple&logoColor=white" alt="Download for Mac" height="40" />
</a>
&nbsp;
<a href="https://github.com/yazinsai/zonebar/releases/latest">
  <img src="https://img.shields.io/badge/Download_for_Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Download for Windows" height="40" />
</a>

<br /><br />

<img src="assets/screenshot.png" alt="ZoneBar screenshot" width="360" />

</div>

---

## What it does

Click the clock in your menu bar. See the time in every zone you've added — with relative offsets, day/night context, and a slider to scrub ±12 hours. Click any time to type a specific one and watch everything adjust.

## Install

**macOS**
1. [Download the DMG](https://github.com/yazinsai/zonebar/releases/latest)
2. Drag ZoneBar to Applications
3. Launch — look for the clock in your menu bar

**Windows**
1. [Download the MSI installer](https://github.com/yazinsai/zonebar/releases/latest)
2. Run the installer
3. Launch ZoneBar — look for the clock icon in the system tray (bottom-right)

## Features

- **One click** — lives in the menu bar, always a click away
- **Drag to compare** — slider scrubs ±12h, all zones update live
- **Click any time to edit** — type "3pm" or "15:00" on any zone, everything adjusts
- **Relative offsets** — shows +3, −5, +5:30 instead of verbose timezone names
- **Day boundaries** — shows +1d / −1d when a zone crosses midnight
- **Add, remove, reorder** — customize your zones, drag to arrange
- **Remembers everything** — your setup persists between launches

## Defaults

Pacific · Eastern · London · Dubai · Mumbai · Singapore

## Build from source

```bash
git clone https://github.com/yazinsai/zonebar.git
cd zonebar
npm install
npm run tauri dev
```

Requires [Rust](https://rustup.rs/) and [Node.js 22+](https://nodejs.org/).

## Stack

[Tauri v2](https://tauri.app) · React · TypeScript · Tailwind CSS — under 5 MB.
