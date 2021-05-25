const express = require('express')
const app = express()
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const connect = require('./config/db')
//Connect MongoDB
connect();

// Settings
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors());

// Routes
app.get('/',(req,res)=>{
    res.send('Hello Server')
})
app.use('/api/category',require('./routes/category'))
app.use('/api/user',require('./routes/user'))


app.listen(3001,()=>{
    console.log('Server running')
})
