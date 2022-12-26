const pool = require("./database");
const express = require("express");
const app = express();
const cors = require("cors");
const login = require("./query/login");
const checkout = require("./query/checkout");
const users = require("./query/users");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(login);
app.use(checkout);
app.use(users);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Now listening on port ` + 8080);
});
