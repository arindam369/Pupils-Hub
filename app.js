const express = require("express")
const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("signup-login");
})

app.get("/sDashboard",(req,res)=>{
    res.render("student/sProfile");
})
app.get("/sApplication",(req,res)=>{
    res.render("student/sApplication");
})
app.get("/sHelp",(req,res)=>{
    res.render("student/sHelp");
})
app.get("/sSettings",(req,res)=>{
    res.render("student/sSettings");
})

app.listen(3000,()=>{
    console.log("Server is running on port:3000");
})