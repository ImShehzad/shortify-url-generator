require('dotenv').config(); 

const express = require("express");
const { nanoid } = require('nanoid');
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db");
const BASE_URL = process.env.BASE_URL;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      long_url VARCHAR NOT NULL,
      short_id VARCHAR UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ Table 'urls' created successfully.");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
};

createTable();

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) return res.status(400).json({ error: 'Long URL required' });

  try {
    const existing = await pool.query('SELECT short_id FROM urls WHERE long_url = $1', [longUrl]);
    console.log(existing);
    if (existing.rows.length > 0) {
      const shortUrl = `${BASE_URL}/${existing.rows[0].short_id}`;
      return res.json({ shortUrl });
    }

    let shortId = nanoid(6);
    let exists = await pool.query('SELECT 1 FROM urls WHERE short_id = $1', [shortId]);
    while (exists.rowCount > 0) {
      shortId = nanoid(6);
      exists = await pool.query('SELECT 1 FROM urls WHERE short_id = $1', [shortId]);
    }

    await pool.query(
      'INSERT INTO urls (long_url, short_id) VALUES ($1, $2)',
      [longUrl, shortId]
    );

    const shortUrl = `${BASE_URL}/${shortId}`;
    res.json({ shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM urls WHERE short_id = $1', [shortId]);
    if (result.rows.length === 0) {
      return res.status(404).send('URL not found');
    }

    const longUrl = result.rows[0].long_url;
    return res.redirect(longUrl); // <-- Redirect to the original long URL
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});


app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
