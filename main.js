document.addEventListener("DOMContentLoaded", () => {
   fetch('http://localhost:5000/api/jogos?competicao=serie-a&ano=2025')
  .then(res => res.json())
  .then(data => {
    console.log(data); // Mostra no console
    // Aqui você pode popular a página
  });
      const container = document.getElementById("results");
      container.innerHTML = dados.map(jogo => `
        <div class="placar-card">
          <div>${jogo.equipe1} ${jogo.placar1} x ${jogo.placar2} ${jogo.equipe2}</div>
          <small>${new Date(jogo.data).toLocaleString()}</small>
        </div>
      `).join('');
    })
    .catch(err => console.error("Erro:", err));
