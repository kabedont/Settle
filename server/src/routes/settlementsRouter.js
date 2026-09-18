const {Router} = require("express");
const settlementsRouter = Router();
const settlementsController = require("../controllers/settlementsController");
const isAuthenticated = require("../middleware/auth");

settlementsRouter.post("/", isAuthenticated, settlementsController.createSettlement);
settlementsRouter.get("/", isAuthenticated, settlementsController.getAllSettlements);

module.exports = settlementsRouter;