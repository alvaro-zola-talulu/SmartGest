document.addEventListener("DOMContentLoaded", () => {
    // Verifica se existe utilizador ativo na sessão
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_sessao'));
    
    if (!usuarioLogado) {
        // Se não houver sessão ativa, expulsa para o login
        window.location.href = 'index.html';
        return;
    }

    // Renderiza o nome e a inicial do utilizador no header da rede cooperativa
    const elemDisplayName = document.getElementById('user-display-name');
    const elemAvatar = document.getElementById('user-avatar');

    if (elemDisplayName) elemDisplayName.innerText = usuarioLogado.nome;
    if (elemAvatar) elemAvatar.innerText = usuarioLogado.inicial;
    
    console.log("Interface da Rede Cooperativa carregada com sucesso para o usuário:", usuarioLogado.nome);
});