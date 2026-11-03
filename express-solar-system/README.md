# Express Solar System

A small Node/Express project that builds a multi-page website about the Solar System using **JavaScript**, **EJS templates**, **HTML**, **CSS**, and external **APIs**. It demonstrates routing, serving static assets, templating with partials, and consuming web APIs (Unsplash + NASA APOD).

> Additonal context: https://www.rsiddiq.com/internet-programming.html

## Highlights

- **Node.js + Express**: routes, middleware, static assets
- **EJS templating**: views, passing data from routes to templates
- **Partials**: reusable `head`, `nav`, and `footer`
- **Client-facing HTML & CSS**: external stylesheet under `public/css`
- **APIs**: Unsplash (random background) and NASA APOD (Picture of the Day)
- **JavaScript**: server-side (Node/Express) and templating logic
- **Project structure** suitable for beginner-to-intermediate Express apps

## Tech Stack

- **Node.js** (Express)
- **EJS** (templating engine)
- **HTML5 / CSS3**
- **node-fetch** for API calls

## Project Structure

```
.
├── index.mjs                # Express app & routes
├── package.json
├── views/
│   ├── index.ejs            # Home page (random background image)
│   ├── earth.ejs            # Example planet page (uses npm-solarsystem)
│   └── partials/
│       ├── head.ejs
│       ├── nav.ejs
│       └── footer.ejs
├── public/
│   ├── css/
│   │   └── styles.css       # External stylesheet
│   └── img/                 # Static images
├── .env                     # Place API keys here
├── .env.example             # Template for required env vars
└── .gitignore
```

## Setup

### 1) Prerequisites
- **Node.js** (LTS or current)
- An internet connection for API calls

### 2) Install dependencies
```bash
npm install
```

### 3) Environment variables

This project uses a `.env` file for API keys. A sample is provided in **`.env.example`**. Create your own **`.env`** at the project root by copying the example and filling in real values:

```
UNSPLASH_ACCESS_KEY=YOUR_UNSPLASH_KEY_HERE
NASA_API_KEY=YOUR_NASA_KEY_HERE
```

**How to get keys:**

- **Unsplash Access Key**
  1. Create an account and a developer application at Unsplash.
  2. Copy your **Access Key** and set it as `UNSPLASH_ACCESS_KEY`.

- **NASA API Key**
  1. Request a key from the official NASA API portal.
  2. Use that value for `NASA_API_KEY`.

### 4) Run the server

Start the server:
```bash
node index.mjs
```

Then open your browser at:
```
http://localhost:3000
```

## Key Routes

- `GET /`  
  Renders the home page and attempts to load a **random background image** from Unsplash using `UNSPLASH_ACCESS_KEY`.

- `GET /earth`  
  Example planet page (data can be sourced from a package like `npm-solarsystem`) rendered via EJS.

- `GET /picOfDay`  
  Fetches the **NASA Astronomy Picture of the Day (APOD)** using `NASA_API_KEY`. If `date` is omitted, the route may default to “today” depending on your implementation.

## Notes

- The `.env.example` file documents required environment variables. Copy it to `.env` and fill in your real keys.
- If an API call fails (rate limit, network, or missing key), the app will still render the page, but may omit the dynamic content for that route.