const express=require("express")
const jwt=require("jsonwebtoken")
const authenticate= (req,res,next)=>{
    let token=req.headers.authorization
    if(token){
        let decoded= jwt.verify(token,process.env.key)
        if(decoded){
            const userID=decoded.userID
            req.body.userID=userID
            next()
        }else{
            res.send("Please login First")
        }

    }else{
        res.send({"msg":"Login First"})
    }
}


module.exports={
    authenticate
}