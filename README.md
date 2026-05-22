# 🌟 Valerie's Math Adventure

A personalized, interactive math learning app for Valerie, aligned with **3rd and 4th grade math topics**. Designed to make math fun through themes she loves — swimming 🏊‍♀️, Geometry Dash 🎮, and arts & crafts 🎨.

**Live app:** [valerie-math-app.vercel.app](https://valerie-math-app.vercel.app)

---

## ✨ Features

- **Two grade worlds** — 3rd Grade (Ocean, Dash & Craft World) and 4th Grade (Monster & Dance World)
- **26 exercise units** covering the app's 3rd and 4th grade topic map
- **Adaptive difficulty** — questions get harder or easier based on consecutive correct/wrong streaks
- **Misconception detection** — identifies specific error patterns and shows targeted hints
- **Star-based progress tracking** — earn up to 3 stars per round; complete 50% of a unit's rounds to unlock the next unit
- **Practice Zone** — missed skills are queued for reinforcement, plus free-play multiplication tables (×1–×12 and mixed)
- **Cross-device persistence** — progress is saved to the cloud via Vercel KV and syncs across any browser or device
- **Animations & audio** — confetti celebrations, sound effects, and smooth transitions

---

## 🗂️ Project Structure

```
valerie-math-app/
├── index.html              # Main entry point
├── vercel.json             # Vercel routing config
├── package.json            # Dependencies (@vercel/kv)
├── api/
│   └── progress.js         # Serverless API: GET/POST progress to Vercel KV
├── css/
│   └── styles.css          # All styling (animations, themes, responsive layout)
└── js/
    ├── app.js              # App controller (screen routing, map rendering)
    ├── engine.js           # Exercise rendering engine (all question types)
    ├── adaptive.js         # Adaptive difficulty, mastery tracking, cloud sync
    ├── types.js            # Shared JSDoc contracts for editor/type checking
    ├── animations.js       # Confetti, particle effects, mascot animations
    ├── audio.js            # Sound effects (correct, wrong, celebration)
    └── units/              # Individual exercise unit files
        ├── multiplication.js
        ├── multiplication-1digit.js
        ├── addition-subtraction.js
        ├── division.js
        ├── fractions.js
        ├── patterns.js
        ├── geometry.js
        ├── area.js
        ├── perimeter.js
        ├── time.js
        ├── measurement.js
        ├── data-graphs.js
        ├── 4-place-value.js
        ├── 4-add-sub-estimation.js
        ├── 4-multiply-1digit.js
        ├── 4-multiply-2digit.js
        ├── 4-division.js
        ├── 4-factors-multiples.js
        ├── 4-equiv-fractions.js
        ├── 4-add-sub-fractions.js
        ├── 4-multiply-fractions.js
        ├── 4-decimals.js
        ├── 4-angles.js
        ├── 4-area-perimeter.js
        ├── 4-measurement.js
        └── 4-plane-figures.js
```

---

## 🚀 Getting Started

### Running locally

```bash
npm install
npx vercel dev
```

`vercel dev` serves the static files and runs the `/api/progress` serverless function locally, so cloud sync works during development.

> Without `vercel dev`, you can still open `index.html` directly in a browser — progress will fall back to `localStorage` automatically.

### Deploying to Vercel

```bash
vercel --prod
```

The `/api/progress` endpoint requires a **Vercel KV (Upstash Redis)** store connected to the project. Add one via the [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=redis) — the required environment variables are injected automatically.

---

## 📚 Curriculum Coverage

### 3rd Grade Units
| Unit | Topic |
|------|-------|
| 🌊 | Intro to Multiplication |
| 🏊 | 1-Digit Multiplication |
| ➕ | Addition & Subtraction |
| ➗ | Division |
| 🍕 | Fractions |
| 🔷 | Patterns |
| 📐 | Geometry |
| 📦 | Area |
| 📏 | Perimeter |
| 🕐 | Time |
| 📊 | Measurement |
| 📈 | Data & Graphs |

### 4th Grade Units
| Unit | Topic |
|------|-------|
| 🔢 | Place Value |
| ➕ | Addition, Subtraction & Estimation |
| ✖️ | Multiply by 1-Digit |
| ✖️ | Multiply by 2-Digit |
| ➗ | Division |
| 🔢 | Factors & Multiples |
| 🍕 | Equivalent Fractions |
| ➕ | Add & Subtract Fractions |
| ✖️ | Multiply Fractions |
| 🔟 | Decimals |
| 📐 | Angles |
| 📦 | Area & Perimeter |
| 📏 | Measurement |
| 🔷 | Plane Figures |

---

## 🛠️ Tech Stack

- **HTML5 / Vanilla CSS / Vanilla JavaScript** — no framework, no build step
- **Vercel** — hosting and serverless functions
- **Vercel KV (Upstash Redis)** — cloud persistence for cross-device progress sync
- **Google Fonts** — Fredoka One & Nunito

---

## 💾 Progress & Data

Progress is saved in two places:

1. **Cloud (Vercel KV)** — loaded first on every page visit, then debounced to avoid excessive writes. Works across any browser or device.
2. **localStorage** — used as an offline fallback if the network is unavailable.

No user accounts or personal data are collected. All progress is stored under a single key for Valerie.

---

## 🧠 Adaptive Engine

- **Difficulty levels (1–3)** are tracked per skill. Three consecutive correct answers bump difficulty up; two consecutive wrong answers bump it down.
- **Modality switching** picks between standard input, multiple choice, and worked examples based on recent performance.
- **Weakness queue** tracks skills the player has missed and surfaces them in the Practice Zone until they're mastered again.
- **Hint escalation** — hint level persists across retries of the same question, so each subsequent attempt gets a more direct nudge.
