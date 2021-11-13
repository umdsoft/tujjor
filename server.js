const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./config/db");
const path = require("path");
const fs = require("fs");
const redis = require("redis");
const { promisify } = require('util')
const {shouldCompress} = require("./utils")
const compression = require('compression');
const Routes = require('./routes')
//Connect MongoDB
setTimeout(function() {
  connect();
}, 60000);

// Settings
dotenv.config({ path: "./config/config.env" });
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev", {
    'skip': (req, res) => req.method === "OPTIONS"
}));
app.use(compression({
  filter: shouldCompress,
  threshold: 0
}));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("Success working Server");
});
app.use((req, res, next) => {
    const client = redis.createClient({
        host: '127.0.0.1',
        port: 6379,
    })
    client.on("error", function(error) {
        return res.status(500).json({message: error.message});
    });
    req.GET_ASYNC = promisify(client.get).bind(client)
    req.SET_ASYNC = promisify(client.set).bind(client)

    next();
}, Routes)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Server running");
});
