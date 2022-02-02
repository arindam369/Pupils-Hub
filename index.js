require("dotenv").config();
const express = require("express")
const app = express();
require("./src/db/mongoose");
const userRouter = require("./src/routers/user");
const applicantRouter = require("./src/routers/applicant");
const hosteliteRouter = require("./src/routers/hostelite");
const adminRouter = require("./src/routers/admin");
const announcementRouter = require("./src/routers/announcement");
const bodyParser = require("body-parser");
const auth = require("./src/middleware/auth");
const adminAuth = require("./src/middleware/adminAuth");
const cookieParser = require("cookie-parser");
const sendMail = require('./src/routers/mail');
const sSendMail = require('./src/routers/signup_mail');
const hSendMail = require('./src/routers/helpmail');
const singlesendMail = require('./src/routers/singleMail');
const sharingsendMail = require('./src/routers/sharingMail');
const h1SendMail = require('./src/routers/h1');
const h2SendMail = require('./src/routers/h2');
const h3SendMail = require('./src/routers/h3');
const deleteMail = require('./src/routers/deleteMail');
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");


const port = process.env.PORT || 3000;

app.use(bodyParser());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());

const SECRET = process.env.SECRET_KEY;


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
    res.render("admin/hostel1");
})
app.get("/aHostel2",adminAuth ,(req,res)=>{
    res.render("admin/hostel2");
})
app.get("/aHostel3",adminAuth,(req,res)=>{
    res.render("admin/hostel3");
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
app.get("/teams",(req,res)=>{
    res.render("our-teams");
})
app.get("/hostels",(req,res)=>{
    res.render("exploreHostels");
})
app.get("/terms",(req,res)=>{
    res.render("terms");
})
app.get("/faq",(req,res)=>{
    res.render("faq");
})
app.get("/privacy",(req,res)=>{
    res.render("privacy");
})


// mail via nodemailer (homepage) :
app.post('/email', (req, res) => {
    console.log('Data: ', req.body);
    const { name, number, email, query } = req.body;
    sendMail(
        name, number, email, query
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
app.post('/h1', (req, res) => {
    const { recipientName, recipientEmail } = req.body;
    h1SendMail(
        recipientName, recipientEmail
    )
})
app.post('/h2', (req, res) => {
    const { recipientName, recipientEmail } = req.body;
    h2SendMail(
        recipientName, recipientEmail
    )
})
app.post('/h3', (req, res) => {
    const { recipientName, recipientEmail } = req.body;
    h3SendMail(
        recipientName, recipientEmail
    )
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
app.use(userRouter);
app.use(applicantRouter);
app.use(adminRouter);
app.use(hosteliteRouter);
app.use(announcementRouter);


// ============================ razorpay ===============================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    // key_id: "rzp_test_Dc8k9akyGMSOgx",
    key_secret: process.env.RAZORPAY_KEY_SECRET
    // key_secret: "Zb6BGm9DWG5j2NRpGesk8unw"
})

app.set('views', 'views')
app.get('/payment', (req, res) => {
    res.redirect("/sDashboard");
})
app.post('/order', (req, res) => {

    let options = {
        amount: 5000 * 100,
        currency: "INR"
    };

    razorpay.orders.create(options, (err, order) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        console.log(order);
        res.json(order);
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
                    pass: process.env.GOJO_MAIL_PASS
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