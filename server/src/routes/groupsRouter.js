const {Router} = require("express");
const groupsRouter = Router();
const groupsController = require("../controllers/groupsController");

groupsRouter.post("/", groupsController.createGroups);
groupsRouter.get("/", groupsController.getAllGroups);
groupsRouter.get("/:id", groupsController.getOneGroup);
groupsRouter.post("/:id/members", groupsController.addMember);
groupsRouter.delete("/:id", groupsController.deleteGroup);

module.exports = groupsRouter;