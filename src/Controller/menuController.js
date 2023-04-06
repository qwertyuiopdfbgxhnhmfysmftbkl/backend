const menuModel= require('../Model/foodMenu')
const restorent = require('../Model/restorentModel')

const createMenu = async(req,res)=>{
    try{
        let data = req.body
        if(Object.keys(data).length==0) return res.status(400).send({ status: false, message: "please enter user data" })

        let {restorent,name,price,type}= data

        let createFood = await menuModel.create(data)
        return res.status(201).send({status:true,message:"Food is created",data:createFood})

    }catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

const getFoodData=async(req,res)=>{
    try{
        const restorent = req.params.restorent
        let getFood = await menuModel.find({restorent:restorent})
        return res.status(200).send({status:true,message:"Food Data",data:getFood})

    }catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

module.exports = { createMenu, getFoodData }