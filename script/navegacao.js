document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ANIMAÇÃO AO FAZER SCROLL (ROLAGEM)
    // ==========================================
    const seccoes = document.querySelectorAll('.scroll-fade');

    const opcoesObserver = {
        root: null,         // Usa o ecrã do navegador como referência
        rootMargin: "0px",  // Sem margens extra
        threshold: 0.15     // Ativa a animação quando 15% da secção estiver visível
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se a secção entrou na área visível do ecrã
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                // Opcional: desativa o observador para a secção não sumir se subir de novo
                observer.unobserve(entry.target); 
            }
        });
    }, opcoesObserver);

    // Ativar o observador em cada uma das secções
    seccoes.forEach(seccao => {
        scrollObserver.observe(seccao);
    });


    // ==========================================
    // 2. CORREÇÃO DO CLIQUE SUAVE NO MENU
    // ==========================================
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Força a aparição imediata se o utilizador clicou diretamente no menu
                targetSection.classList.add('visivel');
                
                // Faz o deslize suave
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});