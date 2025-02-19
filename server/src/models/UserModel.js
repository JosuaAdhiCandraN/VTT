const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const User = mongoose.model("User", userSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid("user", "admin").optional().default("user"),
  });
  return schema.validate(data);
};

module.exports = {
  User,
  validateUser,
};
