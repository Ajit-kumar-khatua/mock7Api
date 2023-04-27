const express=require("express")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { UserModel } = require("../Models/user.model")
const { authenticate } = require("../middleware/authentication.middleware")
require("dotenv").config()

const userRouter=express.Router()

userRouter.get("/",(req,res)=>{
     res.send("All Good")
})

userRouter.post("/register",async (req,res)=>{
    let {image,name,bio,phone,email,password}=req.body
    try {
        let user= await UserModel.find({email})
        if(user.length==0){
            bcrypt.hash(password,5,async (err,hash_password) => {
                if(err){
                   console.log(err)
                }else{
                   let user=new UserModel({image,name,bio,phone,email,password:hash_password})
                   await user.save()
                   res.send({"msg":"Registration Sucessful"})
                }
           })

        }else{
            res.send("Email Already Exist")
        }
        
    } catch (error) {
        console.log("Error while Registering")
        console.log(error)
        res.send({"msg":"Error while registration"})
    }
})

userRouter.post("/login",async (req,res)=>{
    let {email,password}=req.body
    try {
        let user=await UserModel.find({email})
        if(user.length!=0){
            let hash_password=user[0].password
            bcrypt.compare(password,hash_password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID:user[0]._id},process.env.key)
                    res.send({"msg":"Login Sucessful",token})   
                }else{
                    console.log(err)
                    res.send({"msg":"Wrong Credentials"})
                }
            })

        }else{
            res.send({"msg":"Wrong Credentials"})
        }
        
    } catch (error) {
        console.log("Error while Logging in")
        console.log(error)
        res.send({"msg":"Error while logging in"})
    }
})

userRouter.get("/getDetails",authenticate,async (req,res)=>{
    let id=req.body.userID
    try {
        let user=await UserModel.find({_id:id})
        res.send(user)
    } catch (error) {
        console.log(error)
        res.send({"msg":"Error while getting details"})
    }
})

userRouter.patch("/edit",authenticate,async (req,res)=>{
    let id=req.body.userID
    let {image,name,bio,phone,email,password}=req.body
    try {
        bcrypt.hash(password,5,async (err,hash_password) => {
            if(err){
               console.log(err)
            }else{
                let payload={image,name,bio,phone,email,password:hash_password}
                let user= await UserModel.findByIdAndUpdate({_id:id},payload)
                res.send({"msg":"Data Updated Sucessfully"})
            }
       })
        
    } catch (error) {
        console.log(error)
    }
})


module.exports={
    userRouter
}