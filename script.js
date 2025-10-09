// =================== CONFIGURAÇÕES GERAIS ===================
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeForm();
    initializeLazyLoading();
});

// =================== MENU MOBILE ===================
function initializeMenu() {
    // Aguarda um pouco para garantir que o DOM está pronto
    setTimeout(function() {
        const menuToggle = document.getElementById("menu-toggle");
        const navbar = document.getElementById("navbar");

        console.log('=== INICIALIZANDO MENU ===');
        console.log('Menu toggle encontrado:', !!menuToggle);
        console.log('Navbar encontrado:', !!navbar);
        console.log('Window width:', window.innerWidth);

        if (!menuToggle || !navbar) {
            console.error('❌ Elementos do menu não encontrados');
            return;
        }

        // Função para alternar menu
        function toggleMenu() {
            console.log('🔄 Alternando menu...');
            navbar.classList.toggle('active');
            menuToggle.classList.toggle('open');
            console.log('Menu ativo:', navbar.classList.contains('active'));
        }

        // Função para fechar menu
        function closeMenu() {
            console.log('❌ Fechando menu...');
            navbar.classList.remove('active');
            menuToggle.classList.remove('open');
        }

        // Event listener principal
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Menu toggle clicado');
            toggleMenu();
        });

        // Fecha menu ao clicar em link
        navbar.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                console.log('🔗 Link clicado - fechando menu');
                closeMenu();
            }
        });

        // Fecha menu com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navbar.classList.contains('active')) {
                console.log('⌨️ ESC pressionado - fechando menu');
                closeMenu();
            }
        });

        // Fecha menu ao clicar fora (se necessário)
        document.addEventListener('click', function(e) {
            if (navbar.classList.contains('active') && 
                !navbar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                console.log('👆 Clique fora - fechando menu');
                closeMenu();
            }
        });

        console.log('✅ Menu inicializado com sucesso');
    }, 100);
}

// =================== FORMULÁRIO DE AGENDAMENTO ===================
function initializeForm() {
    const form = document.getElementById('formAgendamento');
    if (!form) return;

    const inputData = document.getElementById('data');
    const inputHora = document.getElementById('hora');
    const inputTelefone = document.getElementById('telefone');

    // Configura data mínima (hoje)
    if (inputData) {
        const hoje = new Date().toISOString().split('T')[0];
        inputData.setAttribute('min', hoje);
    }

    // Máscara para telefone
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            e.target.value = value;
        });
    }

    // Validação de data (não permite domingo e segunda)
    if (inputData) {
        inputData.addEventListener('change', function() {
            const dia = new Date(this.value).getDay();
            if (dia === 0 || dia === 1) {
                showNotification('A barbearia não funciona aos domingos e segundas-feiras.', 'error');
                this.value = '';
            }
        });
    }

    // Validação e envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome')?.trim(),
            telefone: formData.get('telefone')?.trim(),
            servico: formData.get('servico'),
            data: formData.get('data'),
            hora: formData.get('hora')
        };

        // Validações
        if (!validateForm(data)) return;

        // Envia para WhatsApp
        sendToWhatsApp(data);
    });
}

// =================== VALIDAÇÃO DO FORMULÁRIO ===================
function validateForm(data) {
    const { nome, telefone, servico, data, hora } = data;

    // Campos obrigatórios
    if (!nome || !telefone || !servico || !data || !hora) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return false;
    }

    // Validação do nome
    if (nome.length < 2) {
        showNotification('Nome deve ter pelo menos 2 caracteres.', 'error');
        return false;
    }

    // Validação do telefone
    const phoneDigits = telefone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showNotification('Telefone deve ter pelo menos 10 dígitos.', 'error');
        return false;
    }

    // Validação de data
    const dia = new Date(data).getDay();
    if (dia === 0 || dia === 1) {
        showNotification('A barbearia não funciona aos domingos e segundas-feiras.', 'error');
        return false;
    }

    // Validação de horário (09:00 às 18:00)
    const [horaInt, minutoInt] = hora.split(':').map(Number);
    if (horaInt < 9 || (horaInt === 18 && minutoInt > 0) || horaInt > 18) {
        showNotification('Horário de funcionamento: das 09h às 18h.', 'error');
        return false;
    }

    return true;
}

// =================== ENVIO PARA WHATSAPP ===================
function sendToWhatsApp(data) {
    const numero = "5581994201799";
    const mensagem = `💈 *Novo Agendamento - Veve Barbearia* 💈

👤 *Cliente:* ${data.nome}
📞 *Telefone:* ${data.telefone}
✂️ *Serviço:* ${data.servico}
📅 *Data:* ${formatDate(data.data)}
🕐 *Horário:* ${data.hora}

_Agendamento realizado através do site._`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    
    // Abre o WhatsApp
    window.open(url, '_blank');
    
    // Reseta o formulário
    document.getElementById('formAgendamento').reset();
    
    showNotification('Agendamento enviado com sucesso!', 'success');
}

// =================== FORMATAÇÃO DE DATA ===================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// =================== LAZY LOADING ===================
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sem suporte
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// =================== NOTIFICAÇÕES ===================
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Cores baseadas no tipo
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// =================== SMOOTH SCROLL ===================
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// =================== PERFORMANCE ===================
// Preload de imagens críticas
function preloadCriticalImages() {
    const criticalImages = [
        'img1.jpg',
        'logo.webp'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Inicia preload quando a página carrega
window.addEventListener('load', preloadCriticalImages);
