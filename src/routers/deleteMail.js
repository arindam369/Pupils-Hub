const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'neophytesAdm@gmail.com',
        pass: 'nobita&sizuka2'
    }
});

const deleteMail = (name, email) => {

    var mailOptions = {
        from: 'Pupils\' Hub <neophytesAdm@gmail.com>',
        to: `${email}`,
        subject: `APPLICATION REJECTED`,
        html: `<div>
        <h2>Your Application to Pupils\' Hub has been REJECTED !!!</h2>
        </div>
        <div>
        <h4>${name},</h4>
        <p>
            With  
        </p>
        </div>
        <br>
        
        <p>For any further queries, you can contact us via:<br>
        Email: neophytesAdm@gmail.com<br>
        Phone: 9876543211<br>
        Whatsapp: 9876543456
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

module.exports = deleteMail;