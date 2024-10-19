//create admin api app
const express=require('express')
const adminApp=express.Router();
const bcryptjs=require('bcryptjs');
const expressAsyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');
require('dotenv').config();

let admincollection;
//get admin collection app
adminApp.use((req,res,next)=>{
    admincollection=req.app.get('adminscollection')
    next()
})

//admin login route
adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get credential obj from client
    const adminCred=req.body;
    //check for username
    const dbAdmin=await admincollection.findOne({username:adminCred.username})
    if(dbAdmin===null){
        res.send({message:"Invalid username"})
    }
    else{
    //check for password
    const status=await bcryptjs.compare(adminCred.password,dbAdmin.password)
    if(status===false){
        res.send({message:"Invalid password"})
    }
    else{
        //create jwt token and encode it
        const signedToken=jwt.sign({username:dbAdmin.username},process.env.SECRET_KEY,{expiresIn: 20})
        //send res
        res.send({message:"Login success!",token:signedToken,admin:dbAdmin})
    }
    }
}))

//get articles of all users
adminApp.get('/articles',expressAsyncHandler(async(req,res)=>{
    //get articlescollection from express app
    const articlescollection=req.app.get('articlescollection')
    //get all articles
    let articlesList=await articlescollection.find().toArray()
    //send res
    res.send({message:"articles",payload:articlesList});
}))
//export adminApp
module.exports=adminApp;