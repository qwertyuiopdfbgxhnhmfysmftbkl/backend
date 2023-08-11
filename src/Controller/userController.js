const UserModel = require('../Model/userModel')
const jwt = require('jsonwebtoken')
const Validator = require('validator')

const CreateUser=async(req,res)=>{
        let data=req.body
        if(Object.keys(data).length==0) return res.status(400).send({ status: false, message: "please enter user data" })

        let {name,phone,email,address}=data

        if(!name) return res.status(400).send({ status: false, message: "please enter user name" })
        if(!/^([a-z  A-Z]){2,30}$/.test(name)) return res.status(400).send({ status: false, message: "please enter valid user name" })
        
        if(!phone) return res.status(400).send({ status: false, message: "please enter User Phone Number" })
        if(!/^[6-9]{1}[0-9]{9}$/.test(phone)) return res.status(400).send({ status: false, message: "please enter valid User phone number" })
        let isPhoneExist=await UserModel.findOne({phone:phone})
        if(isPhoneExist) return res.status(400).send({ status: false, message: "Phone number is already exist" })

        if(!email) return res.status(400).send({ status: false, message: "please enter User email" })
        let isEmailExist=await UserModel.findOne({email:email})
        if(isEmailExist) return res.status(400).send({ status: false, message: "Email is already exist" })

        // if(!address) return res.status(400).send({ status: false, message: "please enter valid street name" })
        // if(typeof(address)!="object") return res.status(400).send({ status: false, message: "address should be an object" })
        // let { landmark, area, street, city, pincode } = address
        // if (landmark != undefined &&  typeof (landmark) != "string" && landmark.trim() == "") return res.status(400).send({ status: false, message: "please enter valid street name" })
        // if (area!= undefined && typeof (area) != "string" && area.trim() == "") return res.status(400).send({ status: false, message: "please enter valid city" })
        // if (street != undefined &&  typeof (street) != "string" && street.trim() == "") return res.status(400).send({ status: false, message: "please enter valid street name" })
        // if (city != undefined && typeof (city) != "string" && city.trim() == "") return res.status(400).send({ status: false, message: "please enter valid city" })
        // if (pincode != undefined &&  typeof (pincode) != "string" && pincode.trim() == "") return res.status(400).send({ status: false, message: "please enter valid pincode" })
        // if(!/^[0-9]{6}$/.test(pincode)) return res.status(400).send({status:false,message:"please enter 6 length pincode"})
        data.address="kanpur"
        let createData = await UserModel.create(data)
        res.status(201).send({status:true, Message:"User registered successfully",data:createData})
   
}

const LoginUser = async(req,res)=>{
    try {
        let userData = req.body;
        if (Object.keys(userData).length == 0) return res.status(400).send({ status: false, message: "please enter some data..." })
        if (Object.keys(userData).length > 2) return res.status(400).send({ status: false, message: "enter only Email or Phone" })

        // if (!email || (typeof (email) == "string" && email.trim() == "") || !(phone || (typeof (phone) == "string" && phone.trim() == ""))) return res.status(400).send({ status: false, message: "Please provide email or phone number" })
        let {email,phone}=userData

        let isUserExist = await UserModel.findOne({$or:[{ email: email}, {phone: phone}]})
        if (!isUserExist) return res.status(404).send({ status: false, message: "user Not found" })

        let token = jwt.sign({ userId: isUserExist._id, exp:(Math.floor(Date.now() / 1000)) + 84600}, "FSCO");
        console.log("date", Date.now())
        const date = new Date();
        console.log(`Token Generated at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);

        // 
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message:"success",UserId:isUserExist._id,data:token })

    }
    catch(error){
        return res.status(500).send({ status: false, error: error.message }) 
    }
}

const GetuserData = async(req,res)=>{
    try{
        let data=req.body
        let getdata = await UserModel.findOne({phone:data})
        return res.status(200).send({status:True,data:getdata})

    }catch(err){
        return res.status(500).send({status:false,Error:err.message})
    }
}

module.exports = { CreateUser, LoginUser ,GetuserData }