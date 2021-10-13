const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url, booking) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url || 'none';
        this.from = `Pedro Xavier <${process.env.EMAIL_FROM}>`;
        this.booking = booking;
    }
    
    newTransport() {
        
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }
        return nodemailer.createTransport({  
            host: process.env.EMAIL_HOST,
            //25, 587, 465
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }  
        });
    }

    async send(template, subject) {
        // send the actual email
        // render html based on pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
            booking: this.booking || 'placeholder'
        })
        // define email options 
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html)
            //html: 
        }
       // create transport and send email 
       await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', "We're happy to have you!");
    }
    async sendResetToken() {
        await this.send('forgotPasswordEmail', "Password reset request");
    }

    async sendReceipt() {
        await this.send('receipt', "We are preparing your order!");
    }
}
