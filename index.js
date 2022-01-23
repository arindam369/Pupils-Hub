const express = require("express")
const app = express();
require("./src/db/mongoose");
const User = require("./src/models/user");
const userRouter = require("./src/routers/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
// const fetch = require("node-fetch");
// const fetch = require("cross-fetch");
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




app.listen(port, () => {
    console.log("Server is running on port:3000");
})
app.use(userRouter);