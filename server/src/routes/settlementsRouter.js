const {Router} = require("express");
const settlementsRouter = Router();
const settlementsController = require("../controllers/settlementsController");

settlementsRouter.post("/", settlementsController.createSettlement);
settlementsRouter.get("/", settlementsController.getAllSettlements);

module.exports = settlementsRouter;