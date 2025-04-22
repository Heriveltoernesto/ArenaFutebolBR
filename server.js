const express = require("express");
const cors = require("cors");
const resultadosRoutes = require("./routes/resultados.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/resultados", resultadosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
