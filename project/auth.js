// js/auth.js
import { auth, provider, db } from './firebase-init.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.getElementById("btnLogin").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const timeFavorito = prompt("Qual seu time do coração?");
    const whatsapp = prompt("Número WhatsApp para alertas (com DDD):");

    await setDoc(doc(db, "usuarios", user.uid), {
      nome: user.displayName,
      email: user.email,
      timeFavorito: timeFavorito,
      whatsapp: whatsapp,
      notificacoes: {
        email: true,
        whatsapp: true,
        discord: false
      }
    });

    alert("✅ Cadastro salvo com sucesso!");
  } catch (error) {
    console.error(error);
    alert("Erro ao fazer login.");
  }
});
