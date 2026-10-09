const db = require("../db/queries");
const bcrypt = require("bcryptjs");

async function registerPost(req, res){
    try {
        const {name, email, password} = req.body;
        const password_hash = await bcrypt.hash(req.body.password, 10);
        const user_id = await db.signUpInformation(name, email, password_hash);

        req.logIn({ id: user_id }, (err) => {
            if (err) {
                return res.status(500).json({ message: "login after registration failed" });
            }
            return res.status(201).json({ message: "registered", user: { id: user_id, email, name } });
        });
    } catch (err) {
        res.status(400).json({message: "registration failed", error: err.message});
    }
};

async function registerGet(req, res){
    res.render("register");
}

async function loginGet(req, res){
    res.render("login");
}

async function meGet(req, res) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "cannot get user" });
    else {
        return res.status(200).json({ id: user.id, name: user.name });
    }
}

module.exports = {
    registerGet,
    registerPost,
    loginGet,
    meGet
}