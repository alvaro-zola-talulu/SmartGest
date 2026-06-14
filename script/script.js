// Banco de dados de utilizadores permitidos
const usuariosPermitidos = {
    "alvaro": { senha: "admin2026", nome: "Álvaro Zola Ntalulu", inicial: "AN" },
    "francisco": { senha: "vendas123", nome: "Francisco Gamboa", inicial: "FG" },
    "edvanio": { senha: "pumangol", nome: "Edvânio Simões", inicial: "ES" },
    "ulisses": { senha: "inevitavel", nome: "Yami Ulísses", inicial: "J" },
};

// NOVO: Busca o utilizador logado ou define um padrão ("comum") se não encontrar
function getUsuarioAtivo() {
    return localStorage.getItem("usuario_logado") || "comum";
}

// Inicialização das variáveis globais vazias (serão preenchidas dinamicamente)
let produtos = [];
let clientes = [];
let vendas = [];

// NOVO: Carrega os dados isolados do utilizador ativo
function carregarDadosDoUsuario() {
    const usuario = getUsuarioAtivo();

    produtos = JSON.parse(localStorage.getItem(`vendas_produtos_${usuario}`)) || [
        { nome: "Arroz 5kg", preco: 2500, custo: 1900, stock: 15 },
        { nome: "Óleo 1L", preco: 1800, custo: 1300, stock: 8 },
        { nome: "Feijão 1kg", preco: 1200, custo: 850, stock: 25 },
        { nome: "Sabão 200g", preco: 500, custo: 320, stock: 2 }
    ];

    clientes = JSON.parse(localStorage.getItem(`vendas_clientes_${usuario}`)) || [
        { nome: "Álvaro Zola Ntalulu", telefone: "923 456 789" },
        { nome: "Francisco Gamboa", telefone: "924 111 222" }
    ];

    vendas = JSON.parse(localStorage.getItem(`vendas_historico_${usuario}`)) || [];
}

// Executado sempre que qualquer página é totalmente carregada
window.onload = function() {
    // Garante o carregamento dos dados certos antes de renderizar os ecrãs
    carregarDadosDoUsuario();

    const path = window.location.pathname;
    const paginaAtual = path.substring(path.lastIndexOf('/') + 1);

    // MODIFICADO: Bloqueia a execução do renderHeaderUsuario se estiver no index ou no login
    if (paginaAtual !== "index.html" && paginaAtual !== "" && paginaAtual !== "login.html") {
        renderHeaderUsuario();
    }

    if (paginaAtual === "dashboard.html") {
        renderDashboardEInsights();
    } 
    else if (paginaAtual === "produtos.html") {
        renderProdutos();
        
        // ATIVAÇÃO DA BARRA DE PESQUISA EM TEMPO REAL
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', renderProdutos);
        }
    } 
    else if (paginaAtual === "vendas.html") {
        renderVendasFormOptions();
        updateSaleTotal();
    } 
    else if (paginaAtual === "clientes.html") {
        renderClientes();
    } 
    else if (paginaAtual === "relatorios.html") {
        const filterInput = document.getElementById('report-month-filter');
        if (filterInput) {
            filterInput.value = new Date().getMonth();
        }
        renderRelatorios();
    }
};

function renderHeaderUsuario() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    
    if (!usuarioLogado) {
        window.location.href = 'index.html';
        return;
    }

    const elemDisplayName = document.getElementById('user-display-name');
    const elemDropdownName = document.getElementById('dropdown-user-name');
    const elemWelcomeName = document.getElementById('welcome-name');
    const elemAvatar = document.getElementById('user-avatar');

    if (elemDisplayName) elemDisplayName.innerText = usuarioLogado.nome;
    if (elemDropdownName) elemDropdownName.innerText = usuarioLogado.nome;
    if (elemWelcomeName) elemWelcomeName.innerText = usuarioLogado.nome;
    if (elemAvatar) elemAvatar.innerText = usuarioLogado.inicial;
}

window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profile-dropdown-menu');
    const profileBtn = document.querySelector('.user-profile');
    if (dropdown && !dropdown.contains(e.target) && profileBtn && !profileBtn.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

function toggleProfileDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profile-dropdown-menu');
    if (dropdown) dropdown.classList.toggle('show');
}

// AJUSTADO: Persiste os dados na chave única do utilizador logado
function persistData() {
    const usuario = getUsuarioAtivo();
    localStorage.setItem(`vendas_produtos_${usuario}`, JSON.stringify(produtos));
    localStorage.setItem(`vendas_clientes_${usuario}`, JSON.stringify(clientes));
    localStorage.setItem(`vendas_historico_${usuario}`, JSON.stringify(vendas));
}

// LÓGICA DE AUTENTICAÇÃO
function handleLogin(event) {
    event.preventDefault();
    const userIn = document.getElementById('username').value.trim().toLowerCase();
    const passIn = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');

    if (usuariosPermitidos[userIn] && usuariosPermitidos[userIn].senha === passIn) {
        if (errorDiv) errorDiv.classList.add('hidden');
        
        sessionStorage.setItem('usuario_sessao', JSON.stringify(usuariosPermitidos[userIn]));
        
        // Guarda o nome exato do utilizador que entrou para isolar os dados
        localStorage.setItem('usuario_logado', userIn);
        
        window.location.href = 'dashboard.html';
    } else {
        if (errorDiv) errorDiv.classList.remove('hidden');
        document.getElementById('password').value = "";
    }
}

function handleLogout() {
    sessionStorage.removeItem('usuario_sessao');
    localStorage.removeItem('usuario_logado');
    window.location.href = 'index.html';
}

// GESTÃO DE PRODUTOS
function renderProdutos() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;

    produtos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));

    const searchInput = document.getElementById('search-input');
    const termoPesquisa = searchInput ? searchInput.value.toLowerCase().trim() : "";

    tbody.innerHTML = "";
    let contadorExibidos = 0;

    produtos.forEach((prod, index) => {
        if (termoPesquisa !== "" && !prod.nome.toLowerCase().includes(termoPesquisa)) {
            return; 
        }

        contadorExibidos++;
        const custoBase = prod.custo !== undefined ? prod.custo : Math.round(prod.preco * 0.75);
        tbody.innerHTML += `
            <tr>
                <td>${prod.nome}</td>
                <td>${prod.preco.toLocaleString('pt-PT')} Kz</td>
                <td>${custoBase.toLocaleString('pt-PT')} Kz</td>
                <td>${prod.stock}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${index})"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-delete" onclick="deleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    const footerText = document.getElementById('products-total-footer');
    if (footerText) {
        footerText.innerText = termoPesquisa === "" 
            ? `Total de produtos: ${produtos.length}` 
            : `Produtos encontrados: ${contadorExibidos}`;
    }
}

function openProductModal() {
    document.getElementById('product-form-container').classList.remove('hidden-element');
    document.getElementById('product-form-title').innerText = "Adicionar Novo Produto";
    document.getElementById('product-edit-index').value = "";
    clearProductForm();
}

// Fecha o modal de produtos
function closeProductModal() { 
    document.getElementById('product-form-container').classList.add('hidden-element'); 
}

function clearProductForm() {
    document.getElementById('prod-nome').value = "";
    document.getElementById('prod-preco').value = "";
    document.getElementById('prod-custo').value = "";
    document.getElementById('prod-stock').value = "";
}

function saveProduct() {
    const nome = document.getElementById('prod-nome').value.trim();
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const custo = parseFloat(document.getElementById('prod-custo').value);
    const stock = parseInt(document.getElementById('prod-stock').value);
    const index = document.getElementById('product-edit-index').value;

    if(!nome || isNaN(preco) || isNaN(custo) || isNaN(stock)) {
        alert("Preencha todos os campos do produto corretamente!");
        return;
    }

    const item = { nome, preco, custo, stock };
    if(index === "") { 
        produtos.push(item); 
    } else { 
        produtos[index] = item; 
    }
    
    persistData();
    renderProdutos();
    closeProductModal();
}

function editProduct(index) {
    const prod = produtos[index];
    document.getElementById('product-form-title').innerText = "Editar Produto";
    document.getElementById('product-edit-index').value = index;
    document.getElementById('prod-nome').value = prod.nome;
    document.getElementById('prod-preco').value = prod.preco;
    document.getElementById('prod-custo').value = prod.custo !== undefined ? prod.custo : Math.round(prod.preco * 0.75);
    document.getElementById('prod-stock').value = prod.stock;
    document.getElementById('product-form-container').classList.remove('hidden-element');
}

// GESTÃO DE CLIENTES
function renderClientes() {
    const tbody = document.getElementById('clients-table-body');
    if (!tbody) return;

    tbody.innerHTML = "";
    clientes.forEach((cli, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${cli.nome}</td>
                <td>${cli.telefone}</td>
                <td>
                    <button class="btn-edit" onclick="editClient(${index})"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-delete" onclick="deleteClient(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    const footerText = document.getElementById('clients-total-footer');
    if (footerText) footerText.innerText = `Total de clientes: ${clientes.length}`;
}

function openClientModal() {
    document.getElementById('client-form-container').classList.remove('hidden-element');
    document.getElementById('client-form-title').innerText = "Adicionar Novo Cliente";
    document.getElementById('client-edit-index').value = "";
    document.getElementById('cli-nome').value = "";
    document.getElementById('cli-telefone').value = "";
}

function closeClientModal() {
    document.getElementById('client-form-container').classList.add('hidden-element');
}

function saveClient() {
    const nome = document.getElementById('cli-nome').value.trim();
    const telefone = document.getElementById('cli-telefone').value.trim();
    const index = document.getElementById('client-edit-index').value;

    if (telefone.length !== 9) {
        alert("Erro: O número de telefone tem de ter obrigatoriamente 9 dígitos!");
        document.getElementById('cli-telefone').focus();
        return;
    }

    if (nome === "") {
        alert("Por favor, preencha o nome do cliente.");
        return;
    }

    if(!nome || !telefone) {
        alert("Preencha todos os campos do cliente!");
        return;
    }

    const item = { nome, telefone };
    if(index === "") {
        clientes.push(item);
    } else {
        clientes[index] = item;
    }

    persistData();
    renderClientes();
    closeClientModal();
}

function editClient(index) {
    const cli = clientes[index];
    document.getElementById('client-form-title').innerText = "Editar Cliente";
    document.getElementById('client-edit-index').value = index;
    document.getElementById('cli-nome').value = cli.nome;
    document.getElementById('cli-telefone').value = cli.telefone;
    document.getElementById('client-form-container').classList.remove('hidden-element');
}

function deleteClient(index) {
    if(confirm(`Tem a certeza que deseja eliminar o cliente "${clientes[index].nome}"?`)) {
        clientes.splice(index, 1);
        persistData();
        renderClientes();
    }
}

// SISTEMA DE EFETUAR VENDAS
function renderVendasFormOptions() {
    const clientSelect = document.getElementById('sale-client-select');
    const prodSelect = document.getElementById('sale-product-select');

    if (!clientSelect || !prodSelect) return;

    clientSelect.innerHTML = '<option value="">Selecionar cliente</option>';
    clientes.forEach((c, idx) => { clientSelect.innerHTML += `<option value="${idx}">${c.nome}</option>`; });

    prodSelect.innerHTML = '<option value="">Selecionar produto</option>';
    produtos.forEach((p, idx) => { prodSelect.innerHTML += `<option value="${idx}">${p.nome} (Dispo: ${p.stock})</option>`; });
}

function updateSaleTotal() {
    const selectElem = document.getElementById('sale-product-select');
    if (!selectElem) return;

    const prodIdx = selectElem.value;
    const qty = parseInt(document.getElementById('sale-qty').value) || 0;
    const unitPriceInput = document.getElementById('sale-unit-price');
    const totalDiv = document.getElementById('sale-total');

    if(prodIdx !== "") {
        const preco = produtos[prodIdx].preco;
        unitPriceInput.value = preco.toLocaleString('pt-PT') + " Kz";
        totalDiv.innerText = (preco * qty).toLocaleString('pt-PT') + " Kz";
    } else {
        unitPriceInput.value = "0 Kz";
        totalDiv.innerText = "0 Kz";
    }
}

function registerSale(event) {
    if(event) event.preventDefault();

    const clientIdx = document.getElementById('sale-client-select').value;
    const prodIdx = document.getElementById('sale-product-select').value;
    const qty = parseInt(document.getElementById('sale-qty').value) || 0;

    if(clientIdx === "" || prodIdx === "" || qty <= 0) {
        alert("Selecione o cliente, o produto e defina uma quantidade válida!");
        return;
    }

    const produtoSelecionado = produtos[prodIdx];
    const clienteSelecionado = clientes[clientIdx];

    if(qty > produtoSelecionado.stock) {
        alert(`Stock insuficiente! Apenas tem ${produtoSelecionado.stock} unidades disponíveis de ${produtoSelecionado.nome}.`);
        return;
    }

    produtoSelecionado.stock -= qty;

    const custoUnitario = produtoSelecionado.custo !== undefined ? produtoSelecionado.custo : Math.round(produtoSelecionado.preco * 0.75);
    const totalVenda = produtoSelecionado.preco * qty;
    const totalCusto = custoUnitario * qty;
    const lucroLiquido = totalVenda - totalCusto;

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-PT') + " " + agora.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'});

    const novaVenda = {
        data: dataFormatada,
        timestamp: agora.getTime(),
        cliente: clienteSelecionado.nome,
        produto: produtoSelecionado.nome,
        quantidade: qty,
        total: totalVenda,
        lucro: lucroLiquido
    };

    vendas.unshift(novaVenda);
    persistData();

    alert("Venda realizada com sucesso!");
    
    document.getElementById('sale-product-select').value = "";
    document.getElementById('sale-qty').value = "1";
    renderVendasFormOptions();
    updateSaleTotal();
}

// AUTOMATIZAÇÃO REAL DO DASHBOARD E AUTOMATIZAÇÃO DO GRÁFICO SVG
function renderDashboardEInsights() {
    const pQtd = document.getElementById('dash-produtos-qtd');
    const cQtd = document.getElementById('dash-clientes-qtd');
    if (!pQtd || !cQtd) return;

    pQtd.innerText = produtos.length;
    cQtd.innerText = clientes.length;

    const hojeStr = new Date().toLocaleDateString('pt-PT');
    let totalDinheiroHoje = 0;
    let totalVendasHoje = 0;

    vendas.forEach(v => {
        if(v.data && v.data.startsWith(hojeStr)) {
            totalDinheiroHoje += v.total;
            totalVendasHoje++;
        }
    });

    document.getElementById('dash-vendas-qtd').innerText = totalVendasHoje;
    document.getElementById('dash-receita-total').innerText = totalDinheiroHoje.toLocaleString('pt-PT') + " Kz";

    const lowStockList = document.getElementById('dash-low-stock-list');
    lowStockList.innerHTML = "";
    let contagemBaixoStock = 0;

    const iconColors = ["bg-danger-icon", "bg-warning-icon", "bg-info-icon"];

    produtos.forEach(p => {
        if(p.stock <= 3) {
            let classeCor = iconColors[contagemBaixoStock % iconColors.length];
            contagemBaixoStock++;
            
            lowStockList.innerHTML += `
                <li>
                    <div class="stock-item-left">
                        <div class="stock-icon-wrapper ${classeCor}">
                            <i class="fa-solid fa-box-open" style="font-size:0.85rem;"></i>
                        </div>
                        <span style="font-weight: 600; color:#334155;">${p.nome}</span>
                    </div>
                    <strong style="color: #ef4444; font-size:0.9rem;">${p.stock} ${p.stock === 1 ? 'unidade' : 'unidades'}</strong>
                </li>
            `;
        }
    });

    if(contagemBaixoStock === 0) {
        lowStockList.innerHTML = "<li><span class='text-green' style='font-size:0.9rem;'><i class='fa-solid fa-circle-check'></i> Todo o inventário está seguro!</span></li>";
    }

    const dataAtual = new Date();
    const diaSemanaAtual = dataAtual.getDay(); 
    
    const distanciaParaSegunda = diaSemanaAtual === 0 ? -6 : 1 - diaSemanaAtual;
    const segundaFeiraCorrente = new Date(dataAtual);
    segundaFeiraCorrente.setDate(dataAtual.getDate() + distanciaParaSegunda);

    let faturamentoDiasSemanas = [0, 0, 0, 0, 0, 0, 0]; 
    let stringsDasDatasSemanas = [];

    for (let i = 0; i < 7; i++) {
        const diaLoop = new Date(segundaFeiraCorrente);
        diaLoop.setDate(segundaFeiraCorrente.getDate() + i);
        stringsDasDatasSemanas.push(diaLoop.toLocaleDateString('pt-PT'));
    }

    vendas.forEach(v => {
        if (v.data) {
            const dataVendaApenas = v.data.split(' ')[0];
            const indexDia = stringsDasDatasSemanas.indexOf(dataVendaApenas);
            if (indexDia !== -1) {
                faturamentoDiasSemanas[indexDia] += v.total;
            }
        }
    });

    const faturamentoMaximo = Math.max(...faturamentoDiasSemanas, 10000); 
    const labelMax = document.getElementById('chart-max-value');
    if (labelMax) labelMax.innerText = `Pico da semana: ${faturamentoMaximo.toLocaleString('pt-PT')} Kz`;

    const coordenadasX = [35, 105, 175, 245, 315, 385, 455];
    const alturaBaseSVG = 150; 
    const topoMaxSVG = 30;     

    let stringPontosPolyline = "";
    const dotsGroup = document.getElementById('chart-dots-group');
    if (dotsGroup) dotsGroup.innerHTML = "";

    faturamentoDiasSemanas.forEach((valor, idx) => {
        const x = coordenadasX[idx];
        const proporcao = valor / faturamentoMaximo;
        const y = alturaBaseSVG - (proporcao * (alturaBaseSVG - topoMaxSVG));

        stringPontosPolyline += `${x},${y} `;

        if (dotsGroup) {
            dotsGroup.innerHTML += `
                <circle cx="${x}" cy="${y}" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                <text x="${x}" y="${y - 10}" font-size="9" font-weight="bold" fill="#1e293b" text-anchor="middle">
                    ${valor > 0 ? (valor / 1000) + 'k' : ''}
                </text>
            `;
        }
    });

    const polylineElem = document.getElementById('chart-polyline');
    if (polylineElem) {
        polylineElem.setAttribute('points', stringPontosPolyline.trim());
    }
}

// RELATÓRIOS E FATURAÇÃO
function renderRelatorios() {
    const filterInput = document.getElementById('report-month-filter');
    const tbody = document.getElementById('sales-report-table-body');
    if (!tbody || !filterInput) return;

    const filtroSelecionado = filterInput.value;
    tbody.innerHTML = "";

    let faturadoTotal = 0;
    let lucroTotal = 0;
    let totalTransacoesCount = 0;

    const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    if(filtroSelecionado === "ALL") {
        document.getElementById('report-scope-title').innerText = "Histórico Total Acumulado";
    } else {
        document.getElementById('report-scope-title').innerText = `Análise Mensal — Mês de ${mesesNomes[parseInt(filtroSelecionado)]}`;
    }

    vendas.forEach(v => {
        let incluirVenda = false;
        
        if(filtroSelecionado === "ALL") {
            incluirVenda = true;
        } else {
            let mesVenda;
            if (v.timestamp) {
                mesVenda = new Date(v.timestamp).getMonth();
            } else {
                try {
                    const partesData = v.data.split(' ')[0].split('/');
                    mesVenda = parseInt(partesData[1]) - 1;
                } catch(e) { mesVenda = -1; }
            }
            if(mesVenda === parseInt(filtroSelecionado)) {
                incluirVenda = true;
            }
        }

        if(incluirVenda) {
            faturadoTotal += v.total;
            const lucroItem = v.lucro !== undefined ? v.lucro : Math.round(v.total * 0.25);
            lucroTotal += lucroItem;
            totalTransacoesCount++;

            tbody.innerHTML += `
                <tr>
                    <td>${v.data}</td>
                    <td>${v.cliente}</td>
                    <td>${v.produto}</td>
                    <td>${v.quantidade}</td>
                    <td><strong>${v.total.toLocaleString('pt-PT')} Kz</strong></td>
                    <td class="text-green"><strong>${lucroItem.toLocaleString('pt-PT')} Kz</strong></td>
                </tr>
            `;
        }
    });

    document.getElementById('rep-vendas-count').innerText = totalTransacoesCount;
    document.getElementById('rep-receita-count').innerText = faturadoTotal.toLocaleString('pt-PT') + " Kz";
    document.getElementById('rep-lucro-count').innerText = lucroTotal.toLocaleString('pt-PT') + " Kz";

    if (totalTransacoesCount === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding: 20px;">Nenhum registo de venda encontrado para o período selecionado.</td></tr>`;
    }
}

// Executa automaticamente ao carregar qualquer página para listar os IBANs no Dropdown
document.addEventListener("DOMContentLoaded", () => {
    updateIbanDisplays();
});

// AJUSTADO: Busca os IBANs salvos EXCLUSIVOS do utilizador logado
function getIbans() {
    const usuario = getUsuarioAtivo();
    const ibans = localStorage.getItem(`ibans_${usuario}`);
    
    return ibans ? JSON.parse(ibans) : [
        { banco: "BAI", numero: "AO06 0040 0000 1234 5678 9012 3" }
    ];
}

function updateIbanDisplays() {
    const ibans = getIbans();
    const dropdownList = document.getElementById("dropdown-iban-list");
    const modalList = document.getElementById("modal-iban-list");

    if (dropdownList) {
        if (ibans.length === 0) {
            dropdownList.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8; font-style: italic; margin-top: 5px;">Nenhum IBAN registado.</p>`;
        } else {
            dropdownList.innerHTML = ibans.map((item, index) => `
                <div class="iban-item" style="margin-bottom: 8px; font-size: 0.85rem;">
                    <span class="iban-label" style="font-weight: 700; display: block; color: #64748b;">${item.banco}:</span>
                    <span class="iban-value" style="word-break: break-all; color: #1e293b;">${item.numero}</span>
                </div>
            `).join('');
        }
    }

    if (modalList) {
        if (ibans.length === 0) {
            modalList.innerHTML = `<p style="font-size: 0.85rem; color: #94a3b8; text-align: center;">Nenhum IBAN adicionado.</p>`;
        } else {
            modalList.innerHTML = ibans.map((item, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 0.8rem; max-width: 80%;">
                        <strong style="color: #1e293b;">${item.banco}</strong><br>
                        <span style="color: #64748b; font-family: monospace;">${item.numero}</span>
                    </div>
                    <button onclick="removeIban(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1rem;" title="Remover">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
}

function openIbanManager(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById("iban-modal");
    if (modal) {
        modal.style.display = "flex";
        updateIbanDisplays();
    }
}

function closeIbanModal() {
    const modal = document.getElementById("iban-modal");
    if (modal) modal.style.display = "none";
}

function addIban() {
    const bancoInput = document.getElementById("iban-bank-input");
    const numeroInput = document.getElementById("iban-value-input");
    
    const banco = bancoInput.value.trim();
    const numero = numeroInput.value.trim();

    if (!banco || !numero) {
        alert("Preencha o Nome do Banco e o IBAN!");
        return;
    }

    const ibans = getIbans();
    ibans.push({ banco: banco, numero: numero });
    
    const usuario = getUsuarioAtivo();
    localStorage.setItem(`ibans_${usuario}`, JSON.stringify(ibans));
    
    bancoInput.value = "";
    numeroInput.value = "";
    updateIbanDisplays();
}

function removeIban(index) {
    if (confirm("Tens a certeza que desejas remover este IBAN?")) {
        const ibans = getIbans();
        ibans.splice(index, 1);
        
        const usuario = getUsuarioAtivo();
        localStorage.setItem(`ibans_${usuario}`, JSON.stringify(ibans));
        updateIbanDisplays();
    }
}

// Função para abrir e fechar a gaveta de links (3 pontos) no Mobile
    function toggleMobileDrawer() {
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');
        
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }