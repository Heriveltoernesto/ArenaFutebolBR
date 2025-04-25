async function carregarJogos(competicao) {
  const container = document.getElementById('jogos-container');
  container.innerHTML = "<p class='text-gray-500'>Carregando...</p>";

  const ano = new Date().getFullYear();
  let url = '';

  if (competicao === 'copa-do-brasil') {
    url = `https://arenafutebolbr.vercel.app/api/jogos/copa-do-brasil?ano=${ano}`;
  } else {
    url = `https://arenafutebolbr.vercel.app/api/jogos?competicao=${competicao}&ano=${ano}`;
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
    console.error('Erro ao buscar jogos:', e);
    container.innerHTML = "<p class='text-red-600'>Erro ao carregar jogos.</p>";
  }
}
function carregarJogos(competicao) {
    const url = competicao === 'copa-do-brasil'
        ? '/api/jogos/copa-do-brasil'
        : `/api/jogos?competicao=${competicao}`;

    fetch(url)
        .then(res => res.json())
        .then(jogos => {
            const container = document.getElementById('jogos-container');
            container.innerHTML = '';

            jogos.forEach(jogo => {
                container.innerHTML += `
                    <div class="bg-white p-4 rounded shadow">
                        <h4 class="font-bold">${jogo.mandante} ${jogo.gols_mandante ?? "-"} x ${jogo.gols_visitante ?? "-"} ${jogo.visitante}</h4>
                        <p>${jogo.dia_semana}, ${jogo.data} às ${jogo.hora}</p>
                        <p class="text-sm text-gray-500">${jogo.estadio}, ${jogo.cidade}/${jogo.uf}</p>
                    </div>
                `;
            });
        });
}
