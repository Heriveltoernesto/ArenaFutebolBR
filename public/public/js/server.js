const express = require("express");
const path = require('path');
const db = require("../../../project/db");
const fetchData = require("../../../project/apifetcher");
const cors = require("cors");

const resultadosRouter = require("./routes/resultados");

// Configurar middleware
app.use(express.static(path.join(__dirname, "public")));
app.use("/resultados", resultadosRouter);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/resultados", (req, res) => {
    const sql = "SELECT * FROM Jogos";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send("Erro ao buscar jogos");
        } else {
            res.json(results);
        }
    });
});

app.get("/atualizar-jogos", async (req, res) => {
    await fetchData();
    res.send("Jogos atualizados!");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get("/ranking", (req, res) => {
    const sql = "SELECT * FROM Palpites ORDER BY pontos DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send("Erro ao buscar ranking");
        res.json(results);
    });
});

app.get("/videos", (req, res) => {
    // Exemplo fixo, ideal seria vir de um banco ou API
    res.json([
        { titulo: "Golaços da Rodada", url: "https://www.youtube.com/embed/example1" },
        { titulo: "Top 5 defesas", url: "https://www.youtube.com/embed/example2" }
    ]);
});

app.get("/radios", (req, res) => {
    res.json([
        { nome: "Rádio Esporte 1", stream: "https://stream.radio1.com" },
        { nome: "Rádio Gol", stream: "https://stream.radio2.com" }
    ]);
});


// Atualiza a cada 30 segundos
setInterval(fetchData,  30 * 1000);