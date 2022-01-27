const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const router = new express.Router();
const User = require("../models/user");
const Admin = require("../models/admin");
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const adminAuth = require("../middleware/adminAuth");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// creating an admin ============================
router.post("/admins", (req, res) => {
    
    const newAdmin = new Admin(req.body);

    newAdmin.save().then((result) => {
        console.log("Admin created Successfully. ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Admin Creation Failed. Error : ", error);
        res.status(400).send(error);
    })
})

// read profile :
router.get("/admins/me", adminAuth ,async (req, res) => {
    res.send(req.admin);
})

// login an admin ==================================
router.post("/admins/login",async (req,res)=>{
    try{
        const authenticatedAdmin = await Admin.checkLoginCredentials(req.body.email,req.body.pass);
        const token = await authenticatedAdmin.generateAuthToken();
        res.cookie("Pupils_Hub",token,{
            expires:new Date(Date.now() + 24*60*60*1000),
            httpOnly:true
        });
        res.redirect("/aDashboard");
    }
    catch(error){
        res.status(400).send("Admin Authentication Failed");
    }
})

// logOut an admin :
router.get("/aLogout",adminAuth, async (req,res)=>{
    try{
        req.admin.tokens = req.admin.tokens.filter((currElement)=>{
            return currElement.token !== req.cookies.Pupils_Hub;
        })
        await req.admin.save();
        res.clearCookie("Pupils_Hub");
        res.redirect("/aLogin");
    }
    catch(error){
        res.status(400).send(error);
    }
})

// updating a particular admin's data ======================
router.patch("/admins/:id", async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullname","pass","mobileNo","gender","address"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Updates!"});
    }

    try {
        const updatedAdmin = await Admin.findById(req.params.id);
        updates.forEach((update)=> updatedAdmin[update] = req.body[update]);
        await updatedAdmin.save();
        if (!updatedAdmin) {
            res.send("Admin not found in database");
        }
        res.send(updatedAdmin);
    }
    catch (error) {
        res.status(400).send(error);
    }
})

// upload avatar :
const storage = multer.memoryStorage();
const upload = multer({
    // dest:"avatars",
    limits: 1000000,
    fileFilter(req,file,cb){
        if(file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)){
            cb(undefined,true);
        }
        else{
            cb(new Error("Please upload only .jpg file"));
            cb(undefined,false);
        }
    },storage
});

// here we are uploading avatar in our mongodb database
router.post("/admins/me/avatar", adminAuth, upload.single("Avatar") ,async (req,res)=>{
    req.admin.avatar = req.file.buffer;
    await req.admin.save();
    // res.send("Successfully uploaded your avatar");
    res.redirect("/aDashboard");
},(error,req,res,next)=>{
    res.status(400).send({error: error.message});
})
// this "(error,req,res,next)" call signature tells express that the function is set up to handle any uncaught errors

// here we are fetching avatar :
router.get("/admins/:id/avatar",adminAuth,async (req,res)=>{
    try{
        const avatarAdmin = await Admin.findById(req.params.id);
        if(!avatarAdmin || !avatarAdmin.avatar){
            // throw new Error("No avatar found");
            return 0;
        }
        res.set("Content-Type","image/jpg");
        res.send(avatarAdmin.avatar);
    }
    catch(error){
        res.status(404).send("No Avatar Found");
    }
})


// check whether user is old user or not (authenticating email,pass)
router.post("/admins/isOldAdmin",async (req,res)=>{
    try{
        const isOldAdmin = await Admin.checkLoginCredentials(req.body.email,req.body.pass);
        if(isOldAdmin){

            return res.send(isOldAdmin);
        }
        res.status(400).send("Admin Authentication failed");
    }
    catch(error){
        res.status(400).send("Admin Authentication Failed ");
    }
})

module.exports = router;