const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/UserModel");

const registerUser = async (req, res) => {
  try {
    // Validate user input
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if the user already exists
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      return res
        .status(409)
        .send({ message: "User with this username already exists!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create and save the user
    user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message || error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "Invalid username or password." });
    }

    // Check if the password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid username or password." });
    }

    res.status(200).send({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during login:", error.message || error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).send({ message: "No users found" });
    }

    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error.message || error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
