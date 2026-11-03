# Learning Machine Learning: A Dynamic Web Application

This project is a multi-page educational website built with **Node.js** and **Express**, designed to teach fundamental concepts of Machine Learning. It features dynamically rendered content using **EJS templates** and integrates with the **Google Gemini AI API** to generate unique, on-demand explanations of various topics.

The application showcases a modern server-side rendering (SSR) architecture, secure API key management, and a custom-styled, responsive user interface.

  - **Live demo:** [learning-machine-learning.r-siddiq.tech/](https://learning-machine-learning.r-siddiq.tech/)
  - **Additional context:** [www.rsiddiq.com/internet-programming.html](https://www.rsiddiq.com/internet-programming.html)
  - **Scope:** A dynamic web application with a server-side rendering (SSR) architecture.

## Technical Highlights

  * **Backend Development (Node.js & Express):**

      * Built a multi-route Express server from scratch to handle HTTP requests.
      * Implemented routing to serve both static informational pages and dynamic, API-driven content.
      * Used Express middleware to serve static assets like CSS stylesheets and images.

  * **Server-Side Templating (EJS):**

      * Leveraged EJS as a templating engine to dynamically generate HTML pages on the server.
      * Structured the frontend with reusable partials (`head`, `nav`, `footer`) to maintain a consistent UI and DRY (Don't Repeat Yourself) codebase.
      * Passed data from backend routes directly into the EJS templates to render dynamic content.

  * **Third-Party API Integration:**

      * Successfully integrated the **Google Gemini AI API** (`@google/genai`) to fetch and display AI-generated content.
      * Managed asynchronous API calls within an Express route handler using `async/await`.
      * Implemented error handling to ensure the application remains stable even if the API call fails.

  * **Environment & Security:**

      * Used the `dotenv` package to securely manage API keys and other environment variables, keeping sensitive credentials out of the source code.
      * Included a `.gitignore` file to prevent `node_modules` and `.env` files from being committed to version control.

  * **Frontend Development (HTML5 & CSS3):**

      * Developed a custom, responsive dark-themed stylesheet focusing on a modern aesthetic with a professional color palette.
      * Ensured a clean and intuitive user interface for a seamless educational experience.

## Tech Stack

  * **Backend:** Node.js, Express.js
  * **Templating Engine:** EJS (Embedded JavaScript)
  * **Frontend:** HTML5, CSS3
  * **API Client:** `@google/genai`, `node-fetch`
  * **Utilities:** `dotenv`, `markdown-it`

## Project Structure

```
.
├── index.mjs                # Core Express server: setup, middleware, and routes
├── package.json             # Project metadata and dependencies
├── views/
│   ├── index.ejs            # Home page
│   ├── algorithms.ejs       # Page explaining ML algorithms with embedded media
│   ├── evaluation.ejs       # Page on model evaluation techniques
│   ├── future.ejs           # Page discussing the future of ML
│   ├── ai.ejs               # Dynamic page for AI-generated content
│   └── partials/
│       ├── head.ejs         # Reusable HTML head with metadata and CSS link
│       ├── nav.ejs          # Reusable navigation bar
│       └── footer.ejs       # Reusable footer
├── public/
│   ├── css/
│   │   └── styles.css       # Custom dark-theme stylesheet
│   └── img/                 # Static images used across the site
├── .env                     # Secure file for API keys (not in version control)
├── .env.example             # Template for required environment variables
└── .gitignore               # Specifies files/folders to be ignored by Git
```

## Setup and Installation

### 1\. Prerequisites

  * **Node.js** (v18.0.0 or higher is recommended)
  * An internet connection for installing packages and making API calls.

### 2\. Install Dependencies

Navigate to the project's root directory and run the following command to install all required packages from `package.json`:

```bash
npm install
```

### 3\. Set Up Environment Variables

This project requires a Google Gemini API key to function correctly. A sample is provided in **`.env.example`**.

1.  Create a new file named **`.env`** in the project root.
2.  Copy the contents of **`.env.example`** into your new **`.env`** file.
3.  Replace the placeholder with your actual key.

#### .env.example

```
# Server Port (Optional, defaults to 3000)
PORT=3000

# Google Gemini API Key
GOOGLE_API_KEY=YOUR_GOOGLE_KEY_HERE
```

**How to get a Google API Key:**

1.  Visit the [Google Cloud Console](https://console.cloud.google.com/) to create and obtain your API key.
2.  Copy the key and paste it as the value for `GOOGLE_API_KEY` in your `.env` file.

### 4\. Run the Server

Start the Express server with the following command:

```bash
node index.mjs
```

The server will start, and you can access the application in your browser at `http://localhost:3000`.

## Key Features & Routes

  * `GET /`: Renders the main landing page with an introduction to Machine Learning.
  * `GET /algorithms`: An informational page detailing Supervised, Unsupervised, and Reinforcement Learning, complete with examples and embedded YouTube videos.
  * `GET /evaluation`: Explains key concepts in model evaluation, such as metrics and cross-validation.
  * `GET /future`: Discusses emerging trends in the field of Machine Learning.
  * `GET /ai`: The core interactive feature of the application.
      * Presents a form where users can enter any topic.
      * On submission, the backend calls the **Google Gemini API** with the user's topic.
      * The API's response is rendered as HTML on the page, providing a unique, AI-generated summary.