const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'learningpurpose2g21@gmail.com',
    pass: 'qweqwe12#'
  }
}));

module.exports = (recipient, otp) => {
  const mailOptions = {
    from: 'learningpurpose2g21@gmail.com',
    to: recipient,
    subject: 'OTP for account verification',
    text: 'Please enter this code: ' + otp + ' to verify your account'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent to ' + recipient + ' info: ' + info.response);
    }
  });
}