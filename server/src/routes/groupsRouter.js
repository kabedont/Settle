const {Router} = require("express");
const groupsRouter = Router();
const groupsController = require("../controllers/groupsController");
const expensesController = require("../controllers/expensesController");
const settlementsController = require("../controllers/settlementsController");
const {isAuthenticated, isGroupMember} = require("../middleware/auth");

groupsRouter.post("/", isAuthenticated, groupsController.createGroups);
groupsRouter.get("/", isAuthenticated, groupsController.getAllGroups);

groupsRouter.get("/:id", isAuthenticated, isGroupMember, groupsController.getOneGroup);
groupsRouter.delete("/:id", isAuthenticated, isGroupMember, groupsController.deleteGroup);
groupsRouter.post("/:id/members", isAuthenticated, isGroupMember, groupsController.addMember);
groupsRouter.get("/:id/members", isAuthenticated, isGroupMember, groupsController.getMember);
groupsRouter.post("/:id/expenses", isAuthenticated, isGroupMember, expensesController.createExpenses);
groupsRouter.get("/:id/expenses", isAuthenticated, isGroupMember, expensesController.getExpensesByGroupId);
groupsRouter.delete("/:id/expenses/:expenseId", isAuthenticated, isGroupMember, expensesController.deleteExpense);
groupsRouter.get("/:id/balances", isAuthenticated, isGroupMember, groupsController.getBalancesByGroupId);
groupsRouter.get("/:id/pairwise-balances", isAuthenticated, isGroupMember, groupsController.getPairwiseBalancesByGroupId);
groupsRouter.post("/:id/settlements", isAuthenticated, isGroupMember, settlementsController.createSettlement);

module.exports = groupsRouter;