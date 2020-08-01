const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const Joi = require("joi");
const express = require("express");
// const _ = require('lodash');
const bcrypt = require("bcrypt");
const config = require("config");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  return res.header("x-auth-token", token).send({ token: token });
});

function validate(login) {
  const scheme = {
    email: Joi.string().min(0).max(255).required().email(),
    password: Joi.string().min(0).max(255).required(),
  };

  return Joi.validate(login, scheme);
}

module.exports = router;
