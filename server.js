// server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Pasta para salvar dados dos palpites
const palpitesPath = './data/palpites.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(palpitesPath)) fs.writeFileSync(palpitesPath, '[]');

// Multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Salva palpites
app.post('/api/palpites', upload.single('foto'), (req, res) => {
  const { nome, palpite, time } = req.body;
  const foto = req.file?.filename || null;

  const palpites = JSON.parse(fs.readFileSync(palpitesPath));
  const jaExiste = palpites.find(p => p.nome.toLowerCase() === nome.toLowerCase());
  if (jaExiste) return res.status(400).json({ error: 'Usuário já enviou palpite!' });

  const novoPalpite = { nome, palpite, time, foto, data: new Date() };
  palpites.push(novoPalpite);
  fs.writeFileSync(palpitesPath, JSON.stringify(palpites, null, 2));

  res.status(200).json({ success: true });
});

// Lista palpites
app.get('/api/palpites', (req, res) => {
  const palpites = JSON.parse(fs.readFileSync(palpitesPath));
  res.json(palpites);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// Adiciona essa nova rota antes do app.listen()

app.get('/api/jogos', (req, res) => {
  const { competicao } = req.query;

  // Aqui você pode personalizar os dados conforme a competição recebida
  const jogos = [
    {
      mandante: "Flamengo",
      visitante: "Palmeiras",
      gols_mandante: 2,
      gols_visitante: 1,
      dia_semana: "Domingo",
      data: "28/04/2025",
      hora: "16:00",
      estadio: "Maracanã",
      cidade: "Rio de Janeiro",
      uf: "RJ"
    },
    {
      mandante: "Grêmio",
      visitante: "Cruzeiro",
      gols_mandante: null,
      gols_visitante: null,
      dia_semana: "Sábado",
      data: "27/04/2025",
      hora: "18:30",
      estadio: "Arena do Grêmio",
      cidade: "Porto Alegre",
      uf: "RS"
    }
  ];

  res.json(jogos);
});
