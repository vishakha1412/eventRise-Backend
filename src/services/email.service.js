import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendVerificationEmail = async ({ email, token, role }) => {
  try {
    // Load and compile Handlebars template
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf8"
    );
    const template = handlebars.compile(emailTemplateSource);

    // Construct verification link based on role
    let link;
if (role === "eventorganiser") {
      link = `${process.env.SERVER_URL}/api/auth/organiser/verify-email?token=${token}`;
    } else {
      link = `${process.env.SERVER_URL}/api/auth/verify-email?token=${token}`;
    }

    // Pass link into template
    const htmlToSend = template({ link });

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or configure SMTP host/port if not using Gmail
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.MAIL_PASS, // Gmail App Password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"EventConnect" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      html: htmlToSend,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
