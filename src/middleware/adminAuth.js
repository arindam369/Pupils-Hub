const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const SECRET = "This is my little secret";

const adminAuth = async (req, res, next) => {
    try {
        // const token = req.header("Authorization").replace("Bearer", "").trim();
        const token = req.cookies.Pupils_Hub;
        // console.log(`browser generated token : ${token}`);
        const decoded = jwt.verify(token, SECRET);
        // console.log(decoded);

        const authAdmin = await Admin.findOne({ _id: decoded._id, "tokens.token": token });
        if (!authAdmin) {
            throw new Error("Admin...Please Authenticate! You are not logged in");
        }
        req.admin = authAdmin;

        next();
    }
    catch (error) {
        res.redirect("/aLogin");
        // res.status(400).send({error: "Please Authenticate in auth!"});
    }
}

module.exports = adminAuth;