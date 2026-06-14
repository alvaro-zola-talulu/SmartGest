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

    // Cria o ficheiro virtual em memória
    const blob = new Blob([conteudoFicheiro], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    
    // Define o nome do ficheiro gerado
    link.download = `suporte_${nome.replace(/\s+/g, '_')}.txt`;
    link.href = window.URL.createObjectURL(blob);
    
    // Força o clique invisível para descarregar o ficheiro
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Feedback visual de sucesso e limpa o formulário
    alert('Obrigado, ' + nome + '! O seu pedido de suporte foi processado (Ficheiro de texto gerado).');
    document.getElementById('suporteForm').reset();
});