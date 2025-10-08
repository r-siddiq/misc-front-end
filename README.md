# Inspira Find — Quote Finder (Node.js + Express + EJS + MySQL)

**Live demo:** https://inspira-find.r-siddiq.tech/  
**Additional context:** https://www.rsiddiq.com/internet-programming.html  
**Scope:** A server-rendered quotes search app with MySQL-backed filtering, Bootstrap UI, and author detail modals.

## Overview

Inspira Find is a server-side rendered web application that lets users explore inspirational quotes by **keyword**, **author**, **category**, **profession**, and **like range**. It uses **Express 5**, **EJS templates**, and a **MySQL** database seeded from `seed_data.sql`. The interface is styled with **Bootstrap 5**, and author details are displayed in a **modal** powered by a lightweight client-side script.

## Technical Highlights

- **Backend (Node.js + Express):**
  - Express app configured in `index.mjs` with `express.static` for assets and `express.urlencoded` for form parsing.
  - MySQL **connection pool** via `mysql2/promise`, configured from environment variables with **dotenv**.
  - Parameterized SQL queries prevent injection; results are rendered to EJS templates.

- **Database (MySQL):**
  - Schema and sample data defined in `seed_data.sql` including tables: `q_authors` and `q_quotes`.
  - Example fields include `profession`, `category`, `likes`, with **NATURAL JOIN** across `q_quotes` and `q_authors` for lookups.

- **Templating (EJS):**
  - Views in `/views` with reusable partials (`partials/header.ejs`, `partials/footer.ejs`).
  - `index.ejs` provides multiple search forms; `results.ejs` lists quotes and binds author links to modal behavior.

- **Frontend (HTML, CSS, Bootstrap 5):**
  - `public/css/styles.css` supplies a clean, responsive layout.
  - `public/js/scripts.js` registers click handlers for author links and populates a **Bootstrap modal** with author details via `/api/author/:id`.

- **API-style endpoints:**
  - `GET /api/author/:id` returns author metadata (JSON) for the modal.
  - `GET /allAuthors` exposes a simple JSON list.
  - `GET /dbTest` validates database connectivity.

## Tech Stack

- **Runtime & Frameworks:** Node.js, Express 5
- **Templating:** EJS
- **Database:** MySQL (mysql2/promise)
- **Styling/UI:** Bootstrap 5, custom CSS
- **Languages:** HTML, CSS, JavaScript (client + server)
- **Utilities:** dotenv
- **Dependencies:** dotenv ^17.2.3, ejs ^3.1.10, express ^5.1.0, mysql2 ^3.14.0

-----

## Project Structure

```
.
├── index.mjs                # Core Express server: setup, database connection, and routes
├── package.json             # Project metadata and dependencies
├── seed_data.sql            # SQL script for database schema and seed data
├── views/
│   ├── index.ejs            # Home page with search forms
│   ├── results.ejs          # Page to display search results
│   └── partials/
│       ├── header.ejs       # Reusable HTML head with metadata and CSS/JS links
│       └── footer.ejs       # Reusable footer
├── public/
│   ├── css/
│   │   └── styles.css       # Custom stylesheet
│   └── js/
│       └── scripts.js       # Client-side script for author info modal
├── .env                     # Secure file for database credentials (not in version control)
└── .env.example             # Template for required environment variables
```

-----

## Key Routes & Features

- `GET /` — Landing page with forms to search:
  - **Keyword** → `/searchByKeyword?keyword=...`
  - **Author** → `/searchByAuthor?authorId=...`
  - **Profession** → `/searchProfession?profession=...`
  - **Likes range** → `/searchByLikesRange?minLikes=..&maxLikes=..`
  - **Category** → `/searchByCategory?category=...`
- `GET /api/author/:id` — JSON payload for author details (used by modal).
- `GET /allAuthors` — Returns all authors as JSON.
- `GET /dbTest` — Returns `CURDATE()` to confirm DB connectivity.

> All search endpoints use **prepared statements** with parameterized inputs via `mysql2/promise`.

-----

## Setup and Installation

### 1\. Prerequisites

  * **Node.js** (v18.0.0 or higher is recommended)
  * **MySQL Server**: A running instance of MySQL. This can be a local installation, a Docker container, or a cloud-based service.

### 2\. Install Dependencies

Navigate to the project's root directory and run the following command to install all required packages from `package.json`:

```bash
npm install
```

### 3\. Set Up Environment Variables

This project requires a connection to a MySQL database.

1.  Create a new file named **`.env`** in the project root.
2.  Copy the contents of **`.env.example`** into your new **`.env`** file.
3.  Replace the placeholder values with your actual database credentials.

#### .env.example

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=inspira_find
DB_CONNECTION_LIMIT=10
```

### 4\. Create and Seed the Database

You can set up the database in one of the following ways:

  * **Local MySQL Server:**

    1.  Log in to your MySQL server.
    2.  Create a new database: `CREATE DATABASE inspira_find;`
    3.  Use the new database: `USE inspira_find;`
    4.  Run the `seed_data.sql` script to create the tables and insert the sample data. You can do this by executing the file's contents in your MySQL client.

  * **Docker:**

    1.  If you have Docker installed, you can spin up a MySQL container.
    2.  Connect to the container's MySQL instance and follow the steps for a local server.

### 5\. Run the Server

Start the Express server with the following command:

```bash
node index.mjs
```

The server will start, and you can access the application in your browser at `http://localhost:3000`.

-----

## Security & Reliability Notes

- Uses **connection pooling** for efficient database access.
- Employs **prepared statements** to reduce SQL injection risks.
- Secrets are provided via **dotenv**; ensure `.env` is not committed to VCS.
- Bootstrap assets are served from a trusted CDN; `public/` contains local CSS/JS.