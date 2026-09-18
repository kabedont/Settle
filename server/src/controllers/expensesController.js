const db = require("../db/queries");

async function createExpenses(req, res) { 
    const paid_by = req.user.id;
    const group_id = req.params.id;
    const {amount, currency, description} = req.body;
    const expense_id = await db.insertExpenses(group_id, paid_by, amount, currency, description);
    const members = await db.getMembersByGroupId(group_id);
    const share = amount / members.length;
    for (const member of members) {
        await db.insertExpenseSplits(expense_id, member.user_id, share);
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