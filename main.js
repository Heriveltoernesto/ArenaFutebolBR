document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/resultados")
    .then(res => res.json())
    .then(dados => {
      const container = document.getElementById("results");
      container.innerHTML = dados.map(jogo => `
        <div class="placar-card">
          <div>${jogo.equipe1} ${jogo.placar1} x ${jogo.placar2} ${jogo.equipe2}</div>
          <small>${new Date(jogo.data).toLocaleString()}</small>
        </div>
      `).join('');
    })
    .catch(err => console.error("Erro:", err));
});
