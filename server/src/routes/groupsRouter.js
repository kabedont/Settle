const {Router} = require("express");
const groupsRouter = Router();
const groupsController = require("../controllers/groupsController");
const expensesController = require("../controllers/expensesController");
const isAuthenticated = require("../middleware/auth");

groupsRouter.post("/", isAuthenticated, groupsController.createGroups);
groupsRouter.get("/", isAuthenticated, groupsController.getAllGroups);
groupsRouter.get("/:id", isAuthenticated, groupsController.getOneGroup);
groupsRouter.post("/:id/members", isAuthenticated, groupsController.addMember);
groupsRouter.delete("/:id", isAuthenticated, groupsController.deleteGroup);
groupsRouter.post("/:id/expenses", isAuthenticated, expensesController.createExpenses);

module.exports = groupsRouter;