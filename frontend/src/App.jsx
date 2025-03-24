import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './App.css';

const baseUrl = 'http://localhost:3000/api/v1';

function App() {
  const [symbol, setSymbol] = useState('');
  const [serverResponse, setServerResponse] = useState({});
  const [history, setHistory] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({});
  const [error, setError] = useState('');

  const fetchPrice = async () => {
    setError('');
    try {
      const response = await axios.get(`${baseUrl}/currency-price/${symbol}`);
      console.log('price', response.data);
      const { name, price, last_updated, timestamp } = response.data;
      setServerResponse({ name, price, last_updated, timestamp });
      setCurrentRecord({ name, price, timestamp });
    } catch (err) {
      console.log('err', err);
      setError(err.response?.data?.error || 'Something went wrong');
      setServerResponse({});
    }
  };
  const fetchHistory = async () => {
    try {
      const result = await axios.get(`${baseUrl}/price-history/${symbol}`)
      const priceHistory = result.data.query
      setHistory(priceHistory)
      console.log('result', priceHistory)
    } catch (err) {
      console.log('err', err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symbol) {
      await fetchPrice();
      fetchHistory();
    }
  };

  return (
    <div className="App">
      <h1>Crypto Price Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter crypto symbol (e.g., bitcoin, ethereum)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button type="submit">Get Price</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {serverResponse.name && (
        <div style={{ textAlign: 'left' }}>
          <h3>Name: {serverResponse.name}</h3>
          <h3>Current price: ${serverResponse.price}</h3>
          <h3>Last updated time: {serverResponse.last_updated}</h3>
          <h3>Timestamp: {serverResponse.timestamp}</h3>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3>Price History</h3>
          <LineChart width={500} height={300} data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </div>
      )}
    </div>
  );
}

export default App;
