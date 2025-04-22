const palpites = [];

const carregarPalpites = () => {
  const form = document.getElementById("palpiteForm");
  const listaRanking = document.getElementById("rankingPalpites");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const palpite = form.palpite.value.trim();
    const foto = form.foto.files[0];

    // 🔒 Verificação se nome já existe
    const nomeExiste = palpites.some(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (nomeExiste) {
      alert("⚠️ Você já enviou um palpite!");
      return;
    }

    if (!nome || !palpite || !foto) {
      alert("Preencha todos os campos e envie uma foto.");
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      const fotoUrl = leitor.result;
      const acertos = Math.floor(Math.random() * 10); // Simula acertos aleatórios

      const novoPalpite = {
        nome,
        palpite,
        foto: fotoUrl,
        acertos
      };

      palpites.push(novoPalpite);
      atualizarRanking();
      enviarParaDiscord(novoPalpite);
      form.reset();
    };

    leitor.readAsDataURL(foto);
  });

  const atualizarRanking = () => {
    const ordenado = palpites.sort((a, b) => b.acertos - a.acertos);
    const html = ordenado.map((p) => {
      let nivel = "🟡 Juvenil do Palpite";
      let destaque = "";

      if (p.acertos >= 7) {
        nivel = "👑 Rei do Palpite";
        destaque = "destaque-rei";
      } else if (p.acertos >= 4) {
        nivel = "🟢 Craque do Palpite";
        destaque = "destaque-craque";
      }

      return `
        <div class="palpite-card ${destaque}">
          <img src="${p.foto}" alt="${p.nome}" class="palpite-foto">
          <div>
            <p><strong>${p.nome}</strong> — ${nivel}</p>
            <p>🎯 Palpite: ${p.palpite}</p>
            <p>✅ Acertos: ${p.acertos}</p>
          </div>
        </div>
      `;
    }).join("");

    listaRanking.innerHTML = html;
  };

  const enviarParaDiscord = (palpite) => {
    fetch("http://localhost:3000/enviar-discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(palpite)
    })
      .then(() => {
        console.log("Palpite enviado ao Discord!");
        alert("✅ Palpite enviado com sucesso ao Discord!");
      })
      .catch((err) => {
        console.error("Erro ao enviar para o Discord:", err);
      });
  };
};

carregarPalpites();
