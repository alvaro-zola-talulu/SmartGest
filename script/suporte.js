document.getElementById('suporteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede a página de recarregar

    // Captura os dados preenchidos pelo utilizador
    const nome = document.getElementById('support-name').value;
    const email = document.getElementById('support-email').value;
    const telefone = document.getElementById('support-phone').value;
    const assunto = document.getElementById('support-subject').value;
    const mensagem = document.getElementById('support-message').value;
    const dataEnvio = new Date().toLocaleString('pt-PT');

    // Estrutura o texto que vai dentro do ficheiro
    const conteudoFicheiro = `
=========================================
      NOVO PEDIDO DE SUPORTE - SMARTGEST
=========================================
Data de Envio: ${dataEnvio}
Nome: ${nome}
E-mail: ${email}
Telemóvel: ${telefone}
Assunto: ${assunto}
-----------------------------------------
Mensagem:
${mensagem}
=========================================
`;

    // Cria o ficheiro virtual em memória (Simulação de envio/armazenamento)
    const blob = new Blob([conteudoFicheiro], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    
    // Define o nome do ficheiro gerado
    link.download = `suporte_${nome.replace(/\s+/g, '_')}.txt`;
    link.href = window.URL.createObjectURL(blob);
    
    // Força o clique invisível para descarregar o ficheiro
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // =========================================================================
    // NOVO FEEDBACK VISUAL MODERNO (Substituiu o alert antigo de forma elegante)
    // =========================================================================
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = '#2563eb'; // Azul Identidade SmartGest
    toast.style.color = '#ffffff';
    toast.style.padding = '16px 28px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    toast.style.zIndex = '10000';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.95rem';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';

    // Conteúdo com ícone moderno de envio bem-sucedido
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #60a5fa; font-size: 1.2rem;"></i> <span>Obrigado, ${nome}! Pedido processado com sucesso.</span>`;

    document.body.appendChild(toast);

    // Animação de entrada suave (Fade-in + deslizar para cima)
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 50);

    // Limpa o formulário imediatamente para dar sensação de envio concluído
    document.getElementById('suporteForm').reset();

    // Remove a notificação do ecrã automaticamente após 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
});