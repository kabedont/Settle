const db = require("../db/queries");

async function createExpenses(req, res) { 
    const paid_by = req.user.id;
    const group_id = req.params.id;
    const {amount, currency, description} = req.body;
    if (amount === undefined || amount === "" || description.length === 0 || currency.length === 0) {
        return res.status(400).json({message: "cannot leave field empty"});
    }
    const expense_id = await db.insertExpenses(group_id, paid_by, amount, currency, description);
    const members = await db.getMembersByGroupId(group_id);
    const share = amount / members.length;
    for (const member of members) {
        await db.insertExpenseSplits(expense_id, member.id, share);
    }
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

async function getExpensesByGroupId(req, res) {
    const group_id = req.params.id;
    const expenses = await db.getExpensesByGroupId(group_id);
    res.json(expenses);
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
    getExpensesByGroupId,
    deleteExpense
};