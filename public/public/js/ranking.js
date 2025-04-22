function carregarRanking() {
  const container = document.getElementById("rankingData");
  container.innerHTML = "Carregando ranking...";
  const express = require("express");
const router = express.Router();
const db = require("../../../project/db");

router.get("/", (req, res) => {
  db.query("SELECT usuario, foto_perfil, pontos FROM Palpites ORDER BY pontos DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;


  // Ranking fixo de exemplo (pode ser trocado por API)
  const esportes = [
    { nome: "Futebol", pontos: 98 },
    { nome: "Basquete", pontos: 91 },
    { nome: "Tênis", pontos: 87 },
    { nome: "Automobilismo", pontos: 80 },
  ];

  const html = esportes.map(e =>
    `<li>${e.nome}: ${e.pontos} pts</li>`
  ).join("");

  container.innerHTML = `<ul>${html}</ul>`;
}
