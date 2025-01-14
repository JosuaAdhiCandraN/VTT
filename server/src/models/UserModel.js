const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role : {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
      { _id: this._id, role: this.role }, 
      process.env.JWTPRIVATEKEY, {
      expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model('User', userSchema);



const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required().min(8)
  });
  return schema.validate(data);
};

module.exports = { 
  User, 
  validateUser
};