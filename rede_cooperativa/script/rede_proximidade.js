document.addEventListener("DOMContentLoaded", () => {
    // 1. Manter sessão ativa
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('user-display-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').innerText = usuarioLogado.inicial;

    // 2. Base de Dados unificada de Oportunidades Geográficas (Cruza informações da rede)
    const mapaOportunidades = [
        {
            id: 1,
            titulo: "Kixiquila de Arroz Agulha (Saco 25kg)",
            tipo: "kixiquila",
            tipoNome: "Kixiquila de Stock",
            descricao: "Faltam apenas 25 sacos para fechar o lote com o importador do Kikolo.",
            municipio: "Cacuaco",
            bairro: "Kikolo",
            link: "rede_kixiquila.html"
        },
        {
            id: 2,
            titulo: "Divisão de Contentor (Porto de Luanda)",
            tipo: "custo",
            tipoNome: "Custo Partilhado",
            descricao: "Buscamos mais 2 parceiros comerciais para ratear o frete e desembaraço de contentor.",
            municipio: "Viana",
            bairro: "Estalagem",
            link: "rede_custos.html"
        },
        {
            id: 3,
            titulo: "Aluguer de Gerador Industrial 50kVA",
            tipo: "custo",
            tipoNome: "Custo Partilhado",
            descricao: "Divisão de custos mensais de combustível e manutenção de gerador para quebras de energia.",
            municipio: "Talatona",
            bairro: "Talatona Centro",
            link: "rede_custos.html"
        },
        {
            id: 4,
            titulo: "Armazém Grossista Poupe Já",
            tipo: "empresa",
            tipoNome: "Parceiro Verificado",
            descricao: "Distribuidor direto de óleo, farinha e açúcar com tabelas especiais para membros da rede.",
            municipio: "Cazenga",
            bairro: "Hoji-Ya-Henda",
            link: "rede_fornecedores.html"
        },
        {
            id: 5,
            titulo: "Gráfica Rápida do Sambizanga",
            tipo: "empresa",
            tipoNome: "Parceiro Verificado",
            descricao: "Impressão de faturas homologadas e material publicitário com entrega grátis na zona.",
            municipio: "Cazenga",
            bairro: "Sambizanga",
            link: "rede_fornecedores.html"
        }
    ];

    const gridLista = document.getElementById('proximidade-lista');
    const selectMunicipio = document.getElementById('select-municipio');

    // 3. Função para Renderizar os Cards Filtrados
    function renderizarOportunidades(lista) {
        gridLista.innerHTML = "";

        if (lista.length === 0) {
            gridLista.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; margin-top: 20px;">Nenhuma oportunidade ou empresa registada neste município de momento.</p>`;
            return;
        }

        lista.forEach(item => {
            const card = document.createElement('div');
            card.className = "geo-card";
            card.innerHTML = `
                <div>
                    <span class="geo-tag-tipo ${item.tipo}">${item.tipoNome}</span>
                    <h3>${item.titulo}</h3>
                    <p>${item.descricao}</p>
                    <div class="geo-local-badge">
                        <i class="fa-solid fa-location-crosshairs"></i> ${item.municipio} — Bairro ${item.bairro}
                    </div>
                </div>
                <a href="${item.link}" class="btn-geo-acao">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir Oportunidade
                </a>
            `;
            gridLista.appendChild(card);
        });
    }

    // 4. Filtragem dinâmica baseada no select
    selectMunicipio.addEventListener('change', () => {
        const municipioSelecionado = selectMunicipio.value;

        if (municipioSelecionado === "todos") {
            renderizarOportunidades(mapaOportunidades);
        } else {
            const listaFiltrada = mapaOportunidades.filter(item => item.municipio === municipioSelecionado);
            renderizarOportunidades(listaFiltrada);
        }
    });

    // Inicializar mostrando tudo
    renderizarOportunidades(mapaOportunidades);
});