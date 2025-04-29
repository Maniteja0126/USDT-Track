# USDT Event Tracker API (Starknet)

A REST API that fetches and serves on-chain Transfer events for the USDT token on Starknet.

## Features

- Real-time event tracking from Starknet USDT contract
- PostgreSQL database storage
- Redis caching for transaction lookups
- Paginated event retrieval
- Filtering by addresses
- Transaction hash lookup

## Tech Stack

- TypeScript
- Express.js
- Prisma (PostgreSQL)
- Redis
- Starknet.js

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- Starknet RPC endpoint

## Installation

1. Clone the repository:
```bash
git clone git@github.com:Maniteja0126/USDT-Track.git
cd USDT-Track
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/usdt_events"
REDIS_URL="redis://localhost:6379"
PORT=3000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the application:
```bash
npm run dev
```

## API Endpoints

### 1. Get Paginated Events

Returns a paginated list of all events.

**Endpoint:** `GET /events`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Example Request:**
```bash
GET /events?page=1&limit=10
```

**Example Response:**
```json
{
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": "clg2l6dbm00q2mtnw0hz64hw0",
      "from": "0x7aaeb03fb315ec7a886cab2be5c60a4eab5992530e69b937173156105b9b409",
      "to": "0x4270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f",
      "value": "0x870088e",
      "tx_hash": "0x7bbd325b27f181fc3f20190037bba8554158242fd626614c244e4895886a006",
      "timestamp": "2025-04-29T14:12:12.618Z"
    }
    // ... more events
  ]
}
```

### 2. Filter Events by Addresses

Returns events filtered by from and/or to addresses.

**Endpoint:** `GET /events/filter`

**Query Parameters:**
- `from` (optional): Sender address
- `to` (optional): Recipient address

**Example Request:**
```bash
GET /events/filter?from=0x7aaeb03fb315ec7a886cab2be5c60a4eab5992530e69b937173156105b9b409
```

**Example Response:**
```json
[
  {
    "id": "clg2l6dbm00q2mtnw0hz64hw0",
    "from": "0x7aaeb03fb315ec7a886cab2be5c60a4eab5992530e69b937173156105b9b409",
    "to": "0x4270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f",
    "value": "0x870088e",
    "tx_hash": "0x7bbd325b27f181fc3f20190037bba8554158242fd626614c244e4895886a006",
    "timestamp": "2025-04-29T14:12:12.618Z"
  }
]
```

### 3. Get Event by Transaction Hash

Returns the event associated with a specific transaction hash.

**Endpoint:** `GET /events/:tx_hash`

**Example Request:**
```bash
GET /events/0x7bbd325b27f181fc3f20190037bba8554158242fd626614c244e4895886a006
```

**Example Response:**
```json
{
  "id": "clg2l6dbm00q2mtnw0hz64hw0",
  "from": "0x7aaeb03fb315ec7a886cab2be5c60a4eab5992530e69b937173156105b9b409",
  "to": "0x4270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f",
  "value": "0x870088e",
  "tx_hash": "0x7bbd325b27f181fc3f20190037bba8554158242fd626614c244e4895886a006",
  "timestamp": "2025-04-29T14:12:12.618Z"
}
```

## Event Data Structure

```typescript
interface TransferEvent {
  id: string;
  from: string;
  to: string;
  value: string;
  tx_hash: string;
  timestamp: Date;
}
```

## Real-time Syncing

The application polls for new events every 10 seconds. The polling process:
1. Fetches the latest block number
2. Queries the last 100 blocks for Transfer events
3. Saves new events to the database
4. Updates Redis cache for transaction lookups

