import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';
import MarkdownIt from 'markdown-it';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('index');
});

app.get('/algorithms', (req, res) => {
    res.render('algorithms');
});

app.get('/evaluation', (req, res) => {
    res.render('evaluation');
});

app.get('/future', (req, res) => {
    res.render('future');
});

app.get('/ai', async (req, res) => {
    const ai = new GoogleGenAI({
        apiKey: `${process.env.GOOGLE_API_KEY}`
    });

    const topic = req.query.topic;

    if (!topic) {
        return res.render('ai', { response: null, topic: '' });
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: `Explain the topic in 200 words and provide a few links on the web for further research: ${topic}` }] }]
        });

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

        const md = new MarkdownIt();
        const html = md.render(text);

        res.render('ai', { response: html, topic });

    } catch (err) {
        console.error("Gemini API error:", err?.status ?? "", err?.message ?? "", err);
        res.status(502).render("ai", { response: "Error generating content.", topic });
    }
});

app.listen(3000, () => {
    console.log('server started');
});