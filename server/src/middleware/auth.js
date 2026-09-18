function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(401).json({message: "not authenticated"});
}

module.exports = isAuthenticated;