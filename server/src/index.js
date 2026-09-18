//core
const express = require('express');
const cors = require('cors');
const session = require("express-session");
const passport = require("passport");

//config
require('dotenv').config();
require("./config/passport");

//routers
const authRouter = require('./routes/authRouter');
const groupsRouter = require('./routes/groupsRouter');
const expensesRouter = require('./routes/expensesRouter');
const settlementsRouter = require('./routes/settlementsRouter');

//app
const app = express();

app.use(cors());
app.use (express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use("/api/auth", authRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/settlements", settlementsRouter);

app.get('/api/test', (req, res) => {
    res.json({message: 'Settle backend is running!'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});