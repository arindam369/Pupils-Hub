const express = require("express")
const app = express();
require("./src/db/mongoose");
const User = require("./src/models/user");
const userRouter = require("./src/routers/user");
const applicantRouter = require("./src/routers/applicant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const auth = require("./src/middleware/auth");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 3000;

app.use(bodyParser());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
// app.use(userRouter);

const SECRET = "This is my little secret";
const myFunc = async ()=>{
    const token = jwt.sign({_id:"12345abcde"},SECRET,{expiresIn:"1 min"});
    // console.log(token);

    const data = jwt.verify(token,SECRET);
    console.log(data);
}
// myFunc();



// ----------------------------------------------------------

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/login", (req, res) => {
    res.render("signup-login");
})

app.get("/sDashboard", auth, (req, res) => {
    res.render("student/sProfile");
});

app.get("/sApplication", (req, res) => {
    res.render("student/sApplication");
})
app.get("/sHelp", (req, res) => {
    res.render("student/sHelp");
    console.log(`browser generated cookie : ${req.cookies.Pupils_Hub}`);
})
app.get("/sSettings", (req, res) => {
    res.render("student/sSettings");
})



app.get("/aDashboard",(req,res)=>{
    res.render("admin/aProfile");
})
app.get("/aPending",(req,res)=>{
    res.render("admin/aPending");
})
app.get("/aHostel1",(req,res)=>{
    res.render("admin/Hostel1");
})
app.get("/aHostel2",(req,res)=>{
    res.render("admin/Hostel2");
})
app.get("/aHostel3",(req,res)=>{
    res.render("admin/Hostel3");
})
app.get("/aSettings",(req,res)=>{
    res.render("admin/aSettings");
})




app.listen(port, () => {
    console.log("Server is running on port:3000");
})
app.use(userRouter);
app.use(applicantRouter);