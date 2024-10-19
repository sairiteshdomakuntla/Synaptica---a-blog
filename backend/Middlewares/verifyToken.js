const jwt=require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req,res,next){
    //get bearer token from headers of req
    const bearerToken=req.headers.authorization;
    //if bearer token not available
    if(!bearerToken){
        return res.send({message:"Unauthorized access, please login to continue."})
    }
    //extract token from bearer token
    const token=bearerToken.split(' ')[1]
    try{
        const decoded = jwt.verify(token,process.env.SECRET_KEY)
        req.user = decoded;
        next()
    }catch(err){
        return res.status(401).send({ message: "Invalid token." });
    }
}


module.exports=verifyToken;