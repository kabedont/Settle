const {Router} = require("express");
const expensesRouter = Router();
const expensesController = require("../controllers/expensesController");
const isAuthenticated = require("../middleware/auth");

expensesRouter.post("/", isAuthenticated, expensesController.createExpenses);
expensesRouter.get("/", isAuthenticated, expensesController.getAllExpenses);
expensesRouter.get("/:id", isAuthenticated, expensesController.getOneExpense);
expensesRouter.delete("/:id", isAuthenticated, expensesController.deleteExpense);

module.exports = expensesRouter;