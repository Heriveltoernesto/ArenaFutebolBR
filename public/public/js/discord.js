function carregarDiscord() {
  const container = document.getElementById("discordData");
  const link = "https://discord.gg/sua-comunidade"; // Coloque o seu link real aqui

  container.innerHTML = `
    <p>Entre na nossa comunidade esportiva:</p>
    <a href="${link}" target="_blank" style="font-weight: bold; color: blue;">Entrar no Discord</a>
  `;
}
