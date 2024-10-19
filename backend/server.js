//create express app
const express=require('express')
const app=express()
require('dotenv').config() //process.env.PORT
const mongoClient=require('mongodb').MongoClient;
const path=require('path');

//deploy react build in this server
app.use(express.static(path.join(__dirname,'../client/blogapp/dist')))

//to parse the body of req
app.use(express.json())

//connect to DB
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //get db object
    const blogdb=client.db('blogdb')
    //get collection object
    const userscollection=blogdb.collection('userscollection');
    const articlescollection=blogdb.collection('articlescollection');
    const authorscollection=blogdb.collection('authorscollection')
    const adminscollection=blogdb.collection('adminscollection');
    //share collection obj with express app
    app.set('userscollection',userscollection)
    app.set('articlescollection',articlescollection)
    app.set('authorscollection',authorscollection)
    app.set('adminscollection',adminscollection)
    console.log("DB connection success")
})
.catch(err=>console.log("Err in DB connection",err))

//import API routes
const userApp=require('./APIs/user-api');
const authorApp=require('./APIs/author-api');
const adminApp=require('./APIs/admin-api');
const exp = require('constants');

//if path starts with user-api, send req to userApp
app.use('/user-api',userApp)

//if path starts with author-api, send req to authorApp
app.use('/author-api',authorApp)

//if path starts with admin-api, send req to adminApp
app.use('/admin-api',adminApp)


app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/blogapp/dist/index.html'))
})


//express error handler
app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err})
})


//assign port number
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Web server is on port ${port}`)
})