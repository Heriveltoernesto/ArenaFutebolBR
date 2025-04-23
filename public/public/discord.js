// server/discord.js
import axios from "axios";

export async function enviarDiscord(msg) {
  await axios.post(process.env.DISCORD_WEBHOOK, {
    content: msg
  });
}
