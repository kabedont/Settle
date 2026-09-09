const {Router} = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");

authRouter.get("/sign-up", authController.registerGet);
authRouter.post("/sign-up", authController.registerPost);
authRouter.get("/log-in", authController.loginGet);
authRouter.post("/log-in", authController.loginPost);

module.exports = authRouter;