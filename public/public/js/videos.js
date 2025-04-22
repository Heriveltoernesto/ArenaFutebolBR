function carregarVideos() {
  const container = document.getElementById("videoContainer");
  container.innerHTML = "Buscando vídeos...";

  // Simulação com YouTube
  const canais = [
    {
      titulo: "GE - Globo Esporte",
      url: "https://www.youtube.com/embed/videoseries?list=PLx4x_zx8csUiOTI2z7xVqOZcrz_rSImu5"
    },
    {
      titulo: "ESPN Brasil",
      url: "https://www.youtube.com/embed/videoseries?list=PLovj4Wik0DgW5AKv7uQ2EJ0XroA4OckDL"
    }
  ];

  container.innerHTML = canais.map(canal =>
    `<div style="margin-bottom: 1rem">
      <h3>${canal.titulo}</h3>
      <iframe width="100%" height="315" src="${canal.url}" frameborder="0" allowfullscreen></iframe>
    </div>`
  ).join("");
}
