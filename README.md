# 🌿 GrowApp Cannabis Guide

> **Founder @ Loyal9 LLC | Scaling 2,800+ Strain DB with GrowApp | Architecting Social Blockchain w/ Mission Mischief | AWS Serverless & Open-Source — We Pass Them Left, Then Watch the Industry Blink.**

[![Live App](https://img.shields.io/badge/🌐_Live_App-growappcannabis.guide-green?style=for-the-badge)](https://growappcannabis.guide)
[![App Store](https://img.shields.io/badge/📱_iOS-App_Store-blue?style=for-the-badge)](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
[![Google Play](https://img.shields.io/badge/🤖_Android-Google_Play-green?style=for-the-badge)](https://play.google.com/store/apps/details?id=com.growappcannabiscannabis.guide)
[![Amazon Appstore](https://img.shields.io/badge/📦_Amazon-Appstore-orange?style=for-the-badge)](https://www.amazon.com/gp/product/B0CFG7HGQK)
[![License](https://img.shields.io/badge/📄_License-MIT-yellow?style=for-the-badge)](LICENSE.md)
[![AI Pair Programmer](https://img.shields.io/badge/🤖_Pair_Programmer-Amazon_Q-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/q/)

---

## 🚀 What We Built

GrowApp is a **data-driven cannabis cultivation platform** that transforms how home growers approach their grows. Built with vanilla JavaScript, powered by a 2,800+ strain database, and architected around IndexedDB for fully offline-capable, personalized grow tracking.

This repo is the **live app webview** — served inside the iOS, Android, and Amazon native app shells. It is not open for contributions. If you're looking for the public website version, check out the website repo below.

> 🌐 Website repo: [github.com/Shannon-Goddard/growappcannabis.guide](https://github.com/Shannon-Goddard/growappcannabis.guide)

---

## 🗂 App Structure

```
grow_app/
├── index.html                      ← Smart entry point: new user → builder, returning → mytask
├── medium-feeding/
│   ├── medium-feeding.html         ← 3-step grow builder
│   ├── schedule-viewer.html        ← Full schedule: cards + table + My Notes
│   ├── mytask.html                 ← Daily check-in dashboard
│   └── mydiary.html                ← Photo diary with data overlay
├── tools/
│   └── tools.html                  ← Tools hub: calculators + grow tools + games
├── lighting/
│   └── lighting.html               ← 132 LEDs, grow cost calculator, DLI tool
├── airflow/
│   └── airflow.html                ← CFM calculator, fan & filter kits
├── grow-space/
│   └── grow-space.html             ← Tent kits, space calculator
├── harvest-window/
│   └── harvest-window.html         ← AI trichome analyzer (TensorFlow on-device)
├── strain-search/
│   ├── strain-search.html          ← 2,800+ strain search & filter
│   └── strains/                    ← ~2,800 individual strain pages
├── plant-doctor/
│   ├── plant-doctor.html           ← Symptom-based diagnosis
│   └── assets/html/                ← 45+ condition detail pages
├── blog/
│   ├── blog.html
│   └── assets/article/             ← Grow guides & gear reviews
├── seeds/
│   └── seeds.html                  ← Seed Money marketplace
├── games/
│   └── games.html                  ← Cannabis games hub
├── how-to/
│   └── how-to.html                 ← 20 seed-to-cure how-to videos
├── assets/
│   ├── js/
│   │   ├── bottom-nav.js           ← Global bottom nav (replaces hamburger)
│   │   └── age-gate.js
│   ├── css/
│   ├── img/
│   └── policies/                   ← Privacy, Terms, EULA, Disclosure, Contact
├── server.py                       ← Local dev server (repo root, port 8000)
├── CNAME                           ← growappcannabis.guide
├── robots.txt
└── sitemap.xml
```

---

## 🌱 medium-feeding — The Core Grow App

The primary product. Users build a personalized grow then track it day by day.

### Page Flow

```
index.html  (smart entry — new vs returning user detection)
  └── medium-feeding.html  (3-step builder)
        └── schedule-viewer.html  (schedule + card view)
              ├── mytask.html     (daily check-in)
              └── mydiary.html    (photo diary)
```

### Pages

| Page | Purpose |
|---|---|
| `medium-feeding.html` | 3-step grow builder: Strain → Nutrients → Start Date → generates schedule |
| `schedule-viewer.html` | Full schedule viewer with card view (mobile default) and table view (desktop default) |
| `mytask.html` | Daily check-in: log actuals for environment, water, nutrients, light, inspection |
| `mydiary.html` | Camera + column selector + data overlay photo diary |

### Schedule Viewer — View Modes

Accessed via the **⚙ Options** dropdown in the toolbar:

| Mode | Description |
|---|---|
| Cards | Collapsible day cards — default on mobile. Date · Day · Week in header, sections for Environment / Water & pH / Nutrients / Visual Inspection |
| Table | Full horizontal-scroll data table — default on desktop. Sticky header + toolbar + column headers |
| My Notes | Cards or table with all editable "My" fields visible: environment, light/air, nutrients (dynamic), inspection notes |

My Notes fields match exactly what MyTask saves — data entered in either place is shared via IndexedDB.

### Plant Size Filter

| Size | Veg Weeks Shown |
|---|---|
| Small | 4 |
| Medium | 6 |
| Large | All |
| Auto | All (optional days-to-harvest trim) |

---

## 🧭 Navigation — Bottom Nav

All pages (except `index.html`) use a fixed bottom nav bar injected by `assets/js/bottom-nav.js` via a `bottom-nav-placeholder` div. Works at any directory depth via `data-depth`.

| Tab | Icon | Destination |
|---|---|---|
| Today | `fa-gauge-high` | `/medium-feeding/mytask.html` |
| Schedule | `fa-leaf` | `/medium-feeding/schedule-viewer.html` |
| Diary | `fa-camera` | `/medium-feeding/mydiary.html` |
| Tools | `fa-screwdriver-wrench` | `/tools/tools.html` |
| More | `fa-ellipsis` | Bottom sheet drawer |

**More drawer** contains: Strain Search, Plant Doctor, Seeds, Blog, Games, and policy footer links. Supports swipe-down-to-close on mobile.

---

## 🛠 Tools Hub — tools/tools.html

Organized into three sections:

**Featured:** Harvest Window — AI trichome analyzer (TensorFlow.js on-device, model hosted at `loyal9.app`)

**Calculators:**
- Lighting Calculator — best LED for tent, grow cost, DLI (132 lights)
- CFM Calculator — fan & filter sizing for your space
- Grow Space Calculator — tent kit matching by room dimensions

**Grow Tools:**
- Strain Search — 2,800+ strains, filter by type/THC/CBD/flowering time
- Plant Doctor — 45+ conditions, symptom-based diagnosis
- How-To Videos — 20 seed-to-cure videos
- Grow Blog — lighting, nutrients, hydro, gear reviews

---

## 🛠 Tech Stack

```javascript
const techStack = {
  frontend:   ['Vanilla JavaScript', 'CSS3', 'HTML5'],
  data:       ['JSON', 'IndexedDB (MyGrowDB v8)', 'localStorage'],
  ai:         ['TensorFlow.js', 'Teachable Machine (on-device trichome analysis)'],
  deployment: ['GitHub Pages', 'CDN'],
  mobile:     ['PWA', 'iOS App Store', 'Google Play', 'Amazon Appstore'],
  analytics:  ['Google Analytics (G-X0XEMR28V2)'],
  devServer:  ['Python server.py — serves repo root on port 8000']
};
```

---

## 🧪 Key Features

### 📊 Strain Intelligence
- 2,800+ strains with THC/CBD, genetics, flowering time
- Strain search with image previews
- Auto vs photoperiod detection → adjusts veg weeks

### 📅 Smart Schedule Generation
- 126-row base schedule (seedling → veg → flower → harvest)
- Dynamic nutrient columns per selected brand/product
- Personalized start date → day-by-day calendar dates
- Saved to IndexedDB, fully offline

### 📋 Schedule Viewer
- Card view (mobile-first, collapsible per day)
- Table view (power user, all columns, sticky headers)
- My Notes mode — edit actuals inline on cards or in table cells
- Options dropdown — view mode + plant size + navigation in one tap
- Size filter hides excess veg weeks per plant type

### ✅ MyTask — Daily Check-In
- Hero plant photo upload (compressed to 800px JPEG)
- Today's schedule row auto-matched by date
- Expandable cards: Environmental, Water & Nutrients, Light & Air, Visual Inspection
- Color-coded inputs: green = on target, red = over, blue = under
- Auto-saves actuals to IDB on blur + manual Log button
- Progress bar: Day X of Y

### 📓 MyDiary
- Camera capture or file upload
- Column selector — overlay any schedule field on photo
- Dark theme, back to schedule viewer

### 🔬 Harvest Window
- On-device TensorFlow.js model (no server round-trip)
- Classifies: clear, clear-white, white, white-amber, amber, flower, preflower, seedling, vegetative, non-cannabis
- Model and metadata served from `loyal9.app`

---

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Strain DB      │    │ Schedule Engine  │    │  Schedule Viewer │
│  (2,800+)       │───▶│ (126 base rows + │───▶│  Cards / Table   │
│  data.js        │    │  nutrient cols)  │    │  My Notes        │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Nutrient Data   │    │  IndexedDB       │    │ MyTask / MyDiary │
│ (6 Brands)      │    │  MyGrowDB v8     │    │ (actuals logged) │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

### IndexedDB — MyGrowDB v8

| Store | Key | Value |
|---|---|---|
| `tables` | `growId` | grow metadata (name, strain, logo) |
| `tables` | `${growId}_schedule` | full schedule array |
| `selectedNutrients` | `growId` | selected nutrient IDs array |
| `nutrients` | `nutrientName` | custom nutrient objects |

Singleton instance exported as `{ IndexedDBService }` from `indexedDBService.js`. All methods are instance methods. `dbPromise` cached to prevent multiple connections.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Shannon-Goddard/grow_app.git
cd grow_app

# Serve from repo root (required for absolute fetch paths)
python server.py
# → http://localhost:8000
```

> Fetch paths in `schedule-generator.js` use `/medium-feeding/assets/data/` — must be served from repo root.

---

## 🔒 This Repo

This is the **live app webview** powering the GrowApp mobile apps. It is not open for external contributions.

If you want to explore the public-facing website codebase, check out:

> 🌐 [github.com/Shannon-Goddard/growappcannabis.guide](https://github.com/Shannon-Goddard/growappcannabis.guide)

---

## 📱 Get the Apps

[![iOS App Store](https://img.shields.io/badge/Download_on_the-App_Store-black?style=for-the-badge&logo=apple&logoColor=white)](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
[![Google Play](https://img.shields.io/badge/Get_it_on-Google_Play-green?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.growappcannabiscannabis.guide)
[![Amazon Appstore](https://img.shields.io/badge/Available_at-Amazon_Appstore-orange?style=for-the-badge&logo=amazon&logoColor=white)](https://www.amazon.com/gp/product/B0CFG7HGQK)

---

## 🌐 Connect

[![Website](https://img.shields.io/badge/🌐_Website-growappcannabis.guide-green?style=for-the-badge)](https://growappcannabis.guide)
[![Twitter](https://img.shields.io/badge/Twitter-@Loyal9GrowApp-blue?style=for-the-badge&logo=twitter)](https://twitter.com/Loyal9GrowApp)
[![Facebook](https://img.shields.io/badge/Facebook-Loyal9GrowApp-blue?style=for-the-badge&logo=facebook)](https://www.facebook.com/Loyal9GrowApp/)
[![Instagram](https://img.shields.io/badge/Instagram-@loyal9growapp-purple?style=for-the-badge&logo=instagram)](https://www.instagram.com/loyal9growapp/)

---

## 📄 License

MIT License — see [LICENSE.md](LICENSE.md)

---

<div align="center">

**"Grow what you can't."** 🌿

*Shannon passed it left. Amazon Q caught it, refactored it, rebuilt the nav, wired up the tools hub, batch-updated 2,975 files, and passed it back greener than it started.* 🍃

*Built with ❤️ by [Loyal9 LLC](https://loyal9.com) · Pair programmed with [Amazon Q](https://aws.amazon.com/q/)*

</div>
