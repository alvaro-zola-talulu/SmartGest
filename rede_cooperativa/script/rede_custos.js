document.addEventListener("DOMContentLoaded", () => {
    // 1. Manter sessão ativa
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('user-display-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').innerText = usuarioLogado.inicial;

    // 2. Base de Dados de Custos Compartilhados
    const despesasPartilhadas = [
        {
            id: 1,
            titulo: "Contentor de Mercadoria (Porto de Luanda)",
            tipo: "Logística",
            zona: "Viana, Luanda",
            custoTotal: 850000, // em Kwanzas
            participantesAtuais: 2,
            maxParticipantes: 4
        },
        {
            id: 2,
            titulo: "Aluguer de Gerador Industrial 50kVA",
            tipo: "Infraestrutura",
            zona: "Talatona, Luanda",
            custoTotal: 400000,
            participantesAtuais: 1,
            maxParticipantes: 3
        },
        {
            id: 3,
            titulo: "Campanha de Panfletos e Carro de Som",
            tipo: "Marketing",
            zona: "Cazenga, Luanda",
            custoTotal: 120000,
            participantesAtuais: 2,
            maxParticipantes: 5
        }
    ];

    const gridLista = document.getElementById('custos-lista');

    // 3. Função para Renderizar os Cards
    function renderizarCustos() {
        gridLista.innerHTML = "";

        despesasPartilhadas.forEach(item => {
            // Calcula o valor que cada empresa vai pagar dividindo o total pelo número de parceiros atuais
            const quotaIndividual = (item.custoTotal / item.participantesAtuais).toFixed(0);
            
            // Percentagem de preenchimento de vagas do grupo
            const percentagemVagas = (item.participantesAtuais / item.maxParticipantes) * 100;

            const card = document.createElement('div');
            card.className = "custo-card";
            card.innerHTML = `
                <div>
                    <div class="custo-header">
                        <h3>${item.titulo}</h3>
                        <span class="tipo-badge">${item.tipo}</span>
                    </div>
                    
                    <div class="local-info">
                        <i class="fa-solid fa-location-dot"></i> Realização: ${item.zona}
                    </div>

                    <div class="valores-box">
                        <div class="val-item">Custo Total: <span>${item.custoTotal.toLocaleString('pt-PT')} Kz</span></div>
                        <div class="val-item quota">A sua quota: <span>${parseInt(quotaIndividual).toLocaleString('pt-PT')} Kz</span></div>
                    </div>

                    <div class="progresso-wrapper">
                        <div class="progresso-detalhe">
                            <span>Vagas Preenchidas</span>
                            <span>${item.participantesAtuais} de ${item.maxParticipantes} empresas</span>
                        </div>
                        <div class="barra-trilho">
                            <div class="barra-progresso" style="width: ${percentagemVagas}%"></div>
                        </div>
                    </div>
                </div>

                <button class="btn-entrar-custo" id="btn-custo-${item.id}">
                    <i class="fa-solid fa-handshake"></i> Entrar na Divisão
                </button>
            `;
            gridLista.appendChild(card);

            // Ouvinte para o botão de ação
            document.getElementById(`btn-custo-${item.id}`).addEventListener('click', () => {
                aderirAoCusto(item.id);
            });
        });
    }

    // 4. Lógica para entrar na divisão de custos
    function abrirAoCusto(id) {
        // Encontra o item clicado
        const item = despesasPartilhadas.find(d => d.id === id);

        if (item.participantesAtuais >= item.maxParticipantes) {
            alert("Este grupo já atingiu o limite máximo de empresas parceiras.");
            return;
        }

        const confirmar = confirm(`Deseja unir o seu negócio ao custo "${item.titulo}"?\nAo entrar, o valor será dividido por ${item.participantesAtuais + 1} empresas.`);
        
        if (confirmar) {
            item.participantesAtuais += 1;
            alert("Sucesso! Entrou no grupo. O valor individual do custo baixou automaticamente para todos os parceiros!");
            renderizarCustos(); // Atualiza o ecrã instantaneamente
        }
    }

    // Inicialização
    renderizarCustos();
});