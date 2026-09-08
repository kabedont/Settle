const {Client} = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(30),
    email VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(30),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    group_id INTEGER REFERENCES groups(id),
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    group_id INTEGER REFERENCES groups(id),
    paid_by INTEGER REFERENCES users(id), 
    amount DECIMAL,
    currency VARCHAR(30),
    description VARCHAR(255),
    date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expense_splits (
    expenses_id INTEGER REFERENCES expenses(id),
    user_id INTEGER REFERENCES users(id),
    amount_owed DECIMAL
);

CREATE TABLE IF NOT EXISTS settlements (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    group_id INTEGER REFERENCES groups(id),
    from_user INTEGER REFERENCES users(id), 
    to_user INTEGER REFERENCES users(id), 
    amount DECIMAL,
    currency VARCHAR(30),
    paid_at TIMESTAMP
);
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString:"postgresql://postgres:postgres@localhost:5432/settle"
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();