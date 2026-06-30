

const jwt  = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || 'acharya'

const auth  = (req,res,next)=>{
    const data = req.headers["authorization"]
    const token = data ? data.split(' ')[1] : null

    if(token){
        jwt.verify(token,secretKey,(err,validate)=>{
            if(err){
                return res.status(401).json({ msg: "Error while accessing: " + err.message })
            }
            if(validate){
                req.user = validate.user;
                return next()
            }
            return res.status(401).json({ msg: "User is not authorized" })
        })
    }
    else{
        return res.status(401).json({ msg: "Authorization token is missing" })
    }
}

module.exports = auth;







