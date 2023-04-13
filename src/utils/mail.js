const sgMail = require('@sendgrid/mail')

require("dotenv").config({ path: `./src/env/dev.env`});

const sendWelcomeEmail = (email,verificationCode) => {
    console.log(verificationCode)
    return sgMail
    .send({
        to: email,
        from: 'sahil.k@antino.io',
        subject: 'Verify your email address',

        text: `Welcome to the voting system.`,
        // html:`Here, your link is : <a href=http://localhost:4000/api/update-password?token=${token}> update password <a/>`
       // html: `Here, your link is : <a href=http://localhost:4000/api/reset-password?token=${token}> reset password <a/>`
        html:  `Your verification code is: ${verificationCode}</a>`
    })

    .then(() => {
        console.log('`Verification code sent to user: ${verificationCode}`')
        return true;
    })
    .catch((error) => {
        console.log(error)
        return false;
      })
}

module.exports = {sendWelcomeEmail}
