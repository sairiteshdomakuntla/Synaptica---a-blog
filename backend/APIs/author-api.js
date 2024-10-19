//create author api app
const express=require('express')
const authorApp=express.Router();
const bcryptjs=require('bcryptjs');
const expressAsyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');
const verifyToken=require('../Middlewares/verifyToken')
require('dotenv').config();

let authorcollection;
let articlescollection;
//get author collection app
authorApp.use((req,res,next)=>{
    authorcollection=req.app.get('authorscollection')
    articlescollection=req.app.get('articlescollection')
    next()
})

//author registration route
authorApp.post('/author',expressAsyncHandler(async(req,res)=>{
    // console.log(req.body)
    //get user resourse from the client
    const newAuthor=req.body;
    //check for duplicate user based on username
    const dbAuthor=await authorcollection.findOne({username:newAuthor.username})
    //if user found in DB
    if(dbAuthor!=null) {
        res.send({message:"Author already existed with this username"})
    } else {
        //hash the pswd
        const hashedPassword=await bcryptjs.hash(newAuthor.password,6);
        //duplicate plain pswd with hashed pswd
        newAuthor.password=hashedPassword;
        //create Author
        await authorcollection.insertOne(newAuthor);
        //send res
        res.send({message:"Author created successfully!"})
    }
}))

//author login route
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get credential obj from client
    const authorCred=req.body;
    //check for username
    const dbAuthor=await authorcollection.findOne({username:authorCred.username})
    if(dbAuthor===null){
        res.send({message:"Invalid username"})
    }
    else{
    //check for password
    const status=await bcryptjs.compare(authorCred.password,dbAuthor.password)
    if(status===false){
        res.send({message:"Invalid password"})
    }
    else{
        //create jwt token and encode it
        const signedToken=jwt.sign({username:dbAuthor.username},process.env.SECRET_KEY,{expiresIn: '1d'})
        //send res
        res.send({message:"Login success!",token:signedToken,user:dbAuthor})
    }
    }
}))

// //get articles of all authors
authorApp.get('/articles',expressAsyncHandler(async(req,res)=>{
    //get articlescollection from express app
    const articlescollection=req.app.get('articlescollection')
    //get all articles
    let articlesList=await articlescollection.find().toArray()
    //send res
    res.send({message:"articles",payload:articlesList});
}))

//adding new article by author
authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new article from client
    const newArticle=req.body;
    console.log(newArticle)
    //post to articlescollection
    await articlescollection.insertOne(newArticle);
    //send res

    res.send({message:"New article created"})
}))

//modify article by author

authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get modified article from client
    const modifiedArticle=req.body;
    //update by article id
    let result=await articlescollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
    let latestArticle=await articlescollection.findOne({articleId:modifiedArticle.articleId})
    // console.log(result)
    res.send({message:"Article modified",article:latestArticle})
}))
//delete and restore an article by article id
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articleId from url
    const articleIdFromUrl=(+req.params.articleId);
    //get article
    const articleToDelete=req.body;
    if(articleToDelete.status===true){
        let modifiedArticle=await articlescollection.findOneAndUpdate({articleId:articleIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:"after"})
        res.send({message:"Article removed",payload:modifiedArticle.status})
    }
    if(articleToDelete.status===false){
        let modifiedArticle=await articlescollection.findOneAndUpdate({articleId:articleIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:"after"})
        res.send({message:"Article restored",payload:modifiedArticle.status})
    }
}))


//read articles of author
authorApp.get('/articles/:username', verifyToken, expressAsyncHandler(async (req, res) => {
    const authorName = req.params.username;
    
    // Check if the logged-in user is the author of the requested articles
    if (req.user.username === authorName) {
        // If the logged-in user is the author, show all articles including deleted ones
        const articlesList = await articlescollection.find({ username: authorName }).toArray();
        res.send({ message: "List of articles (author view)", payload: articlesList });
    } else {
        // For all other cases (users or other authors), only show non-deleted articles
        const articlesList = await articlescollection.find({ username: authorName, status: true }).toArray();
        res.send({ message: "List of articles (user view)", payload: articlesList });
    }
}));




//exportauthorrApp
module.exports=authorApp;