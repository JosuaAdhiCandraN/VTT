const express = require("express");
const router = express.Router();

const userController = require("../controllers/UserControllers");

// Register new user
router.post("/register", userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Get all users
router.get("/", userController.getAllUsers);

//update user
router.put("/:username", userController.updateUser);

//delete user
router.delete("/:username", userController.deleteUser); 


module.exports = router;
