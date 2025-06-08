import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
export const sendEmail = async (to, subject, html) => {
  try {
    console.log(to,subject,html);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
  }

};
