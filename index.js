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
// app.set('view engine', 'pug');
// app.set('views', './views');

debug("Environment :: ", process.env.NODE_ENV);
debug("Environment Name :: ", config.get("name"));
// debug('Environment host :: ', config.get('mail.host'));
// debug('Environment password :: ', process.env.app_password);

app.use("/api/users", users);
app.use("/api/login", auth);

// app.get('/', (req, res) => {
//     res.render('index', { title: "Movies", message: "Hi this Hemanth" });
// });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  dbDebug(`server is running on port ${port}.....!`);
});

mongoose
  .connect(config.get("mongoURL"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => dbDebug("DB connected ...!"))
  .catch((err) => dbDebug("!---- Connection ERROR ----!"));
