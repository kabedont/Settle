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

async function getUserById (id) {
    const {rows} = await pool.query(
        "SELECT * FROM users WHERE id = $1", [id]
    );
    return rows;
}

async function insertGroup (name, created_by) {
    await pool.query("INSERT INTO groups(name, created_by, created_at) VALUES ($1, $2, NOW())", [name, created_by]);
}

async function getAllGroups () {
    const {rows} = await pool.query(
        "SELECT * FROM groups"
    );
    return rows;
}

async function getGroupById (id) {
    const {rows} = await pool.query(
        "SELECT * FROM groups WHERE id = $1", [id]
    );
    return rows;
}

async function addMember (user_id, group_id) {
    await pool.query("INSERT INTO members(user_id, group_id) VALUES ($1, $2)", [user_id, group_id]);
}

async function deleteGroup (id) {
    await pool.query("DELETE FROM groups WHERE id = $1", [id]);
}


module.exports = {
    signUpInformation, 
    getUserByEmail, 
    getUserById,
    insertGroup,
    getAllGroups,
    getGroupById,
    addMember,
    deleteGroup
};