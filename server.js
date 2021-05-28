const express = require('express')
const app = express()
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const connect = require('./config/db')
const path = require('path')
//Connect MongoDB
connect();

// Settings
dotenv.config({path: "./config/config.env"})
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors());

// Routes
app.get('/',(req,res)=>{
    res.send('Hello Tujjor Server')
})
app.use('/api/category',require('./routes/category'))
app.use('/api/user',require('./routes/user'))
app.use('/api/shop',require('./routes/shop'))
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log('Server running')
})
