document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/resultados")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("results");
      let html = "";

      for (const jogo of data) {
        html += `
          <div class="placar-card">
            <div class="time">
              <span class="equipe">${jogo.equipe1}</span>
              <span class="placar">${jogo.placar1}</span>
            </div>
            <span class="versus">x</span>
            <div class="time">
              <span class="placar">${jogo.placar2}</span>
              <span class="equipe">${jogo.equipe2}</span>
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
    })
    .catch(error => console.error("Erro ao carregar resultados:", error));
});
app.use(express.static("public"));
function toggleMenu() {
  const nome = document.getElementById("nome")?.value || "";
  const nomeExiste = palpites.some(p => p.nome.toLowerCase() === nome.toLowerCase());

  if (nomeExiste) {
    alert("⚠️ Você já enviou um palpite!");
    return;
  }

  const menuItems = document.getElementById("menuItems");
  menuItems.style.display = menuItems.style.display === "none" ? "block" : "none";
}
// Instale antes com: npm install axios

const axios = require('axios');

// Configurações da requisição
const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/predictions',
  params: { fixture: '198772' }, // ID do jogo desejado
  headers: {
    'x-rapidapi-key': '392f57220emsh006430d9e5c55eap137dc2jsn1ff156a51516', // Substitua pela sua chave, se necessário
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};

// Função para buscar os dados
async function fetchPrediction() {
  try {
    const response = await axios.request(options);
    console.log("✅ Dados recebidos:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ Erro ao buscar dados da API:");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Executar a função
fetchPrediction();
