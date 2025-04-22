require("dotenv").config();
const axios = require("axios");
const db = require("./db");

const API_KEY = process.env.API_KEY || "ad39ee3d04fc45788c1666dee8a23767";

const options = {
  method: "GET",
  url: "https://rapidapi.com/api-sports/api/api-football",
  params: {
    date: new Date().toISOString().split("T")[0], // Jogos do dia atual
    timezone: "America/Sao_Paulo"
  },
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "https://rapidapi.com/api-sports/api/api-football"
  }
};
const fetchData = async () => {
  try {
    const response = await axios.request(options);
    console.log("🔍Dados brutos da API:",response.data);
    
    const games = response.data?.response;

    if (!Array.isArray(games)) {
        console.log("❌ Resposta inesperada da API:", response.data);
      throw new Error("Formato de dados inesperado da API.");
    }

    for (const game of games) {
      const {
        fixture: { date },
        league: { name: championship },
        teams: { home, away },
        goals
      } = game;

      const sql = `
        INSERT INTO Jogos (campeonato, equipe1, equipe2, placar1, placar2, data_jogo)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          championship,
          home.name,
          away.name,
          goals.home ?? 0,
          goals.away ?? 0,
          date
        ],
        (err) => {
          if (err) {
            console.error("Erro ao salvar jogo no banco de dados:", err);
          } else {
            console.log("✅ Jogo salvo no banco de dados!");
          }
        }
      );
    }
  } catch (error) {
    console.error("❌ Erro ao buscar dados da API:", error.message);
  }
};
module.exports = fetchData;
