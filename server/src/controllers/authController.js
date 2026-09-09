const db = require("../db/queries");
const bcrypt = require("bcryptjs");

async function registerPost(req, res){
    const {name, email, password} = req.body;
    const password_hash = await bcrypt.hash(req.body.password, 10);
    await db.signUpInformation (name, email, password_hash);
    res.redirect("/");
};

async function registerGet(req, res){
    res.render("register");
}

async function loginPost(req, res){
    const {email, password} = req.body;
    const rows = await db.getUserByEmail(email);
    const user = rows[0];
    if (!user) {
        return res.status(401).send("Incorrect email");
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        return res.status(401).send("Incorrect password");
    }
    res.redirect("/homepage");
}

async function loginGet(req, res){
    res.render("login");
}

module.exports = {
    registerGet,
    registerPost,
    loginGet,
    loginPost
}