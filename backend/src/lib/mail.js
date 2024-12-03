import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });


    const emailOptions = {
        from  : {
            name : 'ChittChatt',
            address : process.env.EMAIL
        },
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    try {
        await transporter.sendMail(emailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}



