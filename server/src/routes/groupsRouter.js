const {Router} = require("express");
const groupsRouter = Router();
const groupsController = require("../controllers/groupsController");
const expensesController = require("../controllers/expensesController");

groupsRouter.post("/", groupsController.createGroups);
groupsRouter.get("/", groupsController.getAllGroups);
groupsRouter.get("/:id", groupsController.getOneGroup);
groupsRouter.post("/:id/members", groupsController.addMember);
groupsRouter.delete("/:id", groupsController.deleteGroup);
groupsRouter.post("/:id/expenses", expensesController.createExpenses);

module.exports = groupsRouter;