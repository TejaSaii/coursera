const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token || !token.startsWith("Bearer ")){
    return res.status(403).json({message: "Invalid token"});
  }
  jwt.verify(token.split(" ")[1], SECRET, (err, {id, role}) => {
    if(err){
      return res.status(403).json({message: "Invalid token"});
    }
    if(!id || !role)
      return res.status(403).json({message: "Invalid token"});
    req.headers.id = id;
    req.headers.role = role;
    next();
  });
};

const authorizeRole = (role) => (req, res, next) => {
  if(req.headers.role !== role){
    return res.status(403).json({message: "Access Denied: You do not have the required permissions."})
  }
  next();
}

module.exports = {
  authenticateToken,
  authorizeRole
}
