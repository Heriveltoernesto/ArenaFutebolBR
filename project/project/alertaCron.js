// server/alertaCron.js
import cron from "node-cron";
import { db } from "./firebase.js";
import axios from "axios";
import { enviarAlertaEmail } from "./email.js";
import { enviarWhatsapp } from "./whatsapp.js";
import { enviarDiscord } from "./discord.js";

// Executa a cada dia às 9h
cron.schedule("0 9 * * *", async () => {
  const usuariosSnap = await db.collection("usuarios").get();

  for (const doc of usuariosSnap.docs) {
    const usuario = doc.data();
    const time = usuario.timeFavorito;

    const { data } = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${time}`);

    const hoje = new Date().toISOString().split("T")[0];

    const jogosHoje = data.event?.filter(e => e.dateEvent === hoje);
    if (jogosHoje?.length > 0) {
      const msg = `⚽ Olá ${usuario.nome}, o ${time} joga hoje! Não perca!\n🏟️ ${jogosHoje[0].strVenue}`;
      await enviarAlertaEmail(usuario.email, msg);
      await enviarWhatsapp(usuario.whatsapp, msg);
      await enviarDiscord(msg);
    }
  }

  console.log("✅ Alertas enviados");
});
