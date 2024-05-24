const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./config/db");
const path = require("path");
const fs = require("fs");
const {promisify} = require("util");
const {shouldCompress} = require("./utils");
const compression = require("compression");
const Routes = require("./routes");
//Connect MongoDB
connect();

// Settings
dotenv.config({path: "./config/config.env"});
app.use(express.static(path.join(__dirname, "public")));
app.use(
  logger("dev", {
    skip: (req, res) => req.method === "OPTIONS",
  })
);
app.use(
  compression({
    filter: shouldCompress,
    threshold: 0,
  })
);
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Success working Server");
});

app.use(Routes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running", PORT);
});
