const nodeEmailer = require('nodemailer');
const tls = require('tls');
require('dotenv').config();

module.exports = async (email, subject, html, text) => {
    
  try {
    const transporter = nodeEmailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        ciphers:'SSLv3'
    }
    });


    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Email not sent!');
    console.log(error);
    return error;
  }
};
