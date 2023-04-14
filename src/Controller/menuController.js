const menuModel= require('../Model/foodMenu')
const restorent = require('../Model/restorentModel')

const aws = require('aws-sdk');
const { uploadImage } = require('../Middleware/AWS')

const createMenu = async(req,res)=>{
    try{
        let data = req.body
        let files = req.files
        if(Object.keys(data).length==0) return res.status(400).send({ status: false, message: "please enter user data" })

        let {restorent,imageManu,name,price,type}= data

        let imageUrl = await uploadImage(files[0])
            data.imageManu = imageUrl

        let createFood = await menuModel.create(data)
        return res.status(201).send({status:true,message:"Food is created",data:createFood})

    }catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

const getFoodData=async(req,res)=>{
    try{
        const restorent = req.params.restorent
        // const UserId = req.params.userId
        // if (UserId != req.decodedToken) return res.status(403).send({ status: false, message: "you are not authorised for this action" })
        let getFood = await menuModel.find({restorent:restorent})
        return res.status(200).send({status:true,message:"Food Data",data:getFood})

    }catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

const getFoodName = async(req,res)=>{
    try{ 
        let Name=req.params.name
        let title = {$regex:Name, $options: 'i' };
        let Menudata = await menuModel.findOne({name:title})
        if(!Menudata) return res.status(400).send({status:false,message:"No data Found"})
        res.status(200).send({status:true,data:Menudata})
    }catch(err){
        return res.status(500).send({status:false,Error:err.message})
    }
}

module.exports = { createMenu, getFoodData,getFoodName }