const { checkTokenAdmin } = require("../helpers/jwt");
const isAdmin = (req, res, next) => {
    if (!req.headers.token)
        return res.status(401).json({ massage: "Permission denied" });
   
    checkTokenAdmin(req.headers.token, (error, data) => {
    if (error) 
        return res.status(401).json({ massage: "Permission denied" });
    
    req.user = data;
    next();
                });
};
module.exports = isAdmin;