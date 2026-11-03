# Sign Up Page

A clean, responsive sign-up form project using HTML, CSS, JavaScript, and Bootstrap; includes client-side validation, API-driven data lookups, username availability checks, and password suggestions.

- **Live demo:** https://www.r-siddiq.tech/Sign-Up-Page/
- **Additional context:** https://www.rsiddiq.com/internet-programming.html
- **Scope:** Frontend-only, static site
- **Tech:** HTML5, CSS3, JavaScript (no dependencies)

## ✨ Features

- Responsive sign‑up form UI
- Password fields with validation cues
- Interactive behaviors via JavaScript
- Custom validation logic

## 📦 Project Structure

```
Sign-Up-Page/
├── index.html
├── welcome.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── img/
├── .gitignore
└── README.md
```
---

## 🚀 Getting Started

### 1) Run locally
No dependencies or build required.

### Option A: Open directly
Double-click `index.html` in any modern browser.

### Option B (recommended): Serve statically
Some browsers throttle local assets. Use a simple local server:

- **Python 3**
  ```bash
  python -m http.server
  ```
  Visit http://localhost:8000/

- **Node (npx)**
  ```bash
  npx http-server .
  ```
  Follow the printed URL.

### 2) Visit Demo Site
  - https://www.r-siddiq.tech/Sign-Up-Page/

---

### 🧩 Dependencies

* **Bootstrap 5.3.3 (CDN)** is used (linked in `<head>`). Add this note and the CDN tag in the README for clarity/troubleshooting.

### 🌐 External APIs (frontend calls)

Document these so reviewers know what dynamic pieces do and why they may fail offline:

* `https://csumb.space/api/cityInfoAPI.php?zip=<ZIP>` → populates **City**, **Latitude**, **Longitude** on `#zip` change.
* `https://csumb.space/api/countyListAPI.php?state=<STATE>` → populates **County** dropdown on `#state` change.
* `https://csumb.space/api/usernamesAPI.php?username=<USERNAME>` → shows **“Username available/taken”** as the user types.
* `https://csumb.space/api/suggestedPassword.php?length=8` → shows a **suggested password** on focus of password field.

> Note: Since these are third-party endpoints, outages/CORS/network issues will disable dynamic features. No keys/tokens required.

### 🧱 Form fields & behavior (what the UI actually does)

* **First Name / Last Name**: plain text inputs.
* **Gender**: `Male`/`Female` radios.
* **Zip**: triggers **City/Lat/Long** lookup (read-only spans).
* **State**: triggers **County** dropdown population.
* **Desired Username**: checks availability live; shows inline error/status.
* **Password / Confirm Password**: displays inline errors; shows a suggested password on focus.
* **Submit**: navigates to `welcome.html` **only if** validation passes.

### ✅ Client-side validation (current rules implemented)

* **Username**: required; shows *“Username is required!”*. Live availability via API (“available”/“taken”).
* **Password**:

  * Required; error: *“Must enter a password!”*
  * **Minimum length: 6**; error: *“Password must be at least 6 characters long!”*
* **Confirm Password**:

  * Required; error: *“Must confirm your password!”*
  * **Must match** password; error: *“Passwords do not match!”*
* **Zip/City/County/State**: populated/validated by API responses (no HTML5 pattern constraints in markup).

> There’s **no email field** and **no HTML5 pattern** validation on username/zip.

### 📨 Form submission details

* `action="welcome.html"`, **no `method` specified** → defaults to **GET**.
* No backend; the page **does not persist** user data. `welcome.html` is a simple landing page.

### ♿ Accessibility notes (current state + quick wins)

* Inputs for **First/Last Name** are preceded by text rather than `<label for="...">`; consider adding labels bound to input `id`s.
* Radio buttons use labels correctly.
* All interactive controls are keyboard-reachable.
* Consider adding descriptive `aria-live="polite"` to the inline error/status spans.

### 🔒 Privacy & data handling

* All data stays client-side; API requests are **anonymous GETs** to `csumb.space`. No credentials/PII persisted by this project.