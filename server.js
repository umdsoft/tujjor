const express = require("express");
const router = require("express").Router();
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
const errorHandler = require("./middleware/error");
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

router.use("/api/home", require("./routes/home"));
router.use("/api/stat", require("./routes/statistic"));
router.use("/api/message", require("./routes/message"));
router.use("/api/payme", require("./routes/payment"));
router.use("/api/region", require("./routes/regions"));
router.use("/api/like", require("./routes/like"));
router.use("/api/order", require("./routes/order"));
router.use("/api/tag", require("./routes/tag"));
router.use("/api/basket", require("./routes/basket"));
router.use("/api/category", require("./routes/category"));
router.use("/api/banner", require("./routes/banner"));
router.use("/api/slider", require("./routes/slider"));
router.use("/api/question", require("./routes/question"));
router.use("/api/application", require("./routes/applicationShop"));
router.use("/api/user", require("./routes/user"));
router.use("/api/shop", require("./routes/shop"));
router.use("/api/brand", require("./routes/brand"));
router.use("/api/uploads", require("./routes/images"));
router.use("/api/help", require("./routes/help"));
router.use("/api/info", require("./routes/info"));
router.use("/api/news", require("./routes/news"));
router.use("/api/product", require("./routes/product"));
router.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running", PORT);
});
