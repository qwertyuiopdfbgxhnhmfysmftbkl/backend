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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHea
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

mongoose.connect("mongodb+srv://abhinav:abhi123@cluster0.qicwtqo.mongodb.net/FSOC",
{dbName:"FSOC"},
{useNewUrlParser:true})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT||3000, function() {
    console.log('Express app running on port ' +  3000)
});