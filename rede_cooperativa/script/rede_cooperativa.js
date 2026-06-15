document.addEventListener("DOMContentLoaded", () => {
    // 1. Verifica se existe utilizador ativo na sessão
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    
    if (!usuarioLogado) {
        // Se não houver sessão ativa, expulsa para o login
        console.warn("SmartGest: Acesso negado. Redirecionando para o login...");
        window.location.href = '../index.html'; // Ajustado o caminho caso a rede esteja numa subpasta
        return;
    }

    // 2. Captura os elementos do cabeçalho da Rede Cooperativa
    const elemDisplayName = document.getElementById('user-display-name');
    const elemAvatar = document.getElementById('user-avatar');

    // 3. Renderiza o nome completo do empreendedor
    if (elemDisplayName) {
        elemDisplayName.innerText = usuarioLogado.nome;
    }
    
    // 4. Renderiza a inicial no círculo do Avatar (com fallback de segurança)
    if (elemAvatar) {
        if (usuarioLogado.inicial) {
            elemAvatar.innerText = usuarioLogado.inicial;
        } else if (usuarioLogado.nome) {
            // Se não houver a propriedade .inicial, extrai a primeira letra do nome
            elemAvatar.innerText = usuarioLogado.nome.charAt(0).toUpperCase();
        } else {
            elemAvatar.innerText = "U";
        }
    }
    
    console.log("Interface da Rede Cooperativa carregada com sucesso para o utilizador:", usuarioLogado.nome);
});