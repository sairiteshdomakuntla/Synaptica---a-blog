const express=require('express')
const commonApp=express.Router();


commonApp.get('/common',(req,res)=>{
    res.send({message:"This is from common app"})
})

//export
module.exports=commonApp;