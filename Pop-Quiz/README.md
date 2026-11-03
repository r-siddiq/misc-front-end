# US Geography Pop Quiz

A lightweight, **frontend-only** quiz built with **HTML, vanilla JavaScript, and Bootstrap**.  
It renders ten US-geography questions using a mix of inputs (text, select, checkboxes, and radio buttons), gives immediate, color-coded feedback with icons, and tracks **total attempts** via `localStorage`.

- **Live demo:** https://www.r-siddiq.tech/Pop-Quiz/
- **Additonal context:** https://www.rsiddiq.com/internet-programming.html
- **Tech:** HTML5, Bootstrap 5 (CDN), Underscore.js (CDN for shuffling), Vanilla JS

---

## Features

- ✅ **Mixed input types**: text, dropdowns, checkboxes (multi-answer), radios (single-answer)
- ✅ **Real-time grading on submit** with ✓/✗ icons and per-question feedback
- ✅ **Score calculation** out of 100 (10 points per question)
- ✅ **Attempt counter** persisted using `localStorage`
- ✅ **Randomized options** for multiple-choice questions (e.g., Q4, Q8) using `_.shuffle()`
- ✅ **Basic validation** (e.g., prevents submit if required fields are blank)
- ✅ **No build step**: works by opening `index.html` in any modern browser

---

## Project Structure

```
Pop-Quiz/
├─ index.html
├─ js/
│  └─ script.js
└─ img/
   ├─ checkmark.png
   └─ xmark.png
```

---

## How it works

- **Grading flow:** A click handler on the “Submit Quiz” button runs `gradeQuiz()`.
- **Answer keys:** Stored in a `correctAnswers` constant (see `js/script.js`), including arrays where multiple correct phrasings are accepted (e.g., “colorado river”).
- **Feedback UI:** Each question has `#q{n}Feedback` and `#markImg{n}` targets.  
  `rightAnswer(n)` paints green feedback and a ✓; `wrongAnswer(n)` paints red, ✗, and shows the correct answer.
- **Randomization:** Choice containers (e.g., `#q4Choices`, `#q8Choices`) are populated from arrays that are shuffled with `_.shuffle()`.
- **Attempts:** `localStorage["total_attempts"]` is incremented after each submit and displayed on the page.

---

## Getting Started

### 1) Run locally
No dependencies or build required.

- **Option A:** Double-click `index.html`.
- **Option B (recommended):** Serve statically to avoid any browser restrictions:
  - Python 3: `python -m http.server` and open `http://localhost:8000/`
  - Node npx: `npx http-server .` and open the printed URL

### 2) Visit Demo Site
  - https://www.r-siddiq.tech/Pop-Quiz/

---

## Customization

- **Change questions or choices:** Edit `index.html` markup (for text/select/checkbox placeholders) and the dynamic choice arrays in `script.js` (for randomized radios).
- **Edit correct answers / accepted variants:** Update the `correctAnswers` map in `js/script.js`.
- **Styling:** Swap Bootstrap utility classes in `index.html` (e.g., `bg-info`, `p-5`, `text-center`).  
  You can add a custom CSS file after the Bootstrap link if you want to override defaults.

---

## Accessibility & UX Notes

- Labels are associated with inputs (e.g., `label for="..."`) for better click targets and screen reader support.
- Visual feedback uses **contrastive backgrounds** (green/red) plus textual status (“Correct!”/“Incorrect!”).
- Keyboard users can tab through inputs and submit via the button.