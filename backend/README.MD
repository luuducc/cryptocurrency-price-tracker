# Backend API

This is the backend service for the Crypto Price Tracker application. It provides API endpoints to fetch cryptocurrency prices and manage historical data.

## Prerequisites
- Node.js (>= 16.x recommended)
- npm or yarn

## Environment Variables
Create a `.env` file in the root directory by copying .env.sample and replacing the placeholder values with your own:

```
PORT=your_port
API_KEY=your_coin_market_api_here
```

## Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/luuducc/cryptocurrency-price-tracker.git
cd backend
npm install
```

## Running the Server Locally

Start the backend server:

```sh
npm start
```

For development mode with automatic restarts:

```sh
npm run dev
```

## Deployment Guide

### Deploying to a Cloud Server (e.g., AWS, DigitalOcean, etc.)

1. **Set up the environment:**
   - Ensure Node.js and npm are installed on the server.
   - Copy your project files to the server.

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file on the server with the same variables as the local setup.

4. **Run the server in the background using PM2:**
   ```sh
   npm install -g pm2
   pm2 start server.js --name crypto-backend
   pm2 save
   pm2 startup
   ```

5. **Configure a Reverse Proxy (Optional, for production use)**
   - Use Nginx or Apache to forward requests to your Node.js backend.

6. **Monitor and Manage the Application:**
   ```sh
   pm2 logs crypto-backend
   pm2 restart crypto-backend
   ```

## API Endpoints

| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| GET    | `/api/v1/currency-price/:symbol` | Fetch the price of a cryptocurrency |
| GET    | `/api/v1/price-history/:symbol` | Fetch the latest 10 records of history |



## License
This project is licensed under the MIT License.

