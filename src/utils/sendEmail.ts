import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "h7wp3own74eh73vs@ethereal.email", // generated ethereal user
      pass: "5PsHtUkXRvGh9qRTfV", // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: "Lireddit Bot <noreply@lireddit.com>", // sender address
    to, // list of receivers
    subject, // "Change Password", // Subject line
    html: html, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
