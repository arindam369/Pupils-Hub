const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASS
    }
});

const sendMail = (name,number,email,query) => {

    var mailOptions = {
        from: `${email}`,
        to: 'neophytesAdm@gmail.com',
        subject: `QUERY FROM ${name}`,
        html: `<h2>NAME: ${name}</h2><br><h2>CONTACT DETAILS: ${number}</h2><br><p style="color: red;"><b>QUERY:${query}</b></p>`
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

module.exports = sendMail;