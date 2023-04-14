const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const foodMenuSchema = new mongoose.Schema({
    restorent:{
        type:ObjectId,
        ref:"Restorent"
    },
    imageManu:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true,
    },price:{
        type:String  
    },
    type:{
        type:String,
        enum:["Break-Fast","Lunch","Snacks","Dinner"]
    }
},{timestamp:true})

module.exports = mongoose.model('Menu',foodMenuSchema)