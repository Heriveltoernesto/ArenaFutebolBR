async function carregarJogos(competicao) {
  const container = document.getElementById('jogos-container');
  container.innerHTML = "<p class='text-gray-500'>Carregando...</p>";

  let url = '';
  const ano = new Date().getFullYear();

  if (competicao === 'copa-do-brasil') {
    url = `http://localhost:5000/api/jogos/copa-do-brasil?ano=${ano}`;
  } else {
    url = `http://localhost:5000/api/jogos?competicao=${competicao}&ano=${ano}`;
  }

  try {
    const res = await fetch(url);
    const jogos = await res.json();

    if (!jogos.length) {
      container.innerHTML = "<p class='text-red-500'>Nenhum jogo encontrado.</p>";
      return;
    }

    container.innerHTML = jogos.map(jogo => `
      <div class="bg-white p-4 rounded shadow">
        <p class="font-bold">${jogo.mandante} ${jogo.placar} ${jogo.visitante}</p>
        <p class="text-sm text-gray-600">${jogo.data} às ${jogo.hora} - ${jogo.estadio}, ${jogo.cidade}/${jogo.uf}</p>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = "<p class='text-red-600'>Erro ao carregar jogos.</p>";
    console.error(e);
  }
}
