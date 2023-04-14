const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const restorentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageResto:{
        type: String,
        required: true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },address:{
        area:String,
        street:String,
        city:String,
        pincode:String
    },
},{timestamp:true})

module.exports = mongoose.model('Restorents',restorentSchema)