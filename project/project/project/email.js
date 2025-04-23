// server/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function enviarAlertaEmail(destino, msg) {
  await transporter.sendMail({
    from: `"Arena Futebol BR" <${process.env.EMAIL_USER}>`,
    to: destino,
    subject: "🚨 Seu time vai jogar hoje!",
    text: msg
  });
}
