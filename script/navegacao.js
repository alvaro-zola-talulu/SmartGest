document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o salto seco/brusco padrão do HTML
        
        // Obtém o ID da secção alvo (ex: #recursos, #sobre, #desenvolvedores, #suporte)
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // 1. Remove o efeito visual de qualquer outra secção ativa antes
            document.querySelectorAll('section').forEach(sec => {
                sec.classList.remove('seccao-fade', 'visivel');
            });

            // 2. Aplica a preparação do fade na secção escolhida
            targetSection.classList.add('seccao-fade');

            // 3. Faz o scroll suave até à secção
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // 4. Ativa o Fade-In (com um mini atraso para dar tempo ao scroll iniciar)
            setTimeout(() => {
                targetSection.classList.add('visivel');
            }, 100);
        }
    });
});