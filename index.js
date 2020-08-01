const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const debug = require("debug")("app:debug");
const dbDebug = require("debug")("app:dbDebug");
const auth = require("./routers/auth");
const users = require("./routers/users");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
  if (!config.get("jwtPrivateKey")) {
    console.log("Forget to update jwt token");
    process.exit(1);
  }
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(function (req, res, next) {
  const regX = new RegExp(/http?:\/\/[A-Za-z]+:[0-4]+\/.*/i);
  const url = req.url.trim();
  if (url.match(regX)) {
    debug("URL IS valid");
  } else {
    debug("Url is  INVALID");
  }

  next();
});

debug("Environment :: ", process.env.NODE_ENV);
debug("Environment Name :: ", config.get("name"));

app.use("/api/users", users);
app.use("/api/login", auth);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  dbDebug(`server is running on port ${port}.....!`);
});

const mongoURL = process.env.MONGODB_URI || config.get("mongoURL");
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => dbDebug("DB connected ...!"))
  .catch((err) => dbDebug("!---- Connection ERROR ----!"));
