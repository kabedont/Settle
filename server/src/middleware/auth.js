//middleware to run before controller
//if not logged in, stop
//if logged in, run next() and continue to controller
function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(401).json({message: "not authenticated"});
}

module.exports = isAuthenticated;