import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? Number(process.env.DB_CONNECTION_LIMIT) : 10,
});

/* ------------------------------
   CSS bundle selection
------------------------------ */
// Default to user CSS
app.use((req, res, next) => {
  res.locals.cssBundle = 'user';
  next();
});
// Helper to switch to admin CSS on admin pages
const useAdminCss = (req, res, next) => { res.locals.cssBundle = 'admin'; next(); };

/* ------------------------------
   Routes
------------------------------ */

// Landing -> uses user.css by default
app.get('/', (req, res) => {
  res.render('app');
});

// ------- User Home (user.css) -------
app.get('/user', async (req, res, next) => {
  try {
    const [authors] = await pool.query(`
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName
    `);
    const [professions] = await pool.query(`
      SELECT DISTINCT profession
      FROM q_authors
      ORDER BY profession
    `);
    const [categories] = await pool.query(`
      SELECT DISTINCT category
      FROM q_quotes
      ORDER BY category
    `);
    res.render('user_index', { authors, professions, categories });
  } catch (err) {
    next(err);
  }
});

/* =========================
   USER SEARCH / API ROUTES
   (keep UNPREFIXED, user.css)
========================= */

app.get("/searchByKeyword", async (req, res, next) => {
  try {
    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE quote LIKE ?
    `;
    const [rows] = await pool.query(sql, [`%${req.query.keyword}%`]);
    res.render("results", { quotes: rows });
  } catch (err) { next(err); }
});

app.get('/searchByAuthor', async (req, res, next) => {
  try {
    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE authorId = ?
    `;
    const [rows] = await pool.query(sql, [req.query.authorId]);
    res.render("results", { quotes: rows });
  } catch (err) { next(err); }
});

app.get("/searchProfession", async (req, res, next) => {
  try {
    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE profession = ?
    `;
    const [rows] = await pool.query(sql, [req.query.profession]);
    res.render("results", { quotes: rows, profession: req.query.profession });
  } catch (err) { next(err); }
});

app.get("/searchByLikes", async (req, res, next) => {
  try {
    const sql = `
      SELECT authorId, likes, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE likes BETWEEN ? AND ?
    `;
    const [rows] = await pool.query(sql, [req.query.minLikes, req.query.maxLikes]);
    res.render("results", { quotes: rows });
  } catch (err) { next(err); }
});

app.get("/searchByCategory", async (req, res, next) => {
  try {
    const sql = `
      SELECT quote, authorId, firstName, lastName, category
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE category = ?
    `;
    const [rows] = await pool.query(sql, [req.query.category]);
    res.render("results", { quotes: rows, category: req.query.category });
  } catch (err) { next(err); }
});

app.get('/api/author/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM q_authors WHERE authorId = ?`, [req.params.id]);
    res.send(rows);
  } catch (err) { next(err); }
});

app.get("/allAuthors", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM q_authors");
    res.send(rows);
  } catch (err) { next(err); }
});

app.get("/dbTest", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT CURDATE()");
    res.send(rows);
  } catch (err) { next(err); }
});

/* =========================
   ADMIN ROUTES (admin.css)
========================= */

// Admin home
app.get('/admin', useAdminCss, (req, res) => {
  res.render('admin_index');
});

app.get("/author/new", useAdminCss, (req, res) => {
  res.render("newAuthor");
});

app.post("/author/new", useAdminCss, async function (req, res, next) {
  try {
    const { fName:firstName, lName:lastName, birthDate:dob, dod, sex, profession, country, portrait, biography } = req.body;
    const sql = `
      INSERT INTO q_authors 
      (firstName, lastName, dob, dod, sex, profession, country, portrait, biography) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [firstName, lastName, dob, dod, sex, profession, country, portrait, biography]);
    res.render("newAuthor", { message: "Author added!" });
  } catch (err) { next(err); }
});

app.get("/authors", useAdminCss, async function (req, res, next) {
  try {
    const [rows] = await pool.query(`SELECT * FROM q_authors ORDER BY lastName`);
    res.render("authorList", { authors: rows });
  } catch (err) { next(err); }
});

app.get("/author/edit", useAdminCss, async function (req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT *,
      DATE_FORMAT(dob, '%y-%m-%d') dobISO
      FROM q_authors
      WHERE authorId = ?
    `, [req.query.authorId]);
    res.render("editAuthor", { authorInfo: rows });
  } catch (err) { next(err); }
});

app.post("/author/edit", useAdminCss, async function (req, res, next) {
  try {
    const { fName:firstName, lName:lastName, birthDate:dob, dod, sex, profession, country, portrait, biography, authorId } = req.body;
    const sql = `
      UPDATE q_authors 
      SET firstName = ?, lastName = ?, dob = ?, dod = ?, sex = ?, profession = ?, country = ?, portrait = ?, biography = ?
      WHERE authorId = ?
    `;
    await pool.query(sql, [firstName, lastName, dob, dod, sex, profession, country, portrait, biography, authorId]);
    res.redirect("/authors");
  } catch (err) { next(err); }
});

app.get("/author/delete", useAdminCss, async function (req, res, next) {
  try {
    await pool.query(`DELETE FROM q_authors WHERE authorId = ?`, [req.query.authorId]);
    res.redirect("/authors");
  } catch (err) { next(err); }
});

app.get("/quotes", useAdminCss, async function(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT q_quotes.*, CONCAT(firstName, ' ', lastName) AS authorName
      FROM q_quotes
      NATURAL JOIN q_authors
      ORDER BY quoteId
    `);
    res.render("quoteList", { quotes: rows });
  } catch (err) { next(err); }
});

app.get("/quote/edit", useAdminCss, async function(req, res, next) {
  try {
    const [rows] = await pool.query(`SELECT * FROM q_quotes WHERE quoteId = ?`, [req.query.quoteId]);
    const [authors] = await pool.query(`
      SELECT authorId, CONCAT(firstName, ' ', lastName) AS name
      FROM q_authors ORDER BY lastName
    `);
    res.render("editQuote", { quoteInfo: rows[0], authors });
  } catch (err) { next(err); }
});

app.post("/quote/edit", useAdminCss, async function(req, res, next) {
  try {
    const sql = `
      UPDATE q_quotes
      SET quote = ?, authorId = ?, category = ?, likes = ?
      WHERE quoteId = ?
    `;
    const params = [req.body.quote, req.body.authorId, req.body.category, req.body.likes, req.body.quoteId];
    await pool.query(sql, params);
    res.redirect("/quotes");
  } catch (err) { next(err); }
});

app.get("/quote/delete", useAdminCss, async function(req, res, next) {
  try {
    await pool.query(`DELETE FROM q_quotes WHERE quoteId = ?`, [req.query.quoteId]);
    res.redirect("/quotes");
  } catch (err) { next(err); }
});

app.get("/quote/new", useAdminCss, async function(req, res, next) {
  try {
    const [authors] = await pool.query(`
      SELECT authorId, CONCAT(firstName, ' ', lastName) AS name
      FROM q_authors ORDER BY lastName
    `);
    res.render("newQuote", { authors });
  } catch (err) { next(err); }
});

app.post("/quote/new", useAdminCss, async function(req, res, next) {
  try {
    const sql = `
      INSERT INTO q_quotes (quote, authorId, category, likes)
      VALUES (?, ?, ?, ?)
    `;
    const params = [req.body.quote, req.body.authorId, req.body.category, req.body.likes || 0];
    await pool.query(sql, params);
    res.render("newQuote", { authors: [], message: "Quote added!" });
  } catch (err) { next(err); }
});

// health
app.get('/healthz', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(3000, ()=>{
    console.log("Express server running")
})