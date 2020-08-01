const { User, validate } = require("../models/users");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const isEmail_dup = await User.findOne({ email: req.body.email });
  if (isEmail_dup) res.status(403).send("Email already exist");

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  try {
    const user = new User({
      ...req.body,
    });

    const result = await user.save();

    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token)
      .send({
        user: _.pick(result, ["_id", "firstName", "email"]),
        token: token,
      });
  } catch (ex) {
    throw ex;
  }
});

module.exports = router;
