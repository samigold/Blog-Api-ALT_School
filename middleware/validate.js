const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');


const protect = asyncHandler(async (req, res, next) =>{
    let token;
    token = req.cookies.token;

    if(token){

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.userId).select('-password');
        //console.log("token found: ", user);
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch(error){
            res.status(401);
            throw new Error('Not Authorized, token failed')
        }
    } else{
        res.status(401);
        console.log("token not found");
        throw new Error('Not Authorized, no token')
    }
})

module.exports = { protect };