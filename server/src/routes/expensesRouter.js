const {Router} = require("express");
const expensesRouter = Router();
const expensesController = require("../controllers/expensesController");

expensesRouter.post("/", expensesController.createExpenses);
expensesRouter.get("/", expensesController.getAllExpenses);
expensesRouter.get("/:id", expensesController.getOneExpense);
expensesRouter.delete("/:id", expensesController.deleteExpense);

module.exports = expensesRouter;