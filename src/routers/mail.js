const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: 'c0f308770e55cc02b4f2adb29b75039c-054ba6b6-28c7c9fc',
        domain: 'sandbox2c15d151ef014490b33f7d28f2d5bbba.mailgun.org',
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (name, number, email, query) => {
    const mailOptions = {
        from: email,
        to: 'neophytesAdm@gmail.com',
        subject: `QUERY FROM ${name}`,
        html: `<h2>NAME: ${name}</h2><br><h2>CONTACT DETAILS: ${number}</h2><br><p style="color: red;"><b>QUERY:${query}</b></p>`
    }
     transporter.sendMail(mailOptions)
}

module.exports=sendMail;