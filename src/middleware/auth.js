const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
    try {
        // const token = req.header("Authorization").replace("Bearer", "").trim();
        const token = req.cookies.Pupils_Hub;
        const decoded = jwt.verify(token, SECRET);

        const authUser = await User.findOne({ _id: decoded._id, "tokens.token": token });
        if (!authUser) {
            throw new Error("Please Authenticate! You are not logged in");
        }
        req.user = authUser;
        next();
    }
    catch (error) {
        res.redirect("/login");
        // res.status(400).send({error: "Please Authenticate in auth!"});
    }
}

module.exports = auth;