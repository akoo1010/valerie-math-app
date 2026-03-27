# 🌟 Valerie's Math Adventure

A personalized, interactive math learning app for Valerie, built around the **Khan Academy 3rd & 4th Grade Math syllabus**. Designed to make math fun through themes she loves — swimming 🏊‍♀️, Geometry Dash 🎮, and arts & crafts 🎨.

---

## ✨ Features

- **Two grade worlds** — 3rd Grade (Ocean, Dash & Craft World) and 4th Grade (Monster & Dance World)
- **26 exercise units** covering the full Khan Academy syllabus for grades 3–4
- **Adaptive difficulty** — hard questions are flagged and added to the Practice Zone
- **Star-based progress tracking** — earn stars for each completed unit
- **Practice Zone** — revisit tricky questions for extra reinforcement
- **Animations & audio** — confetti celebrations, sound effects, and smooth transitions
- **No build step** — runs directly in the browser with no dependencies to install

---

## 🗂️ Project Structure

```
math-app/
├── index.html              # Main entry point
├── css/
│   └── styles.css          # All styling (dark mode, animations, themes)
└── js/
    ├── app.js              # App controller (screen routing, progress state)
    ├── engine.js           # Exercise rendering engine (all question types)
    ├── adaptive.js         # Adaptive difficulty & missed-question tracking
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

No installation or build step required.

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Click **Let's Go!** and start exploring!

> **Tip:** For the best experience (especially audio), open via a local web server rather than directly from the file system. You can use VS Code's Live Server extension or run:
> ```bash
> npx serve .
> ```

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

- **HTML5** — structure and screens
- **Vanilla CSS** — theming, animations, responsive layout
- **Vanilla JavaScript** — no frameworks, no dependencies
- **Google Fonts** — Fredoka One & Nunito for a friendly, kid-friendly feel

---

## 💾 Progress & Data

Progress (stars earned, missed questions) is saved to **`localStorage`** in the browser. Clearing browser data will reset progress.
