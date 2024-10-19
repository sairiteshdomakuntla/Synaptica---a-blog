//create user api app
const express=require('express');
const userApp=express.Router(); //create new router instance
const bcryptjs=require('bcryptjs');
const expressAsyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');
const verifyToken=require('../Middlewares/verifyToken')
require('dotenv').config();

let usercollection;
let articlescollection;
//get user collection app
userApp.use((req,res,next)=>{
    usercollection=req.app.get('userscollection')
    articlescollection=req.app.get('articlescollection')
    next()
})

//user registration route
userApp.post('/user',expressAsyncHandler(async(req,res)=>{
    // console.log(req.body)
    //get user resourse from the client
    const newUser=req.body;
    //check for duplicate user based on username
    const dbUser=await usercollection.findOne({username:newUser.username})
    //if user found in DB
    if(dbUser!=null) {
        res.send({message:"User already existed with this username"})
    } else {
        //hash the pswd
        const hashedPassword=await bcryptjs.hash(newUser.password,6);
        //duplicate plain pswd with hashed pswd
        newUser.password=hashedPassword;
        //create user
        await usercollection.insertOne(newUser);
        //send res
        res.send({message:"User created successfully!"})
    }
}))


//user login route
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get credential obj from client
    const userCred=req.body;
    //check for username
    const dbUser=await usercollection.findOne({username:userCred.username})
    if(dbUser===null){
        res.send({message:"Invalid username"})
    }
    else{
    //check for password
    const status=await bcryptjs.compare(userCred.password,dbUser.password)
    if(status===false){
        res.send({message:"Invalid password"})
    }
    else{
        //create jwt token and encode it
        const signedToken=jwt.sign({username:dbUser.username},process.env.SECRET_KEY,{expiresIn: '1d'})
        //send res
        res.send({message:"Login success!",token:signedToken,user:dbUser})
    }
    }
}))

//get articles of all authors
userApp.get('/articles', verifyToken, expressAsyncHandler(async(req, res) => {
    let articlesList = await articlescollection.find({status:true}).toArray();
    res.send({ message: "List of articles", payload: articlesList });
}));


// Get articles by author
userApp.get('/articles/:author', verifyToken, expressAsyncHandler(async (req, res) => {
    const author = req.params.author;
    let articlesList = await articlescollection.find({ author: author, status: true }).toArray();
    if (articlesList.length > 0) {
        res.send({ message: "articles", payload: articlesList });
    } else {
        res.send({ message: "No articles found", payload: [] });
    }
}));



//post comments for an article by article id
userApp.post('/comment/:articleId', verifyToken, expressAsyncHandler(async (req, res) => {
    try {
        const userComment = req.body;
        const articleIdFromUrl = (+req.params.articleId);
        let result = await articlescollection.updateOne(
            { articleId: articleIdFromUrl },
            { $addToSet: { comments: userComment } }
        );
        if (result.modifiedCount > 0) {
            res.send({ message: "Comment posted!" });
        } else {
            res.send({ message: "Failed to post comment" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
    }
}));


//export userApp
module.exports=userApp;