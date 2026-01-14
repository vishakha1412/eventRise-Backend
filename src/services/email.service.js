import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendVerificationEmail = async ({ email, token }) => {

  const emailTemplateSource = fs.readFileSync(path.join(__dirname, "template.hbs"), "utf8");
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ token: encodeURIComponent(token) });

  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  console.log("Verification email link:", email);
  const transporter = nodemailer.createTransport({
  service: "gmail", // or configure: host, port, secure, auth for SMTP
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.MAIL_PASS,
  },
});
 

   transporter.sendMail({
    from: `"EventConnect" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Verify your email",
    html : htmlToSend
  },function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log("Email sent: "+ info.response);
    }
  });
};
