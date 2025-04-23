// Firebase admin SDK
import admin from "firebase-admin";
import serviceAccount from "./chave-firebase.json" assert { type: "json" };

// Evita inicialização duplicada
if (!admin.apps.length) 
  admin.initializeApp
    credential: admin.credential.cert(serviceAccount)
    import { db } from "./server/firebase.js"; // ajuste o caminho se necessário
import { getDocs, collection } from "firebase/firestore";
import { buscarProximosJogos } from "./buscarProximosJogos.js";
import { enviarAlertaEmail } from "./alertas/email.js";
import { enviarAlertaDiscord } from "./alertas/discord.js";

async function verificarTodosJogos() {
  const snap = await getDocs(collection(db, "usuarios"));
  
  for (const docu of snap.docs) {
    const user = docu.data();
    const jogos = await buscarProximosJogos(user.timeFavorito);

    if (jogos.length > 0) {
      const jogo = jogos[0];
      await enviarAlertaEmail(user.email, user.nome, user.timeFavorito, jogo);
      await enviarAlertaDiscord(jogo, user);
      
      // Aqui você pode adicionar o alerta WhatsApp se tiver webhook
    }
  }
}

// Roda a função uma vez a cada 24 horas
setInterval(verificarTodosJogos, 1000 * 60 * 60 * 24);
const db = admin.firestore();
export { db };
