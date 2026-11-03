# Quake-Finder

A responsive web application for finding earthquake data using the USGS API. The app allows users to search for earthquakes based on date range, magnitude, and location, and displays the results on a separate page.

  - **Live demo:** [r-siddiq.tech/Quake-Finder](https://r-siddiq.tech/Quake-Finder)
  - **Additional context:** [www.rsiddiq.com/internet-programming.html](https://www.rsiddiq.com/internet-programming.html)
  - **Scope:** Frontend-only, static site
  - **Tech:** HTML5, CSS3, JavaScript (no dependencies)

-----

## ✨ Features

  - Interactive map for selecting a location.
  - Search for earthquakes by date, magnitude, and radius from a selected point.
  - Displays earthquake results with location, magnitude, and date.
  - Loading indicator during API requests.
  - Client-side validation for form inputs.

-----

## 📦 Project Structure

```
Quake-Finder/
├── index.html
├── results.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── config.js
├── config.example.js
├── .gitignore
└── README.md
```

-----

## 🚀 Getting Started

### 1\) Run locally

No dependencies or build required.

#### Option A: Open directly

Double-click `index.html` in any modern browser.

#### Option B (recommended): Serve statically

Some browsers have security restrictions for local files. Use a simple local server for the best experience:

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

### 2\) Add Google Maps API Key

To use the map feature, you will need a Google Maps API key.

1.  Create a copy of `config.example.js` and rename it to `config.js`.

2.  Open `config.js` and replace `"Place API key here"` with your Google Maps API key.

    ```javascript
    window.CONFIG = { GOOGLE_MAPS_API_KEY: "Place API key here" };

    // Auto-inject Maps JS on load
    (function loadMaps() {
      const key = window.CONFIG?.GOOGLE_MAPS_API_KEY || "";
      const s = document.createElement("script");
      s.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        encodeURIComponent(key) +
        "&libraries=marker&callback=initMap&loading=async";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    })();
    ```

-----

### 🧩 Dependencies

  - **Google Maps API** is used for the interactive map functionality.

-----

### 🌐 External APIs (frontend calls)

  - `https://earthquake.usgs.gov/fdsnws/event/1/query`: Fetches earthquake data from the USGS.
  - `https://maps.googleapis.com/maps/api/js`: Loads the Google Maps JavaScript API.

-----

### 🧱 Form fields & behavior (what the UI actually does)

  - **Start Date / End Date**: Required date inputs for the search range.
  - **Minimum Magnitude / Maximum Magnitude**: Required number inputs for the magnitude range.
  - **Radius (km)**: Optional number input for the search radius around a selected point on the map.
  - **Map**: An interactive Google Map where the user can click to select a location to search within a radius of.
  - **Search Earthquakes button**: Submits the form to fetch and display earthquake data.

-----

### ✅ Client-side validation (current rules implemented)

  - **Magnitude**:
      - Required.
      - Must be a number between 1 and 8.
      - Maximum magnitude must be greater than or equal to the minimum magnitude.
  - **Dates**:
      - Start Date and End Date are required.
      - Start Date cannot be after the End Date.

-----

### 📨 Form submission details

  - The form submission is handled by JavaScript.
  - When the form is submitted, the application constructs a URL for the USGS Earthquake API based on the form inputs.
  - The fetched data is stored in `localStorage` and the user is redirected to `results.html` to view the earthquake data.

-----

### 🔒 Privacy & data handling

  - The user's location is not tracked.
  - The Google Maps API key is intended to be stored in a local `config.js`.
  - Earthquake search queries and results are stored in the browser's `localStorage`. This data is not transmitted to any server.