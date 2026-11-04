# 🌟 Valerie's Math Adventure

A personalized, interactive math learning app for Valerie, aligned with **3rd and 4th grade math topics**. Designed to make math fun through themes she loves — swimming 🏊‍♀️, Geometry Dash 🎮, and arts & crafts 🎨.

**Live app:** [valerie-math.vercel.app](https://valerie-math.vercel.app)

---

## ✨ Features

- **Two grade worlds** — 3rd Grade (Ocean, Dash & Craft World) and 4th Grade (Monster & Dance World)
- **26 exercise units** covering the app's 3rd and 4th grade topic map, with several story contexts per skill so practice doesn't repeat
- **Boss battles** — every unit has a boss. Timed questions mixed from the whole unit: right answers hit the boss, fast answers are ⚡ critical hits, wrong answers or running out of time cost a heart. Beating a boss unlocks the next unit and records a best time to race on rematches
- **Story & characters** — each world has a guide (Coral 🧜‍♀️ in 3rd grade, Fizz 🐲 in 4th) who tells the story, points to the next boss, and cheers during battles. Each boss win returns a collectible (🐚 Star Shells / 💎 Rhythm Gems) and unlocks a story chapter
- **Keyboard friendly** — type and press Enter, press 1–4 to pick a multiple-choice answer, T/F for true/false, Enter to continue
- **Adaptive difficulty** — questions get harder or easier based on consecutive correct/wrong streaks
- **Misconception detection** — identifies specific error patterns and shows targeted hints
- **Star-based progress tracking** — earn up to 3 stars per round; complete 50% of a unit's rounds to unlock the next unit
- **Practice Zone** — missed skills are queued for reinforcement, plus free-play multiplication tables (×1–×12 and mixed)
- **Cross-device persistence** — progress is saved to the cloud via Vercel KV and syncs across any browser or device
- **Progress Backup** — export and restore progress + study notes with a JSON backup file
- **Animations & audio** — confetti celebrations, sound effects, and smooth transitions

---

## 🗂️ Project Structure

```
valerie-math-app/
├── index.html              # Main entry point
├── vercel.json             # Vercel config (empty — platform defaults are correct here)
├── package.json            # Dependencies (@vercel/kv)
├── api/
│   └── progress.js         # Serverless API: GET/POST progress to Vercel KV
├── css/
│   └── styles.css          # All styling (animations, themes, responsive layout)
└── js/
    ├── app.js              # App controller (screen routing, map rendering)
    ├── engine.js           # Exercise rendering engine (all question types)
    ├── boss.js             # Boss battles: timer, HP/hearts, crits, results
    ├── story.js            # Guides, villains, per-unit bosses and story chapters
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

## 🔎 Development Checks

This app is intentionally framework-free, so there is no build step. Before changing shared engine code, API code, or unit generators, run:

```bash
npm run check
```

The check script runs `node --check` across JavaScript files, then loads every unit file with a small `Engine.Utils` harness and generates ~13,000 questions (8 samples of every exercise × difficulty × modality). It verifies that:

- Every generator terminates for each difficulty level
- Multiple-choice options include the correct answer, are unique, and no other option is numerically equal to it (e.g. `1/2` and `2/4` both offered)
- Every arithmetic statement in question text, hints, visuals, worked examples and targeted hints is true (`6 × 7 = 42`, `3/8 + 2/8 = 5/8`, `17 ÷ 5 = 3 R 2`)
- Typed answers can actually be typed: finite, non-negative numbers without floating-point noise (`0.1 + 0.2` style)
- True/false answers are booleans, click-to-build targets fit their grid, and custom `checkAnswer` functions accept the answer
- Hint text and targeted misconception hints are complete and don't contain unresolved generated values
- Declared `exerciseCount` values match the number of generated exercises

`npm test` runs the same checks.

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

## 🎨 Assets & Credits

- **UI & Sound Effects** — Created by [Kenney](https://www.kenney.nl) (Creative Commons Zero, CC0)


---

## 💾 Progress & Data

Progress is saved in two places:

1. **Cloud (Vercel KV)** — loaded first on every page visit, then debounced to avoid excessive writes. Works across any browser or device.
2. **localStorage** — used as an offline fallback if the network is unavailable.

Valerie's progress can also be exported from the "For grown-ups" page as a JSON backup file and restored on another device. Backups include unit completion, stars, skill mastery, wrong-answer study notes, misconception counts, the weakness queue, unlocked units, boss records (wins, best times) and which story scenes she has seen. The per-visit session state is not included.

No user accounts or personal data are collected. All progress is stored under a single key for Valerie.

---

## 🧠 Adaptive Engine

- **Difficulty levels (1–3)** are tracked per skill. Three consecutive correct answers bump difficulty up; two consecutive wrong answers bump it down.
- **Modality switching** picks between standard input, multiple choice, and worked examples based on recent performance.
- **Weakness queue** tracks skills the player has missed and surfaces them in the Practice Zone until they're mastered again.
- **Hint escalation** — hint level persists across retries of the same question, so each subsequent attempt gets a more direct nudge.
- **Boss battles feed the same model** — boss answers update skill mastery, difficulty, the weakness queue and the daily goal just like a normal round (timeouts don't count as a wrong answer).
