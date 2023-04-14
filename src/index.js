const express = require('express')
const mongoose = require('mongoose');
const route = require('./router/router')
const multer=require("multer")
const cors = require('cors')
const app = express()

app.use(cors())

mongoose.set({strictQuery:true})

app.use(express.json())

app.use(multer().any())

mongoose.connect("mongodb+srv://abhinav:abhi123@cluster0.qicwtqo.mongodb.net/FSOC",
{dbName:"FSOC"},
{useNewUrlParser:true})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(3000, function() {
    console.log('Express app running on port ' +  3000)
});