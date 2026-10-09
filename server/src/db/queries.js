const pool = require("./pool");

//USERS
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

//GROUPS
async function insertGroup (name, created_by) {
    const {rows} = await pool.query("INSERT INTO groups(name, created_by, created_at) VALUES ($1, $2, NOW()) RETURNING id", [name, created_by]);
    return rows[0].id;
}

async function getAllGroups (user_id) {
    const {rows} = await pool.query(
        `SELECT groups.* FROM groups
        JOIN members ON groups.id= members.group_id
        WHERE user_id = $1`, [user_id]
    );
    return rows;
}

async function getGroupById (id) {
    const {rows} = await pool.query(
        `SELECT groups.name, groups.created_at, users.name AS creator_name
        FROM groups
        JOIN users ON groups.created_by = users.id
        WHERE groups.id = $1`, [id]
    );
    return rows;
}

async function addMember (user_id, group_id) {
    await pool.query("INSERT INTO members(user_id, group_id) VALUES ($1, $2)", [user_id, group_id]);
}

async function deleteGroup (id) {
    await pool.query("DELETE FROM groups WHERE id = $1", [id]);
}


//EXPENSES
async function insertExpenses (group_id, paid_by, amount, currency, description){
    const {rows} = await pool.query("INSERT INTO expenses(group_id, paid_by, amount, currency, description, date) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id", [group_id, paid_by, amount, currency, description]);
    return rows[0].id;
}

async function getAllExpenses () {
    const {rows} = await pool.query (
        "SELECT * FROM expenses"
    );
    return rows;
}

async function getExpenseById (id) {
    const {rows} = await pool.query (
        "SELECT * FROM expenses WHERE id = $1", [id]
    );
    return rows;
}

async function getExpensesByGroupId(group_id) {
    const {rows} = await pool.query (
        `SELECT expenses.*, users.name AS payer_name 
        FROM expenses 
        JOIN users ON expenses.paid_by = users.id
        WHERE group_id = $1`, [group_id]    
    );
    return rows;
}

async function deleteExpense (id) {
    await pool.query ("DELETE FROM expenses WHERE id=$1", [id]);
}

//MEMBERS (FOR EXPENSE SPLITS)
async function getMembersByGroupId (group_id) {
    const {rows} = await pool.query (
        `SELECT users.id, users.name FROM members 
        JOIN users ON members.user_id = users.id 
        WHERE group_id = $1`, [group_id]
    );
    return rows;
}

//EXPENSE SPLITS
async function insertExpenseSplits (expenses_id, user_id, amount_owed) {
    await pool.query ("INSERT INTO expense_splits(expenses_id, user_id, amount_owed) VALUES ($1, $2, $3)", [expenses_id, user_id, amount_owed]);
}

//SETTLEMENTS
async function insertSettlements (group_id, from_user, to_user, amount, currency){
    await pool.query("INSERT INTO settlements(group_id, from_user, to_user, amount, currency, paid_at) VALUES ($1, $2, $3, $4, $5, NOW())", [group_id, from_user, to_user, amount, currency]);
}

async function getAllSettlements () {
    const {rows} = await pool.query (
        "SELECT * FROM settlements"
    );
    return rows;
}

//THE NITTY GRITTY CALCULATIONS
async function getTotalPaidByGroupId (group_id) {
    const {rows} = await pool.query (
        `SELECT users.id, users.name, SUM(expenses.amount) AS total_paid
        FROM expenses
        JOIN users on expenses.paid_by = users.id
        WHERE group_id = $1
        GROUP BY users.id`, [group_id]
    );
    return rows;
}

async function getTotalOwedByGroupId (group_id) {
    const {rows} = await pool.query (
        `SELECT users.id, users.name, SUM(expense_splits.amount_owed) AS total_owed
        FROM expense_splits
        JOIN users on expense_splits.user_id = users.id
        JOIN expenses on expense_splits.expenses_id = expenses.id 
        WHERE group_id = $1
        GROUP BY users.id`, [group_id]
    );
    return rows;
}

async function getRawDebtsByGroupId (group_id) {
    const {rows} = await pool.query (
        `SELECT expense_splits.user_id AS debtor_id,
                expenses.paid_by AS creditor_id,
                SUM(expense_splits.amount_owed) AS total_owed
        FROM expense_splits
        JOIN expenses on expense_splits.expenses_id = expenses.id
        WHERE expenses.group_id = $1 
          AND expense_splits.user_id != expenses.paid_by
        GROUP BY expense_splits.user_id, expenses.paid_by
        `, [group_id]
    );
    return rows;
}


module.exports = {
    signUpInformation, 
    getUserByEmail, 
    getUserById,
    insertGroup,
    getAllGroups,
    getGroupById,
    addMember,
    deleteGroup,
    insertExpenses,
    getAllExpenses,
    getExpenseById,
    getExpensesByGroupId,
    deleteExpense,
    getMembersByGroupId,
    insertExpenseSplits,
    insertSettlements,
    getAllSettlements,
    getTotalPaidByGroupId,
    getTotalOwedByGroupId,
    getRawDebtsByGroupId
};