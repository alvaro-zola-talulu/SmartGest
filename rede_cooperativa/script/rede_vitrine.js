document.addEventListener("DOMContentLoaded", () => {
    // 1. Manter sessão do utilizador ativa
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('user-display-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').innerText = usuarioLogado.inicial;

    // 2. Base de Dados de Produtos Anunciados na Vitrine
    const produtosVitrine = [
        {
            id: 1,
            empresa: "Pastelaria Doce Sabor",
            titulo: "Caixas de Salgados para Eventos",
            descricao: "Coxinhas, rissóis e croquetes em miniatura para revenda ou coffee breaks corporativos.",
            preco: "15.000 Kz",
            icon: "fa-cookie-bite"
        },
        {
            id: 2,
            empresa: "Gráfica Rápida do Sambizanga",
            titulo: "Impressão de Facturários AGT",
            descricao: "Produção de livros de faturas homologados pela AGT. Descontos especiais para parceiros da rede.",
            preco: "8.500 Kz",
            icon: "fa-print"
        },
        {
            id: 3,
            empresa: "Consultoria Progresso",
            titulo: "Formação de Atendimento ao Cliente",
            descricao: "Treino prático de 4 horas para equipas de vendas e balcão focado no comércio de Luanda.",
            preco: "45.000 Kz",
            icon: "fa-chalkboard-user"
        }
    ];

    const gridVitrine = document.getElementById('vitrine-produtos');
    const btnAbrirAnuncio = document.getElementById('btn-abrir-anuncio');

    // 3. Função para Renderizar os Cards da Vitrine
    function renderizarVitrine() {
        gridVitrine.innerHTML = "";

        produtosVitrine.forEach(prod => {
            const card = document.createElement('div');
            card.className = "produto-card";
            card.innerHTML = `
                <div>
                    <div class="produto-imagem-placeholder">
                        <i class="fa-solid ${prod.icon}"></i>
                    </div>
                    <div class="produto-corpo">
                        <span class="empresa-anunciante"><i class="fa-solid fa-store"></i> ${prod.empresa}</span>
                        <h3>${prod.titulo}</h3>
                        <p class="produto-descricao">${prod.descricao}</p>
                        <div class="produto-preco">${prod.preco}</div>
                    </div>
                </div>
                <div class="produto-rodape">
                    <a href="#" class="btn-negociar" onclick="alert('Ligando o chat interno de negociação com a empresa: ${prod.empresa}')">
                        <i class="fa-solid fa-comments"></i> Negociar Proposta
                    </a>
                </div>
            `;
            gridVitrine.appendChild(card);
        });
    }

    // 4. Lógica para o Utilizador Publicar um Novo Item Dinamicamente
    btnAbrirAnuncio.addEventListener('click', () => {
        const titulo = prompt("Qual é o nome do produto ou serviço que quer vender?");
        if (!titulo) return;

        const descricao = prompt("Faça uma breve descrição da sua oferta:");
        if (!descricao) return;

        const precoInput = prompt("Qual é o preço? (Exemplo: 20.000 Kz)");
        if (!precoInput) return;

        // Cria o novo objeto do produto usando o nome do utilizador logado no sistema
        const novoProduto = {
            id: produtosVitrine.length + 1,
            empresa: usuarioLogado.nome, // Puxa automaticamente o nome da empresa logada
            titulo: titulo,
            descricao: descricao,
            preco: precoInput,
            icon: "fa-box-open" // Icon padrão para novos produtos
        };

        // Adiciona à nossa lista na memória e atualiza a interface
        produtosVitrine.unshift(novoProduto); // Coloca no início da lista (topo da vitrine)
        alert("Parabéns! O seu anúncio já está visível para todas as empresas da Rede Cooperativa.");
        renderizarVitrine();
    });

    // Inicializar Ecrã
    renderizarVitrine();
});