const db = require("../db/queries");

async function createExpenses(req, res) {
    res.send("create expenses");
}

async function getAllExpenses(req, res) {
    res.send("get all expenses");
}

async function getOneExpense(req, res) {
    res.send("get one expense");
}

async function deleteExpense(req, res) {
    res.send("delete expense");
}

module.exports = {
    createExpenses,
    getAllExpenses,
    getOneExpense,
    deleteExpense
};