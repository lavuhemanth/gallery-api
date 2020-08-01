const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");

const userScheme = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 255,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 2525,
    required: true,
  },
  gender: {
    type: String,
    minlength: 4,
    maxlength: 6,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    min: 8,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userScheme.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      gender: this.gender,
      dob: this.dob,
      age: this.age,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userScheme);

function validateUser(user) {
  const schema = {
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(8).max(2525).required(),
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    dob: Joi.date().required(),
    gender: Joi.string(),
    age: Joi.number(),
  };

  return Joi.validate(user, schema);
}

module.exports.validate = validateUser;
module.exports.User = User;
