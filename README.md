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