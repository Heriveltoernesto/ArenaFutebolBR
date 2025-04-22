const express = require("express");
const router = express.Router();
const db = require("../project/project/project/db");

router.get("/", (req, res) => {
  const { inicio, fim, time, ordem, campeonato, estadio, placarMin, placarMax } = req.query;

  let sql = "SELECT * FROM Jogos";
  const conditions = [];
  const params = [];

  // Filtros por data
  if (inicio && fim) {
    conditions.push("data BETWEEN ? AND ?");
    params.push(inicio, fim);
  } else if (inicio) {
    conditions.push("data >= ?");
    params.push(inicio);
  } else if (fim) {
    conditions.push("data <= ?");
    params.push(fim);
  }

  // Filtro por time
  if (time) {
    conditions.push("(time_casa = ? OR time_fora = ?)");
    params.push(time, time);
  }

  // Filtro por campeonato
  if (campeonato) {
    conditions.push("campeonato = ?");
    params.push(campeonato);
  }

  // Filtro por estádio
  if (estadio) {
    conditions.push("estadio = ?");
    params.push(estadio);
  }

  // Filtro por placar total
  if (placarMin && placarMax) {
    conditions.push("(placar_casa + placar_fora BETWEEN ? AND ?)");
    params.push(parseInt(placarMin), parseInt(placarMax));
  } else if (placarMin) {
    conditions.push("(placar_casa + placar_fora >= ?)");
    params.push(parseInt(placarMin));
  } else if (placarMax) {
    conditions.push("(placar_casa + placar_fora <= ?)");
    params.push(parseInt(placarMax));
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const ordemSql = ordem && ordem.toUpperCase() === "ASC" ? "ASC" : "DESC";
  sql += ` ORDER BY data ${ordemSql}`;

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      const dia = String(d.getDate()).padStart(2, "0");
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    };

    const formatado = results.map(jogo => ({
      jogo: `${jogo.time_casa} ${jogo.placar_casa} x ${jogo.placar_fora} ${jogo.time_fora}`,
      data: formatDate(jogo.data),
      campeonato: jogo.campeonato,
      estadio: jogo.estadio,
      placas: jogo.placas
    }));

    res.json(formatado);
  });
});

module.exports = router;
