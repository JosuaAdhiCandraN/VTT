const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required().min(8)
  });
  return schema.validate(data);
};

module.exports = { User, validateUser };