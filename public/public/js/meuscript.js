<script>
    // Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menu = document.getElementById('menu');

    // A função de carregamento da API precisa estar dentro de uma função assíncrona
    async function carregarNoticias() 
            const response = await fetch('https://api.exemplo.com/noticias'); // Substitua pela URL real
            const noticias = await response.json();

            let noticiaAtual = 0;
            const container = document.getElementById("noticia-container");

            function exibirNoticia() 
                const noticia = noticias[noticiaAtual];
                container.innerHTML = `
                    <img src="${noticia.imagem}" alt="${noticia.titulo}" class="rounded mb-4 shadow w-full" />
                    <h3 class="text-xl font-semibold mb-2">${noticia.titulo}</h3>
                    <p class="text-gray-700">${noticia.texto}</p>
                `;
                noticiaAtual = (noticiaAtual + 1) % noticias.length;
            

            exibirNoticia();  // Exibe a primeira notícia
            setInterval(exibirNoticia, 7000); // Atualiza as notícias a cada 7 segundos
         catch (error) 
            console.error('Erro ao carregar notícias:', error);
    
    

    // Função para carregar os jogos da API (para diferentes competições)
    async function carregarJogos(competicao) 
        try 
            const response = await fetch(`https://api.exemplo.com/jogos/${competicao}`); // Substitua com URL correto
            const jogos = await response.json();

            const container = document.getElementById('jogos-container');
            container.innerHTML = ''; // Limpa os jogos anteriores

            jogos.forEach(jogo)
                const jogoElement = document.createElement('div');
                jogoElement.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'flex', 'justify-between');
                jogoElement.innerHTML = `
                    <div class="font-semibold">${jogo.mandante} vs ${jogo.visitante}</div>
                    <div class="text-gray-600">${jogo.data} - ${jogo.hora}</div>
                    <div class="text-gray-800">${jogo.placar}</div>
                `;
                container.appendChild(jogoElement);

         catch (error) 
            console.error('Erro ao carregar jogos:', error);

    // Menu Toggle (Eventos de click)
    menuToggle.addEventListener('click', 
        menu.classList.remove('hidden');


    menuClose.addEventListener('click', 
        menu.classList.add('hidden');

    // Chamar as funções de carregamento
    carregarNoticias(); // Chama a função para carregar as notícias
    carregarJogos('serie-a'); // Exemplo de uso: Carregar jogos da Série A ao carregar a página

# Remover bytes nulos de um arquivo
def remove_null_bytes_from_file(file_path):
    try:
        # Abrir o arquivo como binário
        with open(file_path, 'rb') as file:
            content = file.read()

        # Remover bytes nulos (\0)
        clean_content = content.replace(b'\0', b'')

        # Escrever o conteúdo limpo de volta no arquivo
        with open(file_path, 'wb') as file:
            file.write(clean_content)

        print(f"Bytes nulos removidos com sucesso de: {file_path}")
    except Exception as e:
        print(f"Erro ao remover bytes nulos: {e}")

# Caminho do arquivo problemático
remove_null_bytes_from_file('scraping/brasileirao.py')
</script>