const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASS
    }
});

const sSendMail = (name, email) => {

    var mailOptions = {
        from: 'Pupils\' Hub <neophytesAdm@gmail.com>',
        to: `${email}`,
        subject: `WELCOME TO PUPILS\' HUB`,
        html: `<div>
        <h2>Welcome To Pupils\' Hub</h2>
        </div>
        <div>
        <h4>Hello ${name},</h4>
        <p>You are among the earliest members to join the community. Check out our hostels in Saltlake, Kolkata where we provide <br>quality living at reasonable price. You can find more about us from our <a href="https://pupils-hub.herokuapp.com/faq">Frequently Asked Questions</a> section.<br> <a href="https://pupils-hub.herokuapp.com/login">Log in</a> for more information. 
        </p>
        </div>
        <br>
        
        <p>For any further queries, you can contact us via:<br>
        Email: neophytesAdm@gmail.com<br>
        Phone: 9876543210<br>
        Whatsapp: 9876543210
</p>
`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = sSendMail;
