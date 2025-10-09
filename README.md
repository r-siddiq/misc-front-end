# Inspira Find — Quote Finder (Node.js + Express + EJS + MySQL)

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-black)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/Templating-EJS-8A2BE2)

## Overview

Inspira Find is a server-side rendered web application that lets users explore inspirational quotes. The application is divided into two distinct portals: a minimal landing page (/) that links to separate User (/user) and Admin (/admin) sections.

The User portal allows searching for inspirational quotes by **keyword**, **author**, **profession**, **category**, and **likes**. It uses **Express 5**, **EJS**, and a **MySQL** database (seeded from `seed_data.sql`). The UI is styled with **Bootstrap 5** and earch results feature links that open a Bootstrap modal window, which is populated with detailed author information via an AJAX request.

The Admin portal provides full CRUD (**Create**, **Read**, **Update**, **Delete**) functionality for both Authors and Quotes through a series of dedicated views. It features a distinct layout with a left sidebar for navigation.

> **Live demo:** https://inspira-find.r-siddiq.tech/  
> **Additional context:** https://www.rsiddiq.com/internet-programming.html

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Database](#database)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
  - [User Search](#user-search)
  - [Admin CRUD](#admin-crud)
  - [Utilities & Health](#utilities--health)
- [Security Notes](#security-notes)

---

## Features
- **Multi‑criteria search**: keyword, author, profession, category, likes range.
- **Author details modal**: fetches `/api/author/:id` to show portrait, profession, dates, country, bio.
- **Admin portal**: create, list, update, and delete authors and quotes.
- **Split styling**: dedicated CSS for user vs admin views.
- **Health checks** and DB test endpoint.

## Architecture
- **Server**: Express 5 with EJS views.
- **DB**: MySQL using `mysql2/promise` and a connection pool.
- **Views**: Bootstrap 5 + custom CSS bundles (user/admin).
- **Client JS**: lightweight script for author modal on results page.

## Tech Stack
- **Runtime & Framework**: Node.js (LTS), Express 5
- **Templating**: EJS
- **Database**: MySQL (`mysql2`)
- **Styling**: Bootstrap 5 (CDN) + `/public/css/user.css` and `/public/css/admin.css`
- **Config**: dotenv

---

## Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **MySQL** 8+ (or compatible server)

### Install
```bash
npm install
```

### Configure Database
Create a database and load the seed script:
```sql
CREATE DATABASE inspira_find;
USE inspira_find;
-- run contents of seed_data.sql
```

### Environment Variables
Copy `.env.example` to `.env` and fill in values (see [Configuration](#configuration)).

### Run
```bash
node index.mjs
# open http://localhost:3000
```

---

## Configuration
Create `.env` in the repo root:
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=inspira_find
DB_CONNECTION_LIMIT=10
```
- Server port is **3000** (configured in `index.mjs`).
- A MySQL **connection pool** is used (defaults to 10 when not provided).

---

## Database

### Tables
**`q_authors`**
| Column     | Type         | Notes                   |
|------------|--------------|-------------------------|
| authorId   | MEDIUMINT(9) | PK AUTO_INCREMENT       |
| firstName  | VARCHAR(25)  | NOT NULL                |
| lastName   | VARCHAR(25)  | NOT NULL                |
| dob        | DATE         | NOT NULL                |
| dod        | DATE         | NULL allowed            |
| sex        | CHAR(1)      | NOT NULL                |
| profession | VARCHAR(50)  | NOT NULL                |
| country    | VARCHAR(25)  | NOT NULL                |
| portrait   | VARCHAR(200) | NOT NULL (URL)          |
| biography  | VARCHAR(500) | NOT NULL                |

**`q_quotes`**
| Column   | Type         | Notes                        |
|----------|--------------|------------------------------|
| quoteId  | MEDIUMINT(9) | PK AUTO_INCREMENT            |
| quote    | VARCHAR(200) | NOT NULL                     |
| authorId | SMALLINT(6)  | NOT NULL (joins authorId)    |
| category | VARCHAR(200) | NOT NULL                     |
| likes    | INT(11)      | DEFAULT NULL                 |

**Notes**
- Tables are created as **MyISAM**; no foreign‑key constraints.
- Queries use a **`NATURAL JOIN`** over `authorId` across `q_quotes` and `q_authors`.

---

## Project Structure
```text
inspira-find/
├─ index.mjs                      # Express app, routes, DB pool, cssBundle toggle
├─ package.json                   # express, ejs, mysql2, dotenv
├─ seed_data.sql                  # schema + seed rows
├─ .env.example                   # copy -> .env (do not commit secrets)
├─ public/
│  ├─ css/
│  │  ├─ admin.css               # Admin-only look & sidebar styles
│  │  └─ user.css                # User portal look (forms/results)
│  └─ js/
│     └─ scripts.js              # Results-page modal: fetch /api/author/:id
└─ views/
   ├─ app.ejs                    # Landing: links to /user and /admin
   ├─ user_index.ejs             # User search forms
   ├─ admin_index.ejs            # Admin menu (Add/List)
   ├─ results.ejs                # Search results + Bootstrap modal shell
   ├─ authorList.ejs             # Admin: list authors (update/delete)
   ├─ quoteList.ejs              # Admin: list quotes (update/delete)
   ├─ newAuthor.ejs              # Admin: create author
   ├─ editAuthor.ejs             # Admin: update author
   ├─ newQuote.ejs               # Admin: create quote
   ├─ editQuote.ejs              # Admin: update quote
   └─ partials/
      ├─ header.ejs              # Picks admin.css/user.css via res.locals.cssBundle
      ├─ footer.ejs
      └─ sidebar.ejs             # Admin-only navigation
```

---

## Endpoints

### User Search
- `GET /` — Landing page.
- `GET /user` — User portal with DB‑driven dropdowns.
- `GET /searchByKeyword?keyword=...` — Filter quotes by text match.
- `GET /searchByAuthor?authorId=...`
- `GET /searchProfession?profession=...`
- `GET /searchByLikes?minLikes=..&maxLikes=..` — Likes range filter.
- `GET /searchByCategory?category=...`
- `GET /api/author/:id` — JSON author record for the results modal.

**Example**
```bash
curl "http://localhost:3000/searchByKeyword?keyword=inspire"
```

### Admin CRUD
- **Home & Lists**
  - `GET /admin` — Admin menu.
  - `GET /authors` — List authors.
  - `GET /quotes` — List quotes.
- **Create**
  - `GET /author/new` → form; `POST /author/new` → insert into `q_authors`.
  - `GET /quote/new` → form; `POST /quote/new` → insert into `q_quotes`.
- **Update**
  - `GET /author/edit?authorId=...` → load form; `POST /author/edit` → update author.
  - `GET /quote/edit?quoteId=...` → load form; `POST /quote/edit` → update quote.
- **Delete**
  - `GET /author/delete?authorId=...` → delete author.
  - `GET /quote/delete?quoteId=...` → delete quote.

### Utilities & Health
- `GET /allAuthors` — JSON list of authors.
- `GET /dbTest` — DB connectivity via `CURDATE()`.
- `GET /healthz` — `{ ok: true, db: true|false }`.

---

## Security Notes
- **SQL Injection**: All database calls use prepared statements via mysql2/promise, mitigating the risk of SQL injection.
- **Authentication/Authorization**: Admin routes are publicly reachable by default.
- **HTTP methods**: Deletions are currently triggered via `GET`.
- **DB engine**: MyISAM lacks FKs/transactions. Consider **InnoDB** if you need referential integrity and transactional safety.
- **Prepared statements**: All DB calls should use prepared queries (`mysql2/promise`).
- **Secrets Management**: Database credentials are kept out of version control by using a .env file, which is listed in .gitignore.
- **Unsafe Deletes**: All delete operations are handled via GET requests (e.g., /author/delete?authorId=...), which is not best practice. These should be converted to use POST or DELETE methods and be protected with CSRF tokens.