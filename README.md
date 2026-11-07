# Settle ⚖️

Split bills with friends without doing the maths yourself. Add an expense, and Settle works out who owes whom.

## Features

- **Accounts:** register and log in with session-based auth
- **Groups:** create groups and add friends by email; only members can see or change a group
- **Expense tracking:** log shared expenses, split evenly across the group
- **Multi-currency:** balances are kept separate per currency, with no exchange-rate guessing
- **Automatic balances:** your net balance, plus a who-owes-who breakdown that nets out debts between each pair
- **Settle up:** record full or partial payments, and balances update right away

## Tech stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** Passport (local strategy), express-session, bcryptjs password hashing

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [PostgreSQL](https://www.postgresql.org/) running locally

### 1. Clone the repo

```bash
git clone https://github.com/kabedont/Settle.git
cd Settle
```

### 2. Set up the database

Create an empty database called `settle`:

```bash
psql -U postgres -c "CREATE DATABASE settle;"
```

### 3. Set up the server

```bash
cd server
npm install
```

Create your `.env` file from the template:

- macOS / Linux: `cp .env.example .env`
- Windows (PowerShell): `Copy-Item .env.example .env`

Then open `.env` and fill in your values:

```
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/settle
SESSION_SECRET=replace-with-a-long-random-string
```

Replace `USER` and `PASSWORD` with your Postgres login. To generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create the tables

**Run this before starting the server for the first time**, from the `server` folder:

```bash
node src/db/populatedb.js
```

You should see `seeding...` then `done`.

### 5. Start the server

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

### 6. Start the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`, register an account, and create your first group.

> The client expects the API at `localhost:5000`, and the server only accepts requests from `localhost:5173`. If you change either port, update the fetch URLs and the CORS setting.
