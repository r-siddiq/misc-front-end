# Guess-It 🎯

A tiny, **frontend-only** number guessing game. Pick a number between **1–99** and try to guess it in **7 attempts**. Built with **HTML**, **CSS**, and **vanilla JavaScript**; no frameworks, no build step.

- **Additional context:** https://www.rsiddiq.com/internet-programming.html
- **Scope:** Frontend-only, static site
- **Tech:** HTML5, CSS3, JavaScript (no dependencies)

---

## Features

- 🔢 Random number between **1–99**
- 🧠 **7 attempts** with **high/low** feedback
- 🧾 Shows **previous guesses**
- 🏁 Tracks **Wins / Losses** for the session
- ⏯️ **Reset** to start a new round
- 🖼️ Background image styling for a lightweight game feel

---

## Project Structure

```
Guess-It/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── img/
    └── gnumber.jpg
```

---

## Quick Start

You can open it directly—no server required.

```bash
# Option 1: Open the HTML file
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux

# Option 2: Run a tiny static server (optional)
# Python 3
python -m http.server 5500
# then visit: http://localhost:5500
```

---

**Key files**  
- `index.html` — Markup for the game UI (header, input, buttons, feedback)
- `css/style.css` — Centered layout, full-bleed background image, button/input styling
- `js/script.js` — Core game logic:
  - generate random number `1..99`
  - handle guesses & attempt count
  - update feedback (`high/low/correct`)
  - display previous guesses
  - track `wins` and `losses`
  - toggle **Guess** / **Reset** buttons

> Note: If you’re reviewing the repository preview and some code appears collapsed with `...`, open the actual file to see the complete implementation.

---

## Game Rules

1. The game selects a secret number between **1** and **99**.
2. You have **7** attempts to guess it.
3. After each guess you’ll see:
   - **“Guess was high”** or **“Guess was low”**, or
   - **“Correct!”** when you win.
4. Past guesses and remaining attempts are shown.
5. Wins/Losses update when the round ends.
6. Click **Reset** to play again.

---

## How it Works (Under the Hood)

- On load, `initializeGame()` seeds a new random number and resets counters.
- Clicking **Guess**:
  - parses the numeric input,
  - validates it’s within `1..99`,
  - compares it to the secret number,
  - updates the feedback, attempts left, and guess history.
- On **win** or **out of attempts**, the game:
  - increments **wins** or **losses**,
  - hides **Guess** and shows **Reset**,
  - waits for a new `initializeGame()` call.