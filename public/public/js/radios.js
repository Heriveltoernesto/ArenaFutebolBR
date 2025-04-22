function carregarRadios() {
  const container = document.getElementById("radioContainer");
  container.innerHTML = `
    <p><strong>Jovem Pan Esportes:</strong></p>
    <audio controls>
      <source src="https://cdn.jovempan.com.br/streaming/jovempan-sp.mp3" type="audio/mpeg">
      Seu navegador não suporta o player de áudio.
    </audio>
    <p><strong>CBN Esportes:</strong></p>
    <audio controls>
      <source src="https://playerservices.streamtheworld.com/api/livestream-redirect/CBN_SAO_PAULO.mp3" type="audio/mpeg">
      Seu navegador não suporta o player de áudio.
    </audio>
  `;
}
