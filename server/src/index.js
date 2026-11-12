//auth, db
const isProd = process.env.NODE_ENV === "production";
const pool = require("./db/pool");

//core
const express = require('express');
const cors = require('cors');
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const path = require("path");

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

app.set("trust proxy", 1);

app.use(express.static(path.join(__dirname,'../../client/dist')));

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use (express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: new pgSession({
        pool: pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    },
}));
app.use(passport.session());
app.use("/api/auth", authRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/settlements", settlementsRouter);

app.get('/api/test', (req, res) => {
    res.json({message: 'Settle backend is running!'});
});

app.all("/api/{*splat}", (req, res) => {
    res.status(404).json({message: "Not found"});
});

app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist", 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});