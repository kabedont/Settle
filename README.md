# Settle ⚖️

Split bills with friends without doing the maths yourself. Add an expense, and Settle works out who owes whom.

**Live demo:** https://jenn-settle.vercel.app

> **Demo login:** `jenn@settle.demo` / `hello123demo`
> This is a shared account, so the data may be reset at any time. The first load after a quiet period can take a few seconds while the server and database wake up.

![Group page with balances, members and expenses](docs/screenshots/group-detail.png)

## Features

- **Accounts:** register and log in with session-based auth
- **Groups:** create groups and add friends by email; only members can see or change a group
- **Expense tracking:** log shared expenses, split evenly across the group
- **Multi-currency:** balances are kept separate per currency, with no exchange-rate guessing
- **Automatic balances:** your net balance, plus a who-owes-who breakdown that nets out debts between each pair
- **Settle up:** record full or partial payments, and balances update right away
- **Housekeeping:** delete an expense or a whole group, with a confirmation first

## Screenshots

| Home | Add an expense |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Add expense](docs/screenshots/add-expense.png) |

| Settle up | Delete on hover |
|---|---|
| ![Settle up](docs/screenshots/settle-up.png) | ![Delete on hover](docs/screenshots/delete-hover.gif) |

<img src="docs/screenshots/mobile.jpg" alt="Group page on a phone" width="300">

## Tech stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (hosted on Neon)
- **Auth:** Passport (local strategy), express-session with a Postgres session store, bcryptjs password hashing
- **Hosting:** Vercel (a client project and a separate API project; the client proxies `/api` to the API so the session cookie stays first-party)

## Design decisions

- **Balances stay in their own currency.** Converting would add an exchange-rate dependency and a number that shifts over time, and friends on a trip usually settle each currency separately anyway.
- **Who-owes-who is netted per pair.** Debts between two people combine into one signed number per currency, then settlements reduce it, so you see one clear amount instead of a pile of expenses.
- **Access control lives in middleware.** One `isGroupMember` check runs before every group route, so a logged-in user can't touch a group they don't belong to.

## Running it locally

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

## How I used AI

I built Settle with Claude as a tutor and pair programmer. I designed the data model and wrote most of the queries, routes, controllers and React pages myself, working through bugs with guided hints. I used Claude directly for the parts I got stuck on: the pairwise netting logic, the per-currency balance totals, and the Vercel and Neon deployment setup. I read the code, typed it in, tested it, and debugged the result, including a few bugs the AI-suggested code introduced.