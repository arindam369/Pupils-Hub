const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const res = require("express/lib/response");

// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// creating an user ============================
router.post("/users", (req, res) => {
    
    const newUser = new User(req.body);

    newUser.save().then((result) => {
        console.log("User created Successfully. ", result);
        // res.send(result);
        res.redirect("/login");
    }).catch((error) => {
        // console.log("User Creation Failed. Error : ", error);
        res.render("warning");
        // res.status(400).send("Same email registered"+error);
    })
})

// reading all user data ===========================
router.get("/users",adminAuth, (req, res) => {
    User.find({}).then((result) => {
        console.log("All Users : ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Reading all users failed.", error);
        res.status(400).send(error);
    })
})

// read profile :
router.get("/users/me",auth, async (req, res) => {
    res.send(req.user);
})

// reading a particular user's data ====================
router.get("/users/:id",adminAuth, (req, res) => {
    const user_id = req.params.id;
    // res.send(user_id);
    User.find({ _id: user_id }).then((foundUser) => {
        if (!foundUser) {
            res.status(404).send("User Not found in database");
        }
        res.send(foundUser);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

// updating a particular user's data ======================
router.patch("/users/:id", async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullname","pass","mobileNo","gender","college","dept","batch","bloodGroup","address"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Updates!"});
    }
    try {
        const updatedUser = await User.findById(req.params.id);
        updates.forEach((update)=> updatedUser[update] = req.body[update]);
        await updatedUser.save();

        if (!updatedUser) {
            res.send("User not found in database");
        }
        res.send(updatedUser);
    }
    catch (error) {
        res.status(400).send(error);
    }
})

// deleting a particular user ===========================
router.delete("/users/:id",async (req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            res.send("User not found in database");
        }
        res.send("Successfully deleted ! " + deletedUser);
    }
    catch(error){
        res.status(400).send(error);
    }
})

// login a user ==================================
router.post("/users/login",async (req,res)=>{
    try{
        const authenticatedUser = await User.checkLoginCredentials(req.body.email,req.body.pass);
        const token = await authenticatedUser.generateAuthToken();
        res.cookie("Pupils_Hub",token,{
            expires:new Date(Date.now() + 24*60*60*1000),
            httpOnly:true
        });
        res.redirect("/sDashboard");
    }
    catch(error){
        res.render("authFail");
        // res.status(400).send("Authentication Failed");
    }
})


// logOut user :
router.get("/logout",auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token !== req.cookies.Pupils_Hub;
        })
        await req.user.save();
        res.clearCookie("Pupils_Hub");
        res.redirect("/login");
    }
    catch(error){
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
router.post("/users/me/avatar", auth, upload.single("Avatar") ,async (req,res)=>{
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.redirect("/sDashboard");
},(error,req,res,next)=>{
    res.status(400).send({error: error.message});
})
// this "(error,req,res,next)" call signature tells express that the function is set up to handle any uncaught errors

// here we are fetching avatar :
router.get("/users/:id/avatar",auth,async (req,res)=>{
    try{
        const avatarUser = await User.findById(req.params.id);
        if(!avatarUser || !avatarUser.avatar){
            // throw new Error("No avatar found");
            return 0;
        }
        res.set("Content-Type","image/jpg");
        res.send(avatarUser.avatar);
    }
    catch(error){
        res.status(404).send("No Avatar Found");
    }
})



// check whether user is old user or not (authenticating email,pass)
router.post("/users/isOldUser",async (req,res)=>{
    try{
        const isOldUser = await User.checkLoginCredentials(req.body.email,req.body.pass);
        console.log(isOldUser);
        if(isOldUser){

            return res.send(isOldUser);
        }
        res.status(400).send("Authentication failed");
    }
    catch(error){
        res.status(400).send("Authentication Failed");
    }
})




// console.log(User.countDocuments({fullname:"Arindam Halder"}));
// User.findByIdAndUpdate("61eab8ebefa4005eefa0cfee",{fullname: "Nobita Nobi"}).then((result)=>{
//     console.log(result);
//     return User.countDocuments({fullname:"Arindam Halder"})
// }).then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
// })

// counting a particular thing in db ===============================
// app.countDocuments({ fullname: "Souvik Naskar" }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })



module.exports = router;