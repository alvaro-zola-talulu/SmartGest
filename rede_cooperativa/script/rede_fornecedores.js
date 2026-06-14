document.addEventListener("DOMContentLoaded", () => {
    // 1. Manutenção da sessão do utilizador (Herdado do sistema principal)
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('user-display-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').innerText = usuarioLogado.inicial;

    // 2. Base de Dados Simulada de Fornecedores da Rede
    const fornecedores = [
        {
            id: 1,
            nome: "Alimentos do Kwanza Lda",
            categoria: "alimentar",
            categoriaNome: "Alimentação e Bebidas",
            localizacao: "Hoji-Ya-Henda, Luanda",
            contacto: "+244 923 000 111",
            estrelas: 4.8,
            avaliacoes: 24,
            selo: "Verificado"
        },
        {
            id: 2,
            nome: "TechAngola Distribuidora",
            categoria: "eletronicos",
            categoriaNome: "Eletrónicos e Tecnologia",
            localizacao: "Talatona, Luanda",
            contacto: "+244 931 222 333",
            estrelas: 4.5,
            avaliacoes: 18,
            selo: "Parceiro Ouro"
        },
        {
            id: 3,
            nome: "Logística Segura Nacional",
            categoria: "logistica",
            categoriaNome: "Transporte e Logística",
            localizacao: "Viana, Luanda",
            contacto: "+244 912 444 555",
            estrelas: 4.2,
            avaliacoes: 9,
            selo: "Regular"
        },
        {
            id: 4,
            nome: "Embalagens Populares do Kikolo",
            categoria: "embalagens",
            categoriaNome: "Embalagens e Descartáveis",
            localizacao: "Cacuaco (Kikolo), Luanda",
            contacto: "+244 945 777 888",
            estrelas: 4.9,
            avaliacoes: 37,
            selo: "Recomendado"
        }
    ];

    // Elementos do DOM
    const gridLista = document.getElementById('fornecedores-lista');
    const inputPesquisa = document.getElementById('search-input');
    const filtroCategoria = document.getElementById('filter-categoria');

    // 3. Função para Renderizar os Cards no Ecrã
    function renderizarFornecedores(lista) {
        gridLista.innerHTML = ""; // Limpa a lista atual

        if (lista.length === 0) {
            gridLista.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; margin-top: 20px;">Nenhum fornecedor encontrado para a sua pesquisa.</p>`;
            return;
        }

        lista.forEach(forn => {
            // Criar a representação visual das estrelas
            let estrelasHTML = "";
            const inteiras = Math.floor(forn.estrelas);
            for (let i = 0; i < 5; i++) {
                if (i < inteiras) {
                    estrelasHTML += `<i class="fa-solid fa-star"></i>`;
                } else {
                    estrelasHTML += `<i class="fa-regular fa-star"></i>`;
                }
            }

            // Criar o Card HTML
            const card = document.createElement('div');
            card.className = "fornecedor-card";
            card.innerHTML = `
                <span class="badge-confianca">${forn.selo}</span>
                <div class="fornecedor-info">
                    <span class="categoria-tag">${forn.categoriaNome}</span>
                    <h3>${forn.nome}</h3>
                    
                    <div class="fornecedor-rating">
                        <div class="estrelas">${estrelasHTML}</div>
                        <span class="qtd-avaliacoes">(${forn.estrelas} de ${forn.avaliacoes} votos)</span>
                    </div>

                    <div class="fornecedor-detalhes">
                        <p><i class="fa-solid fa-location-dot"></i> ${forn.localizacao}</p>
                        <p><i class="fa-solid fa-phone"></i> ${forn.contacto}</p>
                    </div>
                </div>
                <div class="fornecedor-footer">
                    <span style="font-size: 0.8rem; color: #10b981;"><i class="fa-solid fa-circle-check"></i> Avaliações Reais</span>
                    <a href="https://wa.me/${forn.contacto.replace(/[^0-9]/g, '')}" target="_blank" class="btn-contacto">
                        <i class="fa-brands fa-whatsapp"></i> Contactar
                    </a>
                </div>
            `;
            gridLista.appendChild(card);
        });
    }

    // 4. Sistema de Filtragem Combinada (Pesquisa + Categoria)
    function filtrarFornecedores() {
        const termoBusca = inputPesquisa.value.toLowerCase();
        const categoriaSelecionada = filtroCategoria.value;

        const resultadoFiltrado = fornecedores.filter(forn => {
            const batePesquisa = forn.nome.toLowerCase().includes(termoBusca) || 
                                 forn.localizacao.toLowerCase().includes(termoBusca);
            
            const bateCategoria = categoriaSelecionada === "todos" || forn.categoria === categoriaSelecionada;

            return batePesquisa && bateCategoria;
        });

        renderizarFornecedores(resultadoFiltrado);
    }

    // Ouvintes de Eventos (Listeners)
    inputPesquisa.addEventListener('input', filtrarFornecedores);
    filtroCategoria.addEventListener('change', filtrarFornecedores);

    // Inicializar o ecrã mostrando todos os fornecedores
    renderizarFornecedores(fornecedores);
});