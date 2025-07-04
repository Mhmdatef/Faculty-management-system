const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodeMailer.createTransport({
    secure: false, 
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'Movie Reservation System <hello@3atef.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);    
        throw error; 
    }
};

module.exports = sendEmail;
