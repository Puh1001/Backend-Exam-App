const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();

const connection = require("./configs/db");

const app = express();
const domain = process.env.DOMAIN;
const port = process.env.PORT || 8000;

// MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

// ROUTER
app.use("/api/v1/user", require("./routers/userRouter"));

// CONNECTION
connection
  .query("SELECT 1")
  .then(() => {
    console.log("DB connect success");

    app.listen(port, () => {
      console.log(`App run on ${domain}:${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
