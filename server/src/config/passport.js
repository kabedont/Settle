const db = require("../db/queries");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
    new LocalStrategy(async (email, password, done) => {
        try {
            const rows = await db.getUserByEmail(email);
            const user = rows[0];

            if (!user) {
                return done(null, false, {message: "Incorrect email"});
            }
            
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const rows = await db.getUserById(id);
        const user = rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;