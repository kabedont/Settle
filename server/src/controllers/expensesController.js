const db = require("../db/queries");

async function createExpenses(req, res) { 
    const paid_by = req.user.id;
    const group_id = req.params.id;
    const {amount, currency, description} = req.body;
    if (amount === undefined || amount === "" || description.length === 0 || currency.length === 0) {
        return res.status(400).json({message: "Cannot leave field empty"});
    }
    if (amount <= 0) {
        return res.status(400).json({message: "Amount must be greater than 0"})
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
    try {
        const group_id = req.params.id;
        const id = req.params.expenseId;
        const deletedCount = await db.deleteExpense(id, group_id);
        if (deletedCount === 0) {
            return res.status(404).json({message: "Nothing was deleted"});
        }
        res.json({message: "expense deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = {
    createExpenses,
    getAllExpenses,
    getOneExpense,
    getExpensesByGroupId,
    deleteExpense
};