import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  //1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAILL_HOST,
    port: process.env.EMAIL_PORT, //if secure true post 465 else if false port 487 ,
    secure: true,
    secureConnection: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //2) define email options
  const mailOptions = {
    from: `E-shop<${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3) send emial
  await transporter.sendMail(mailOptions);
};
