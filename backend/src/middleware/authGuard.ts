const jwt = require("jsonwebtoken");

function authGuard(req: any, res: any, next: any) {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authGuard;