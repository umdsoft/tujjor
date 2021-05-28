const express = require('express')
const app = express()
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const connect = require('./config/db')
//Connect MongoDB
connect();

// Settings
dotenv.config({path: "./config/config.env"})
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors());

// Routes
app.get('/',(req,res)=>{
    res.send('Hello Server')
})
app.use('/api/category',require('./routes/category'))
app.use('/api/user',require('./routes/user'))

const PORT = proccess.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log('Server running')
})
