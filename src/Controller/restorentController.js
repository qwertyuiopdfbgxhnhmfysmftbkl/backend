const restorent = require('../Model/restorentModel')
const Validator = require('validator')
const aws = require('aws-sdk');
const { uploadImage } = require('../Middleware/AWS')


const createData = async(req,res)=>{
    try{

        let data = req.body
        let files = req.files
        if(Object.keys(data).length==0) return res.status(400).send({ status: false, message: "please enter restorent data" })
         
        let {name,imageResto,phone,address}=data
        if(!name) return res.status(400).send({status:false,message:"please enter Restorent"})
        
        if(!phone) return res.status(400).send({status:false,message:"please enter Restorent"})
        if(!/^[6-9]{1}[0-9]{9}$/.test(phone)) return res.status(400).send({ status: false, message: "please enter valid User phone number" })
        let isPhoneExist=await restorent.findOne({phone:phone})
        if(isPhoneExist) return res.status(400).send({ status: false, message: "Phone number is already exist" })

        if(!address) return res.status(400).send({status:false,message:"please enter Restorent"})
        req.body.address = JSON.parse(address)
        if(typeof(req.body.address)!="object") return res.status(400).send({ status: false, message: "address should be an object" })
        let {area, street, city, pincode } = req.body.address
        if (area!= undefined && typeof (area) != "string" && area.trim() == "") return res.status(400).send({ status: false, message: "please enter valid area" })
        if (street != undefined &&  typeof (street) != "string" && street.trim() == "") return res.status(400).send({ status: false, message: "please enter valid street name" })
        if (city != undefined && typeof (city) != "string" && city.trim() == "") return res.status(400).send({ status: false, message: "please enter valid city" })
        if (pincode != undefined &&  typeof (pincode) != "string" && pincode.trim() == "") return res.status(400).send({ status: false, message: "please enter valid pincode" })
        if(!/^[0-9]{6}$/.test(pincode)) return res.status(400).send({status:false,message:"please enter 6 length pincode"})
    
        let imageUrl = await uploadImage(files[0])
            data.imageResto = imageUrl

        let dataCreated = await restorent.create(data)
        res.status(201).send({status:true, Message:"Restorent registered successfully",data:dataCreated})

    }
    catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
} 

const getRestorent = async(req,res)=>{
    try{
        let data = await restorent.find()
        // data=data.json()
        res.status(200).send(data)
    }
    catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

const getRestorentByname = async(req,res)=>{
    try{
        let Name=req.params.name
        console.log(typeof(Name))
        console.log(Name)
        let title = {$regex:Name, $options: 'i' };
        let Responsedata = await restorent.find({name:title})
        if(!Responsedata) return res.status(400).send({status:false,message:"No data Found"})
        res.status(200).send({status:true,data:Responsedata})
    }
    catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

module.exports = { createData, getRestorent, getRestorentByname}

