import dotenv from 'dotenv';
dotenv.config();
import express from 'express'; 
import fetch from 'node-fetch';

const planets = (await import('npm-solarsystem')).default; 

const app = express(); 
app.set("view engine", "ejs"); 
app.use(express.static("public")); 

app.get('/', async(req, res) => { 
    let url = `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&featured=true&query=solar-system`;
    let response = await fetch(url);
    let data = await response.json();
    let randomImage = data.urls.full;
    res.render("index", {randomImage}); 
});

async function getPlanetImage(name) {
  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(name)}&media_type=image`;
    const response = await fetch(url);
    const data = await response.json();
    const first = data?.collection?.items?.[0];
    return first?.links?.[0]?.href || null;
  } catch (err) {
    console.error(`Image fetch failed for ${name}:`, err);
    return null;
  }
}

app.get('/mercury', async (req, res) => {
  let planetMercury = planets.getMercury();
  planetMercury.image = await getPlanetImage("mercury") || planetMercury.image;
  res.render("mercury", {planetMercury});
});

app.get('/venus', async (req, res) => {
  let planetVenus = planets.getVenus();
  planetVenus.image = await getPlanetImage("venus") || planetVenus.image;
  res.render("venus", {planetVenus});
});

app.get('/earth', async (req, res) => {
  let planetEarth = planets.getEarth();
  planetEarth.image = await getPlanetImage("earth") || planetEarth.image;
  res.render("earth", {planetEarth});
});

app.get('/mars', async (req, res) => {
  let planetMars = planets.getMars();
  planetMars.image = await getPlanetImage("mars") || planetMars.image;
  res.render("mars", {planetMars});
});

app.get('/jupiter', async (req, res) => {
  let planetJupiter = planets.getJupiter();
  planetJupiter.image = await getPlanetImage("jupiter") || planetJupiter.image;
  res.render("jupiter", {planetJupiter});
});

app.get('/saturn', async (req, res) => {
  let planetSaturn = planets.getSaturn();
  planetSaturn.image = await getPlanetImage("saturn") || planetSaturn.image;
  res.render("saturn", {planetSaturn});
});

app.get('/uranus', async (req, res) => {
  let planetUranus = planets.getUranus();
  planetUranus.image = await getPlanetImage("uranus") || planetUranus.image;
  res.render("uranus", {planetUranus});
});

app.get('/neptune', async (req, res) => {
  let planetNeptune = planets.getNeptune();
  planetNeptune.image = await getPlanetImage("neptune") || planetNeptune.image;
  res.render("neptune", {planetNeptune});
});

app.get('/pluto', async (req, res) => {
  let planetPluto = planets.getPluto();
  planetPluto.image = await getPlanetImage("pluto") || planetPluto.image;
  res.render("pluto", {planetPluto});
});

app.get('/picOfDay', async(req, res) => {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
    let response = await fetch(url);
    let data = await response.json();
    let picOD = data.url;
    console.log(data);
    res.render("picOfDay", {picOD, data}); 
});

app.listen(3000, () => { 
console.log('server started'); 
});