// server/whatsapp.js
import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function enviarWhatsapp(numero, msg) {
  await client.messages.create({
    from: "whatsapp:+14155238886",
    to: `whatsapp:${numero}`,
    body: msg
  });
}
