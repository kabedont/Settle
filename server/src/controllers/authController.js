const db = require("../db/queries");
const bcrypt = require("bcryptjs");

async function registerPost(req, res){
    try {
        const {name, email, password} = req.body;
        const password_hash = await bcrypt.hash(req.body.password, 10);
        await db.signUpInformation (name, email, password_hash);
        res.status(201).json({message: "user created"});
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

module.exports = {
    registerGet,
    registerPost,
    loginGet,
}