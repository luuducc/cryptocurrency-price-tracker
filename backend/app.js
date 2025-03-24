const { default: axios } = require('axios');
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');
const asyncWrapper = require('./middleware/async-wrapper')
require('dotenv').config();

// create database
database.exec(`
  CREATE TABLE price_history(
    symbol TEXT,
    price TEXT,
    timestamp TEXT
  ) STRICT
`);

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.get('/', (req, res) => {
  res.json({ mgs: 'hello' });
})

// Get current price
app.get('/api/v1/currency-price/:symbol', asyncWrapper(async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.API_KEY;

  // Fetch the current price from CoinMarketAPI
  const response = await axios.get(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
    params: { symbol }, // Pass the symbol parameter to the CoinMarketCap API
    headers: {
      'X-CMC_PRO_API_KEY': apiKey, // Authorization header with API key
      'Accept': 'application/json', // Accept header to specify response format
    }
  });

  const cryptoData = response.data.data;

  if (!cryptoData) 
    return res.status(404).json({ msg: `Cryptocurrency with symbol ${symbol} not found`});

  const currencyId = Object.keys(cryptoData)[0];
  const { price, last_updated } = cryptoData[currencyId].quote.USD;
  const { name } = cryptoData[currencyId]
  const timestamp = new Date().toISOString();

  // Return result to the client
  res.json({ name, price, last_updated, timestamp });

  // Store record in database
  const insert = database.prepare(
    'INSERT INTO price_history (symbol, price, timestamp) VALUES (?,?,?)'
  );
  insert.run(symbol, price, timestamp)
}));

// Get price history
app.get('/api/v1/price-history/:symbol', asyncWrapper((req, res) => {
  const { symbol } = req.params;
  const query = database.prepare(
    `SELECT price, timestamp FROM price_history WHERE symbol = ? 
      ORDER BY timestamp LIMIT 10`
  );
  res.status(200).json({ query: query.all(symbol) });
}))

app.post('*', (req, res) => {})
app.get('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port} ...`);
});
