const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.header("Authorization");
        
        // Check if token exists
        if (!token) {
            return res.status(401).send({ message: "Access denied. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWTPRIVATEKEY);
        
        // Attach decoded user information to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).send({ message: "Invalid or expired token." });
    }
};

// Middleware to ensure admin access
const verifyAdmin = (req, res, next) => {
    try {
        // Check if user role exists and is admin
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).send({ message: "Access denied. Admins only." });
        }
    } catch (error) {
        console.error("Admin verification failed:", error.message);
        return res.status(403).send({ message: "Access denied." });
    }
};

module.exports = { verifyToken, verifyAdmin };
