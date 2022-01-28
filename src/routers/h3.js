const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASS
    }
});

const h3SendMail = (name, email) => {

    var mailOptions = {
        from: 'Pupils\' Hub <neophytesAdm@gmail.com>',
        to: `${email}`,
        subject: `HURRAY !! Hostel Allocated`,
        html: `<div>
        <h2>Welcome To Pupils\' Hub</h2>
        </div>
        <div>
        <h4>Hello ${name},</h4>
        <p>
        Your application has been accepted and after the payment received from your end, we've allocated you <b>HOSTEL 3</b>. You can enquire about your room no. on your arrival at the hostel. Your room will be ready by tomorrow and we will await your arrival.
        </p>
        </div>
        <br>
        
        <p>For any further queries, you can contact us via:<br>
        Email: neophytesAdm@gmail.com<br>
        Phone: 9876543210<br>
        Whatsapp: 9876543210
        </p>`
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = h3SendMail;