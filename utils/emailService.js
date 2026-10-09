const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // For demo purposes using a fake SMTP or just logging
    // To make this real, User needs to provide SMTP credentials in .env

    // Check if we have credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("No Email Credentials in .env. Logging email instead:");
        console.log(`To: ${to}, Subject: ${subject}, Body: ${text}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or configured host/port
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email send failed:", error);
    }
};

module.exports = sendEmail;
