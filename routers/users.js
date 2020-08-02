const { User, validate } = require("../models/users");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const isEmail_dup = await User.findOne({ email: req.body.email });
  if (isEmail_dup)
    return res.status(403).send({ error: "Email already exist" });

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  try {
    const user = new User({
      ...req.body,
    });

    const result = await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send({
      user: JSON.stringify(result),
      token: token,
    });
  } catch (ex) {
    throw ex;
  }
});

module.exports = router;
