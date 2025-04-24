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
async function montarFeed() {
async function buscarNoticias() {
    const resposta = await fetch("https://api.currentsapi.services/v1/latest-news?language=pt&category=sports", {
        headers: {
            "Authorization": "ad39ee3d04fc45788c1666dee8a23767"
        }
    });

    const dados = await resposta.json();
    return dados.news || [];
}
async function buscarVideos() {
    const resposta = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=futebol%20brasileiro&type=video&maxResults=5&key=SUA_YOUTUBE_API_KEY`);
    const dados = await resposta.json();
    return dados.items || [];
}
function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


  const container = document.getElementById('feedItems');
  container.innerHTML = '';

  combinados.forEach(item => {
    let html = '';
    if (item.tipo === 'noticia') {
      html = `
        <div class="w-full flex-shrink-0 p-4 bg-gray-800 rounded shadow h-full">
          <h2 class="text-xl font-bold">${item.dados.title}</h2>
          <p class="text-sm mt-2">${item.dados.description}</p>
          <a href="${item.dados.url}" target="_blank" class="text-blue-400 mt-2 inline-block">Leia mais</a>
        </div>`;
    } else {
      const videoId = item.dados.id.videoId;
      html = `
        <div class="w-full flex-shrink-0 p-4 bg-gray-800 rounded shadow h-full">
          <h2 class="text-xl font-bold">${item.dados.snippet.title}</h2>
          <iframe class="w-full mt-2 rounded" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        </div>`;
    }
    container.innerHTML += html;
  });

  // Auto slide
  let index = 0;
  const total = combinados.length;
  setInterval(() => {
    index = (index + 1) % total;
    container.style.transform = `translateX(-${index * 100}%)`;
  }, 5000); // troca a cada 5 segundos
}

async function fetchPrediction() {

}
