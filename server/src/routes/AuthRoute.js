const router = require("express").Router();
const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { authenticateToken } = require("../middleware/AuthMiddleware");

// Login route
router.post("/", async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.status(401).send({ message: "Invalid Username or Password" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Username or Password" });

        const token = user.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain:
                process.env.NODE_ENV === "production"
                    ? process.env.FRONTEND_URN
                    : "localhost",
        });

        return res.send({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

// Log out route
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
            process.env.NODE_ENV === "production"
                ? process.env.FRONTEND_URN
                : "localhost",
    });

    return res.send({ message: "Logged out successfully" });
});

// Validation function
const validateLogin = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        // Fetch user data from the database
        const userProfile = await User.findById(req.user.username);
        if (!userProfile) {
            console.error("User not found:", req.user.username);
            return res.status(404).send({ message: "User not found." });
        }

        // Set user profile data in a cookie
        res.cookie(
            "userProfile",
            JSON.stringify({
                username: userProfile.username,
                role: userProfile.role,
            }),
            { 
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", 
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                domain:
                  process.env.NODE_ENV === "production"
                    ? process.env.FRONTEND_URN
                    : "localhost", 
            }
        );

        // Send the profile data as part of the response as well (optional)
        res.send({
            message: "Welcome to your profile!",
            user: {
                username: userProfile.username,
                role: userProfile.role,
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
