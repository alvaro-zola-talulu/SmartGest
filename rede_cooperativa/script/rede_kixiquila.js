document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar Sessão
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    if (!usuarioLogado) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('user-display-name').innerText = usuarioLogado.nome;
    document.getElementById('user-avatar').innerText = usuarioLogado.inicial;

    // Garantir SweetAlert2 carregado dinamicamente
    if (!document.getElementById('sweetalert-script')) {
        const script = document.createElement('script');
        script.id = 'sweetalert-script';
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(script);
    }

    // 2. Dados dos Grupos (Configurados para o teste do coordenador)
    const gruposCompras = [
        {
            id: 1,
            produto: "Arroz Agulha (Saco 25kg)",
            importador: "Aliança Grossista, Kikolo",
            precoNormalNum: 18500,
            escaloes: { base: 15500, bronze: 14200, ouro: 13200 },
            quantidadeAtual: 95,
            quantidadeMeta: 100,
            unidade: "sacos",
            empresasParticipantes: 6,
            tempoRestante: "Restam 2 dias",
            codigoRecolha: "KX-KIKOLO-402"
        },
        {
            id: 2,
            produto: "Óleo de Cozinha (Caixa 12 Garrafas)",
            importador: "AngoAlimentos, Hoji-ya-Henda",
            precoNormalNum: 24000,
            escaloes: { base: 21000, bronze: 19800, ouro: 18900 },
            quantidadeAtual: 32,
            quantidadeMeta: 50,
            unidade: "caixas",
            empresasParticipantes: 4,
            tempoRestante: "Restam 14 horas",
            codigoRecolha: "KX-HOJI-119"
        },
        {
            id: 3,
            produto: "Cimento Portland 42.5 (Saco 50kg)",
            importador: "Central de Materiais Viana",
            precoNormalNum: 6200,
            escaloes: { base: 5400, bronze: 5100, ouro: 4800 },
            quantidadeAtual: 500,
            quantidadeMeta: 500,
            unidade: "sacos",
            empresasParticipantes: 8,
            tempoRestante: "Grupo Fechado",
            codigoRecolha: "KX-VIANA-883"
        }
    ];

    const gridLista = document.getElementById('grupos-lista');

    // Injetar o botão "Propor Novo Grupo" alinhado à direita antes da Grid
    const containerPrincipal = gridLista.parentElement;
    if (containerPrincipal && !document.getElementById('btn-criar-kixiquila')) {
        const wrapperBotao = document.createElement('div');
        // Alterado de justify-content: center para flex-end para alinhar à direita
        wrapperBotao.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 25px; width: 100%;";
        wrapperBotao.innerHTML = `
            <button id="btn-criar-kixiquila" style="background-color: #1e3a8a; color: white; border: none; padding: 12px 24px; font-weight: 600; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: background 0.2s;">
                <i class="fa-solid fa-circle-plus"></i> Propor Novo Grupo de Kixiquila
            </button>
        `;
        containerPrincipal.insertBefore(wrapperBotao, gridLista);
        document.getElementById('btn-criar-kixiquila').addEventListener('click', abrirFormularioCriacao);
    }

    const formatarKz = (valor) => valor.toLocaleString('pt-AO') + " Kz";

    function calcularPrecoAtual(grupo) {
        const pct = (grupo.quantidadeAtual / groupMetaPct(grupo));
        if (pct >= 100) return group.escaloes.ouro;
        if (pct >= 75) return group.escaloes.bronze;
        return grupo.escaloes.base;
    }

    function groupMetaPct(g) { return g.quantidadeMeta; }

    // 3. Renderizar os Grupos no Ecrã
    function renderizarGrupos() {
        gridLista.innerHTML = "";

        const txtTotal = document.getElementById('total-grupos');
        if (txtTotal) txtTotal.innerText = gruposCompras.length;

        gruposCompras.forEach(grupo => {
            const percentagem = Math.min((grupo.quantidadeAtual / grupo.quantidadeMeta) * 100, 100).toFixed(0);
            const precoKixiquilaAtual = calcularPrecoAtual(grupo);
            const estaFechado = parseInt(percentagem) >= 100;

            const card = document.createElement('div');
            card.className = "grupo-card";
            if (estaFechado) card.style.borderColor = "#10b981";

            card.innerHTML = `
                <div class="grupo-header">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
                        <h3>${grupo.produto}</h3>
                        <span style="font-size:0.75rem; background:${estaFechado ? '#d1fae5' : '#fef3c7'}; color:${estaFechado ? '#065f46' : '#d97706'}; padding:4px 8px; border-radius:12px; font-weight:600; white-space:nowrap;">
                            <i class="fa-solid ${estaFechado ? 'fa-circle-check' : 'fa-clock'}"></i> ${estaFechado ? 'Lote Completo' : grupo.tempoRestante}
                        </span>
                    </div>
                    <span class="importador-tag"><i class="fa-solid fa-building"></i> ${grupo.importador}</span>
                </div>

                <div class="preco-comparacao">
                    <div class="preco-original">Preço Normal: <span>${formatarKz(grupo.precoNormalNum)}</span></div>
                    <div class="preco-kixiquila" style="color: ${estaFechado ? '#10b981' : '#16a34a'};">Na Kixiquila: <span>${formatarKz(precoKixiquilaAtual)}</span></div>
                </div>

                <div class="progresso-section">
                    <div class="progresso-texto">
                        <span>Progresso: <strong>${grupo.quantidadeAtual}</strong> / ${grupo.quantidadeMeta} ${grupo.unidade}</span>
                        <span>${percentagem}%</span>
                    </div>
                    <div class="barra-fundo">
                        <div class="barra-preenchimento" style="width: ${percentagem}%; background-color: ${estaFechado ? '#10b981' : '#2563eb'};"></div>
                    </div>
                    
                    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.75rem; color:#64748b;">
                        <span><i class="fa-solid fa-briefcase"></i> ${grupo.empresasParticipantes} negócios aderiram</span>
                        <span style="font-weight:600; color:${estaFechado ? '#10b981' : '#2563eb'};">
                            ${estaFechado ? '🔥 Preço Mínimo Atingido!' : `Faltam ${100 - percentagem}% para o preço mínimo`}
                        </span>
                    </div>
                </div>

                <button class="btn-participar" id="btn-unir-${grupo.id}" style="background-color: ${estaFechado ? '#10b981' : ''}; color: ${estaFechado ? '#ffffff' : ''}; border: ${estaFechado ? 'none' : ''};">
                    <i class="fa-solid ${estaFechado ? 'fa-receipt' : 'fa-plus'}"></i> ${estaFechado ? 'Ver Guia de Levantamento' : 'Juntar-se ao Grupo'}
                </button>
            `;
            gridLista.appendChild(card);

            document.getElementById(`btn-unir-${grupo.id}`).addEventListener('click', () => {
                if (estaFechado) {
                    mostrarGuiaFechada(grupo);
                } else {
                    solicitarParticipacao(grupo.id);
                }
            });
        });
    }

    // 4. Lógica de clique para Grupos ATIVOS (Aderir)
    function solicitarParticipacao(id) {
        const grupo = gruposCompras.find(g => g.id === id);

        Swal.fire({
            title: 'Aderir à Kixiquila',
            text: `Quantos ${grupo.unidade} de "${grupo.produto}" deseja encomendar para o seu negócio?`,
            input: 'number',
            inputAttributes: { min: 1, step: 1 },
            inputValue: 5,
            showCancelButton: true,
            confirmButtonText: 'Calcular e Aderir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b'
        }).then((result) => {
            if (result.isConfirmed) {
                const quantidade = parseInt(result.value);

                if (isNaN(quantidade) || quantidade <= 0) {
                    Swal.fire({ icon: 'error', title: 'Quantidade Inválida', text: 'Introduza uma quantidade válida.', confirmButtonColor: '#2563eb' });
                    return;
                }

                grupo.quantidadeAtual += quantidade;
                grupo.empresasParticipantes += 1;

                const precoKixiquilaDepois = calcularPrecoAtual(grupo);
                const poupancaTotal = (grupo.precoNormalNum - precoKixiquilaDepois) * quantidade;

                if (grupo.quantidadeAtual >= groupMetaPct(grupo)) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Lote Fechado com Sucesso!',
                        html: `O seu pedido de ${quantidade} ${grupo.unidade} completou o grupo! <br><br><strong>A Guia de Levantamento Grossista já foi gerada!</strong>`,
                        confirmButtonColor: '#10b981'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Economia Confirmada',
                        html: `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; color: #16a34a; font-weight: 700;">Poupança estimada: ${formatarKz(poupancaTotal)}</div>`,
                        confirmButtonColor: '#2563eb'
                    });
                }

                renderizarGrupos();
            }
        });
    }

    // 5. Mostrar a Guia Comercial quando o Grupo bate os 100%
    function mostrarGuiaFechada(grupo) {
        Swal.fire({
            title: '<span style="color:#10b981">Guia de Compra Coletiva</span>',
            html: `
                <div style="text-align: left; background: #f8fafc; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; font-family: monospace;">
                    <p><strong>SISTEMA:</strong> SmartGest - Rede Cooperativa</p>
                    <p><strong>PRODUTO:</strong> ${grupo.produto}</p>
                    <p><strong>FORNECEDOR:</strong> ${grupo.importador}</p>
                    <hr style="border:0; border-top: 1px dashed #cbd5e1; margin: 10px 0;">
                    <p style="font-size: 1.1rem; color: #10b981;"><strong>PREÇO KIXIQUILA:</strong> ${formatarKz(grupo.escaloes.ouro)} / un</p>
                    <p style="color: #64748b;">(Poupança de ${formatarKz(grupo.precoNormalNum - grupo.escaloes.ouro)} por unidade obtida)</p>
                    <hr style="border:0; border-top: 1px dashed #cbd5e1; margin: 10px 0;">
                    <p style="text-align: center; font-size: 1.2rem; background: #e0f2fe; color: #0369a1; padding: 8px; border-radius: 4px; font-weight: 700; letter-spacing: 2px;">
                        CÓDIGO: ${grupo.codigoRecolha}
                    </p>
                </div>
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 14px;">
                    <i class="fa-solid fa-circle-info"></i> Apresente este código no balcão do importador para faturar com o desconto do SmartGest.
                </p>
            `,
            confirmButtonText: 'Fechar Janela',
            confirmButtonColor: '#10b981'
        });
    }

    // 6. Criar Próprio Grupo Dinâmico (Bottom-Up)
    function abrirFormularioCriacao() {
        Swal.fire({
            title: 'Propor Nova Kixiquila',
            html: `
                <input id="swal-input-produto" class="swal2-input" placeholder="Produto (ex: Açúcar Caeté 50kg)" style="margin-bottom: 12px; width: 85%; font-size: 0.95rem;">
                <input id="swal-input-unidade" class="swal2-input" placeholder="Unidade de medida (ex: sacos, caixas)" style="margin-bottom: 12px; width: 85%; font-size: 0.95rem;">
                <input id="swal-input-meta" type="number" class="swal2-input" placeholder="Quantidade Meta para o Lote" style="margin-bottom: 12px; width: 85%; font-size: 0.95rem;">
                <input id="swal-input-preco" type="number" class="swal2-input" placeholder="Preço do Mercado Normal (Kz)" style="width: 85%; font-size: 0.95rem;">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Publicar Grupo',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1e3a8a',
            cancelButtonColor: '#64748b',
            preConfirm: () => {
                return {
                    produto: document.getElementById('swal-input-produto').value,
                    unidade: document.getElementById('swal-input-unidade').value,
                    meta: parseInt(document.getElementById('swal-input-meta').value),
                    precoNormal: parseInt(document.getElementById('swal-input-preco').value)
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const dados = result.value;

                if (!dados.produto || !dados.unidade || isNaN(dados.meta) || isNaN(dados.precoNormal) || dados.meta <= 0 || dados.precoNormal <= 0) {
                    Swal.fire({ icon: 'error', title: 'Dados Inválidos', text: 'Por favor, preencha todos os campos com valores corretos.', confirmButtonColor: '#1e3a8a' });
                    return;
                }

                const novoGrupo = {
                    id: gruposCompras.length + 1,
                    produto: dados.produto,
                    importador: `Proposto por: ${usuarioLogado.nome}`,
                    precoNormalNum: dados.precoNormal,
                    escaloes: {
                        base: Math.round(dados.precoNormal * 0.85),
                        bronze: Math.round(dados.precoNormal * 0.78),
                        ouro: Math.round(dados.precoNormal * 0.70)
                    },
                    quantidadeAtual: 1,
                    quantidadeMeta: dados.meta,
                    unidade: dados.unidade,
                    empresasParticipantes: 1,
                    tempoRestante: "Restam 7 dias",
                    codigoRecolha: `KX-USER-${Math.floor(100 + Math.random() * 900)}`
                };

                gruposCompras.push(novoGrupo);

                Swal.fire({
                    icon: 'success',
                    title: 'Grupo Publicado!',
                    text: `A sua proposta de compra para "${dados.produto}" foi integrada na rede do SmartGest.`,
                    confirmButtonColor: '#1e3a8a'
                });

                renderizarGrupos();
            }
        });
    }

    // Inicializar
    renderizarGrupos();
});