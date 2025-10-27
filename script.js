// Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1200);
});

// Header Scroll Effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenu.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Fade In Animation on Scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    fadeInObserver.observe(element);
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Scroll to Top Button
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// File Upload
const fileInput = document.getElementById('file');
const fileName = document.getElementById('fileName');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        const names = files.map(file => file.name).join(', ');
        fileName.textContent = names.length > 50 ? names.substring(0, 50) + '...' : names;
    } else {
        fileName.textContent = 'Clique para escolher arquivos';
    }
});

// Contact Form Submission COM WEBHOOK N8N
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Enviando...';

    const formData = new FormData(contactForm);

    try {
        // IMPORTANTE: Troque pela URL do seu webhook n8n
        const webhookURL = 'https://n8noraclefull.t3c0t4z.shop/webhook/envia_email_wpp';

        const response = await fetch(webhookURL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Sucesso
            alert('✅ Mensagem e arquivos enviados com sucesso!\n\nA equipe da Dra. Isabela entrará em contato em breve.');
    
            // Reset form
            contactForm.reset();
            document.getElementById('fileName').textContent = 'Clique para escolher arquivos';
        } else {
            throw new Error('Erro na resposta do servidor');
        }

    } catch (error) {
        console.error('Erro ao enviar:', error);

        // Fallback: Se der erro, abre WhatsApp
        alert('⚠️ Houve um problema ao enviar o formulário.\n\nVocê será redirecionado para o WhatsApp.');

        const data = Object.fromEntries(formData);
        const whatsappMsg = `*Nova Mensagem do Site*%0A%0A*Nome:* ${encodeURIComponent(data.name)}%0A*E-mail:* ${encodeURIComponent(data.email)}%0A*Telefone:* ${encodeURIComponent(data.phone)}%0A*Área:* ${encodeURIComponent(data.subject)}%0A*Mensagem:* ${encodeURIComponent(data.message)}%0A%0A_Obs: Não foi possível enviar arquivos pelo formulário. Por favor, envie os documentos por aqui._`;

        window.open(`https://wa.me/5521982862471?text=${whatsappMsg}`, '_blank');

    } finally {
        // Reativa o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Counter Animation for Stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const isPercentage = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            if (hasPlus) {
                element.textContent = `+${target}`;
            } else if (isPercentage) {
                element.textContent = `${target}%`;
            } else {
                element.textContent = `${target}h`;
            }
            clearInterval(timer);
        } else {
            if (hasPlus) {
                element.textContent = `+${Math.floor(current)}`;
            } else if (isPercentage) {
                element.textContent = `${Math.floor(current)}%`;
            } else {
                element.textContent = `${Math.floor(current)}h`;
            }
        }
    }, 30);
};

// Observe stats cards
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const h4 = entry.target.querySelector('h4');
            const text = h4.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number > 0) {
                h4.textContent = '0';
                setTimeout(() => {
                    animateCounter(h4, number);
                }, 200);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Add active class to nav links based on scroll position
const sections = document.querySelectorAll('section[id]');

const updateActiveNav = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            navLink?.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveNav);

// Parallax Effect for Hero Section
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroText = document.querySelector('.hero-text');
            const heroImage = document.querySelector('.hero-image');
            
            if (heroText && heroImage && scrolled < window.innerHeight) {
                heroText.style.transform = `translateY(${scrolled * 0.15}px)`;
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});
