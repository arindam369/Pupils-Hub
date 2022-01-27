require("dotenv").config();
const express = require("express")
const app = express();
require("./src/db/mongoose");
const User = require("./src/models/user");
const userRouter = require("./src/routers/user");
const applicantRouter = require("./src/routers/applicant");
const hosteliteRouter = require("./src/routers/hostelite");
const adminRouter = require("./src/routers/admin");
const announcementRouter = require("./src/routers/announcement");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const auth = require("./src/middleware/auth");
const cookieParser = require("cookie-parser");
const sendMail = require('./src/routers/mail');
const sSendMail = require('./src/routers/signup_mail');
const hSendMail = require('./src/routers/helpmail');
const singlesendMail = require('./src/routers/singleMail');
const sharingsendMail = require('./src/routers/sharingMail');
const deleteMail = require('./src/routers/deleteMail');

const adminAuth = require("./src/middleware/adminAuth");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");


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
app.get("/sAnnouncement", auth,(req,res)=>{
    res.render("student/sAnnouncement");
})
app.get("/sApplication",auth, (req, res) => {
    res.render("student/sApplication");
})
app.get("/sHelp",auth, (req, res) => {
    res.render("student/sHelp");
    console.log(`browser generated cookie : ${req.cookies.Pupils_Hub}`);
})
app.get("/sSettings",auth, (req, res) => {
    res.render("student/sSettings");
})


app.get("/aLogin",(req,res)=>{
    res.render("admin-login");
})

app.get("/aDashboard", adminAuth,(req,res)=>{
    res.render("admin/aProfile");
})
app.get("/aCreate", adminAuth,(req,res)=>{
    res.render("admin/aCreate");
})
app.get("/aAnnouncement", adminAuth,(req,res)=>{
    res.render("admin/aAnnouncement");
})
app.get("/aPending",adminAuth,(req,res)=>{
    res.render("admin/aPending");
})
app.get("/aHostel1",adminAuth,(req,res)=>{
    res.render("admin/Hostel1");
})
app.get("/aHostel2",adminAuth ,(req,res)=>{
    res.render("admin/Hostel2");
})
app.get("/aHostel3",adminAuth,(req,res)=>{
    res.render("admin/Hostel3");
})
app.get("/aUpdateHostelites",adminAuth,(req,res)=>{
    res.render("admin/aHostelites");
})
app.get("/aSettings",adminAuth,(req,res)=>{
    res.render("admin/aSettings");
})
app.get("/meals",(req,res)=>{
    res.render("meal-plan");
})



// mail via nodemailer (homepage) :
app.post('/email', (req, res) => {
    console.log('Data: ', req.body);
    const { name, number, email, query } = req.body;
    sendMail(
        name, number, email, query
        // function (err, data) {
        //     if (err) {
        //         res.status(500).json({ message: 'Internal Error!!' })
        //     }
        //     else {
        //         res.json({ message: 'Message received' })
        //     }
        // })
    )
})


app.post('/sEmail', (req, res) => {
    console.log('Data: ', req.body);
    const { name, email } = req.body;
    sSendMail(
        name, email
    )
})

app.post('/helpmail', (req, res) => {
    const { name, email, subject, message } = req.body;
    hSendMail(
        name, email, subject, message
    )
})
app.post('/reject', (req, res) => {
    const { recipientName, recipientEmail } = req.body;
    deleteMail(
        recipientName, recipientEmail
    )
})

app.post('/sSingle', (req, res) => {
    const { recipientName, recipientEmail } = req.body;
    singlesendMail(
        recipientName, recipientEmail
    )
})

app.post('/sSharing', (req, res) => {
    const { recipientName, recipientEmail } = req.body;
    sharingsendMail(
        recipientName, recipientEmail
    )
})


app.listen(port, () => {
    console.log("Server is running on port:3000");
})
app.use(userRouter);
app.use(applicantRouter);
app.use(adminRouter);
app.use(hosteliteRouter);
app.use(announcementRouter);



// ============================ razorpay ===============================

//store this in the database
// {
//     "razorpay_payment_id": "pay_29QQoUBi66xm2f",
//     "razorpay_order_id": "order_9A33XWu170gUtm",
//     "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
// }

const razorpay = new Razorpay({
    key_id: 'rzp_test_Dc8k9akyGMSOgx',
    key_secret: 'Zb6BGm9DWG5j2NRpGesk8unw'
})

app.set('views', 'views')

app.get('/payment', (req, res) => {
    res.redirect("/sDashboard");
})

app.post('/order', (req, res) => {

    let options = {
        amount: 5000 * 100,
        currency: "INR"
        // receipt: uniqueID(),
    };

    razorpay.orders.create(options, (err, order) => {
        // order_id_var=order.id
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        console.log(order)
        // orderId = order.id
        res.json(order)
    })
})

// function displayconfirmed() {
//     const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//             confirmButton: 'btn btn-success',
//             cancelButton: 'btn btn-danger'
//         },
//         buttonsStyling: false
//     })
//     swalWithBootstrapButtons.fire({
//         title: 'Payment Successful!!',
//         text: "Your transaction was successful",
//         icon: 'success',
//         showCancelButton: true,
//         confirmButtonText: 'Download invoice',
//         cancelButtonText: 'Back',
//         reverseButtons: true
//     }).then((result) => {
//         if (result.isConfirmed) {
//             swalWithBootstrapButtons.fire(
//                 'Invoice generation successful!',
//                 'success'
//             )
//         } else if (
//             /* Read more about handling dismissals below */
//             result.dismiss === Swal.DismissReason.cancel
//         ) {
//             swalWithBootstrapButtons.fire(
//                 //nothing
//             )
//         }
//     })
// }

app.post('/is-order-completed', (req, res) => {

    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {

        console.log(paymentDocument)
        if (paymentDocument.status == 'captured') {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'gojos8675@gmail.com',
                    pass: '#GojoSatoru24'
                }
            });
            var mailOptions = {
                from: "gojos8675@gmail.com",
                to: `neophytesAdm@gmail.com,${paymentDocument.email}`,
                subject: `NO REPLY: Payment done for ${paymentDocument.email}`,
                html: `<h3 style="color: red;">Payment of Rs. ${paymentDocument.amount / 100} Successful for ${paymentDocument.email} and ${paymentDocument.contact} via ${paymentDocument.method} for the current month</h3>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Email sent: ' + info.response)
                }
            })

            // displayconfirmed();

            res.redirect('/payment');
        }
        else
            res.redirect('/payment')
    })
})