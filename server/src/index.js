const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const authRouter = require('./routes/authRouter');
const session = require("express-session");
const passport = require("passport");

app.use(cors());
app.use (express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use("/api/auth", authRouter);

app.get('/api/test', (req, res) => {
    res.json({message: 'Settle backend is running!'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});