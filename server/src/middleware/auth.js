//middleware to run before controller

const db = require("../db/queries");

//if not logged in, stop
//if logged in, run next() and continue to controller
function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(401).json({message: "not authenticated"});
}

async function isGroupMember(req, res, next) {
    try {
        const group_id = req.params.id;
        const user_id = req.user.id;
        const rows = await db.isMember(group_id, user_id);
        if (rows.length === 0) {
            return res.status(403).json({message: "You're not a member of this group."});
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong."});
    }
}

module.exports = {
    isAuthenticated,
    isGroupMember
}