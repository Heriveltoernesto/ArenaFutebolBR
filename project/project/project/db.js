const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "arenafutebolbr",
  charset: "utf8mb4"
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});
async function buscarProximosJogos(timeFavorito) {
  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(timeFavorito)}`);
    const data = await response.json();

    if (!data.teams) return null;
    
    const teamId = data.teams[0].idTeam;

    const jogos = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`);
    const dadosJogos = await jogos.json();

    return dadosJogos.events || [];
  } catch (err) {
    console.error("Erro ao buscar jogos:", err);
    return [];
  }
}
async function enviarAlertaDiscord(jogo, user) {
  const webhookURL = "https://discord.com/api/webhooks/SEU_ID/SEU_TOKEN";

  const msg = {
    content: `⚽ Atenção ${user.nome}! Seu time **${user.timeFavorito}** jogará contra **${jogo.strAwayTeam || jogo.strHomeTeam}** dia ${jogo.dateEvent} às ${jogo.strTime}`
  };

  await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  });
}
const auth = getAuth(app);
const db = getFirestore(app);

// Login com Google
function loginGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then(async result => {
    const user = result.user;
    const usuarioDoc = doc(db, "usuarios", user.uid);

    await setDoc(usuarioDoc, {
      nome: user.displayName,
      email: user.email,
      timeFavorito: "Flamengo" // ou selecionado em form
    });

    alert(`Bem-vindo, ${user.displayName}!`);
  });
}
const accountSid = 'SEU_SID';
const authToken = 'SEU_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    from: 'whatsapp:+14155238886',
    body: '⚽ Seu time vai jogar hoje!',
    to: 'whatsapp:+55SEUNUMERO'
  })
  .then(message => console.log(message.sid));


module.exports = connection;
