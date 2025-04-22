require("dotenv").config();
const { Client, Intents } = require("discord.js");
const db = require("../../../project/db");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.once("ready", () => {
    console.log("🤖 Bot conectado ao Discord!");
});

client.on("messageCreate", (message) => {
    if (message.content === "!resultados") {
        db.query("SELECT * FROM Jogos", (err, results) => {
            if (err) {
                message.channel.send("❌ Erro ao buscar resultados.");
            } else {
                for (const jogo of results) {
                    const emoji = getSportEmoji(jogo.campeonato);
                    const msg = `${emoji} ${jogo.equipe1} ${jogo.placar1} x ${jogo.placar2} ${jogo.equipe2}`;
                    message.channel.send(msg);
                }
            }
        });
    }
});

// Função para atribuir emoji ao campeonato
function getSportEmoji(campeonato) {
    const nome = campeonato.toLowerCase();
    if (nome.includes("futebol") || nome.includes("liga")) return "⚽";
    if (nome.includes("basquete") || nome.includes("nba")) return "🏀";
    if (nome.includes("tênis")) return "🎾";
    if (nome.includes("automobilismo") || nome.includes("f1")) return "🏎️";
    return "🏆";
}

client.login(process.env.DISCORD_TOKEN);

