const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./config/db");
const path = require("path");
const fs = require("fs")
//Connect MongoDB
connect();

// Settings
dotenv.config({ path: "./config/config.env" });
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev", {
    'skip': (req, res) => req.method === "OPTIONS"
}));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("Success working Server");
});
app.use("/api/stat", require("./routes/statistic"));
app.use("/api/message", require("./routes/message"));
app.use("/api/payme", require("./routes/payment"));
app.use("/api/region", require("./routes/regions"));
app.use("/api/like", require("./routes/like"));
app.use("/api/order", require("./routes/order"));
app.use("/api/tag", require("./routes/tag"));
app.use("/api/basket", require("./routes/basket"));
app.use("/api/category", require("./routes/category"));
app.use("/api/banner", require("./routes/banner"));
app.use("/api/slider", require("./routes/slider"));
app.use("/api/question", require("./routes/question"));
app.use("/api/application", require("./routes/applicationShop"));
app.use("/api/user", require("./routes/user"));
app.use("/api/shop", require("./routes/shop"));
app.use("/api/brand", require("./routes/brand"));
app.use("/api/uploads", require("./routes/images"));
app.use("/api/help", require("./routes/help"));
app.use("/api/info", require("./routes/info"));
app.use("/api/news", require("./routes/news"));
app.use("/api/product", require("./routes/product"));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Server running");
});
