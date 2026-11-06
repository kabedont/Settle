const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });
const { Pool } = require("pg");

module.exports = new Pool({
    connectionString: process.env.DATABASE_URL
});