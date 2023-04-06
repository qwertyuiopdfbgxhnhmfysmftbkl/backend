const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },address:{
        house:String,
        area:String,
        streat:String,
        Landmark:String,
        pincode:String
    },
},{timestamp:true})

module.exports = mongoose.model('User',usersSchema)