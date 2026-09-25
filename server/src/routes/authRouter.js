const {Router} = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const passport = require("passport");

authRouter.get("/sign-up", authController.registerGet);
authRouter.post("/sign-up", authController.registerPost);
authRouter.get("/log-in", authController.loginGet);
authRouter.post("/log-in", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "invalid email or password" });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: "logged in", user: { id: user.id, email: user.email, name: user.name } });
        });
    })(req, res, next);
});

module.exports = authRouter;