document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar Sessão
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('user-display-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').innerText = usuarioLogado.inicial;

    // 2. Dados Fictícios dos Grupos de Kixiquila de Stock
    const gruposCompras = [
        {
            id: 1,
            produto: "Arroz Agulha (Saco 25kg)",
            importador: "Aliança Grossista, Kikolo",
            precoNormal: "18.500 Kz",
            precoKixiquila: "13.200 Kz",
            quantidadeAtual: 75,
            quantidadeMeta: 100,
            unidade: "sacos",
            empresasParticipantes: 6
        },
        {
            id: 2,
            produto: "Óleo de Cozinha (Caixa 12 Garrafas)",
            importador: "AngoAlimentos, Hoji-ya-Henda",
            precoNormal: "24.000 Kz",
            precoKixiquila: "18.900 Kz",
            quantidadeAtual: 32,
            quantidadeMeta: 50,
            unidade: "caixas",
            empresasParticipantes: 4
        },
        {
            id: 3,
            produto: "Cimento Portland 42.5 (Saco 50kg)",
            importador: "Central de Materiais Viana",
            precoNormal: "6.200 Kz",
            precoKixiquila: "4.800 Kz",
            quantidadeAtual: 480,
            quantidadeMeta: 500,
            unidade: "sacos",
            empresasParticipantes: 3
        }
    ];

    const gridLista = document.getElementById('grupos-lista');
    document.getElementById('total-grupos').innerText = gruposCompras.length;

    // 3. Renderizar os Grupos no Ecrã
    function renderizarGrupos() {
        gridLista.innerHTML = "";

        gruposCompras.forEach(grupo => {
            // Calcula a percentagem de preenchimento do grupo
            const percentagem = Math.min((grupo.quantidadeAtual / grupo.quantidadeMeta) * 100, 100).toFixed(0);
            
            const card = document.createElement('div');
            card.className = "grupo-card";
            card.innerHTML = `
                <div class="grupo-header">
                    <h3>${grupo.produto}</h3>
                    <span class="importador-tag"><i class="fa-solid fa-building"></i> ${grupo.importador}</span>
                </div>

                <div class="preco-comparacao">
                    <div class="preco-original">Preço Normal: <span>${grupo.precoNormal}</span></div>
                    <div class="preco-kixiquila">Na Kixiquila: <span>${grupo.precoKixiquila}</span></div>
                </div>

                <div class="progresso-section">
                    <div class="progresso-texto">
                        <span>Progresso: <strong>${grupo.quantidadeAtual}</strong> / ${grupo.quantidadeMeta} ${grupo.unidade}</span>
                        <span>${percentagem}%</span>
                    </div>
                    <div class="barra-fundo">
                        <div class="barra-preenchimento" style="width: ${percentagem}%"></div>
                    </div>
                    <p style="font-size:0.8rem; color:#64748b; margin: 8px 0 0 0;">
                        <i class="fa-solid fa-briefcase"></i> ${grupo.empresasParticipantes} negócios já aderiram
                    </p>
                </div>

                <button class="btn-participar" id="btn-unir-${grupo.id}">
                    <i class="fa-solid fa-plus"></i> Juntar-se ao Grupo
                </button>
            `;
            gridLista.appendChild(card);

            // Adicionar evento ao botão criado
            document.getElementById(`btn-unir-${grupo.id}`).addEventListener('click', () => {
                solicitarParticipacao(grupo.id);
            });
        });
    }

    // 4. Lógica de clique para Aderir ao grupo
    function solicitarParticipacao(id) {
        const grupo = gruposCompras.find(g => g.id === id);
        
        // Pergunta a quantidade que o utilizador quer comprar
        const qtdUnidades = prompt(`Quantos ${grupo.unidade} de "${grupo.produto}" deseja encomendar para o seu negócio?`);
        
        const quantidade = parseInt(qtdUnidades);

        if (isNaN(quantidade) || quantidade <= 0) {
            alert("Por favor, introduza uma quantidade válida superior a zero.");
            return;
        }

        // Simula a adição do utilizador ao grupo
        grupo.quantidadeAtual += quantidade;
        grupo.empresasParticipantes += 1;

        alert(`Sucesso! O seu negócio adicionou ${quantidade} ${grupo.unidade} à Kixiquila.\nAssim que a meta de ${grupo.quantidadeMeta} for atingida, receberá a guia de pagamento com o desconto.`);
        
        // Recarrega o ecrã com os novos dados e barras atualizadas
        renderizarGrupos();
    }

    // Inicializar
    renderizarGrupos();
});