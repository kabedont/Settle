const pool = require("./pool");

async function signUpInformation (name, email, password_hash) {
    await pool.query("INSERT INTO users(name, email, password_hash, created_at) VALUES ($1, $2, $3, NOW())", [name, email, password_hash]);
}

async function getUserByEmail (email) {
    const {rows} = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return rows;
}

module.exports = {signUpInformation, getUserByEmail};