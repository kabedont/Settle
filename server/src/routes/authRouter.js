const {Router} = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const passport = require("passport");

authRouter.get("/sign-up", authController.registerGet);
authRouter.post("/sign-up", authController.registerPost);
authRouter.get("/log-in", authController.loginGet);
authRouter.post("/log-in", passport.authenticate("local", {
    successRedirect: "/homepage",
    failureRedirect: "/log-in",
    failureMessage: true,
}));

module.exports = authRouter;