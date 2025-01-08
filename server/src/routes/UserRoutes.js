const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/UserControllers");

// Register new user
router.post("/register", userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Get all users
router.get("/", userController.getAllUsers);

module.exports = router;
