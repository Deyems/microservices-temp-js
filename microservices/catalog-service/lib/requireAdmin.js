const jwt = require("jsonwebtoken");

const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        res.sendStatus(401);
    }
    return jwt.verify(token, "MY SECRET KEY", (err, user) => {
        if(err) res.sendStatus(403);
        if(!user.isAdmin) res.sendStatus(403);
        console.log(user, 'at verify middleware for token');
        req.user = user;
        return next();
    })
}

module.exports = requireAdmin;