const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gojos8675@gmail.com',
        pass: '#GojoSatoru24'
    }
});

const hSendMail = (name, email, subject, message) => {
    const mailOptions = {
        from: `${name} <${email}>`,
        to: 'neophytesAdm@gmail.com',
        subject: `${subject}`,
        html: `<h4>${message}</h4><br><br><p> THANK YOU,</p><p>${name} < ${email} > </p>`

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

module.exports = hSendMail;
