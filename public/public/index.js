const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/resultados", require("./routes/resultados"));
app.use("/palpites", require("./routes/palpites"));
app.use("/ranking", require("./routes/ranking"));

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
