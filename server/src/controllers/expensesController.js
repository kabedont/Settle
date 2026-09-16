const db = require("../db/queries");

async function createExpenses(req, res) { 
    const paid_by = req.user.id;
    const group_id = req.params.id;
    const {amount, currency, description} = req.body;
    await db.insertExpenses(group_id, paid_by, amount, currency, description);
    res.json({message: "expense created"});
}

async function getAllExpenses(req, res) {
    const expenses = await db.getAllExpenses();
    res.json(expenses);
}

async function getOneExpense(req, res) {
    const id = req.params.id;
    const expense = await db.getExpenseById(id);
    res.json(expense[0]);
}

async function deleteExpense(req, res) {
    const id = req.params.id;
    await db.deleteExpense(id);
    res.json({message: "expense deleted"});
}

module.exports = {
    createExpenses,
    getAllExpenses,
    getOneExpense,
    deleteExpense
};