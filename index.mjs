import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using POST method
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
const conn = await pool.getConnection();

//routes
app.get('/', async (req, res) => {
    let sql = `
        SELECT authorId, firstName, lastName
        FROM q_authors
        ORDER BY lastName
    `;
    let sqlp = `
        SELECT profession
        FROM q_authors
        ORDER BY profession
    `;
    let sqlc = `
        SELECT DISTINCT category
        FROM q_quotes
        ORDER BY category
    `;
    const [rows] = await conn.query(sql);
    const [professions] = await conn.query(sqlp);
    const [categories] = await conn.query(sqlc);
    res.render('index', {"authors":rows, "professions":professions, "categories":categories});
});

app.get("/searchByKeyword", async(req, res) => {
    let keyword = req.query.keyword;
    let sql = `
        SELECT authorId, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE quote LIKE ?
    `;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await conn.query(sql, sqlParams);
    // console.log(rows);
    res.render("results", {"quotes":rows});
});

app.get('/searchByAuthor', async(req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `
        SELECT authorId, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE authorId = ?
    `;
    let sqlParams = [userAuthorId];
    const [rows] = await conn.query(sql, sqlParams);
    // console.log(rows);
    res.render("results", {"quotes":rows});
});

app.get("/searchProfession", async (req, res) => {
    let profession = req.query.profession;
    let sql = `
        SELECT authorId, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE profession = ?
    `;
    let sqlParams = [profession];
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results", { "quotes": rows, profession });
});

app.get("/searchByLikes", async function(req, res) {
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;
    let sql = `
        SELECT authorId, likes, firstName, lastName, quote
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE likes BETWEEN ? AND ?
    `;
    let sqlParams = [minLikes, maxLikes];
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results", { "quotes": rows });
});

app.get("/searchByCategory", async (req, res) => {
    let category = req.query.category;
    let sql = `
        SELECT quote, authorId, firstName, lastName, category
        FROM q_quotes
        NATURAL JOIN q_authors
        WHERE category = ?
    `;
    let sqlParams = [category];
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results", { "quotes": rows, "category": category });
});

app.get('/api/author/:id', async(req, res) => {
    let authorId = req.params.id;
    let sql = `
        SELECT *
        FROM q_authors
        WHERE authorId = ?
    `;
    const [rows] = await conn.query(sql, [authorId]);
    // console.log(rows);
    res.send(rows);
;})

app.get("/allAuthors", async(req, res) => {
    let sql = "SELECT * FROM q_authors";
    const [rows] = await conn.query(sql);
    res.send(rows);
});

app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})