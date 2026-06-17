// --- EmailJS config ---
// 1. Crée un compte gratuit sur https://www.emailjs.com/
// 2. Ajoute un service email (Gmail, Outlook, etc.) → récupère le Service ID
// 3. Crée un template avec les variables: name, email, phone, message, estimate
// 4. Va dans Account > API Keys → récupère ta Public Key
// 5. Remplace les valeurs ci-dessous:
const EMAILJS_CONFIG = {
    publicKey: '5q7yOx8fNiGNmsj8q',
    serviceID: 'service_ylfw2uh',
    templateID: 'template_8zvkq8c'
};

// Force dark mode
document.documentElement.classList.add('dark');
localStorage.theme = 'dark';

// Mobile drawer toggling
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Pôle Web & app grid Filtering system
const filterBtns = document.querySelectorAll('#techFilters button');
const techCards = document.querySelectorAll('#techGrid .tech-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('bg-brandCyan', 'text-brandDark', 'active'));
        filterBtns.forEach(b => b.classList.add('bg-brandBlue', 'text-slate-300'));
        
        btn.classList.add('bg-brandCyan', 'text-brandDark', 'active');
        btn.classList.remove('bg-brandBlue', 'text-slate-300');

        const filterVal = btn.getAttribute('data-filter');

        techCards.forEach(card => {
            const cardCats = card.getAttribute('data-category').split(' ');
            if (filterVal === 'all' || cardCats.includes(filterVal)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Dynamic Interactive day/night slider logic
const simulatorFrame = document.getElementById('simulatorFrame');
const dayLayer = document.getElementById('dayLayer');
const sliderHandle = document.getElementById('sliderHandle');

if (simulatorFrame && dayLayer && sliderHandle) {
    function moveSlider(e) {
        const rect = simulatorFrame.getBoundingClientRect();
        let pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
        let positionX = pageX - rect.left - window.scrollX;
        
        // Lock inside simulator width
        if (positionX < 0) positionX = 0;
        if (positionX > rect.width) positionX = rect.width;

        let percentage = (positionX / rect.width) * 100;
        dayLayer.style.width = percentage + '%';
        sliderHandle.style.left = percentage + '%';
    }

    // Mouse events
    simulatorFrame.addEventListener('mousemove', moveSlider);
    // Touch events for mobiles
    simulatorFrame.addEventListener('touchmove', moveSlider);
}

// REAL-TIME ESTIMATOR & INVOICE CALCULATOR SYSTEM
const calcForm = document.getElementById('calculatorForm');
const cameraQtyInput = document.getElementById('camera_qty');
const cameraValText = document.getElementById('camera_val');
const solarCheckbox = document.getElementById('solar_power');
const routerCheckbox = document.getElementById('modem_4g');
const invoiceItems = document.getElementById('invoice_items');
const approxGnf = document.getElementById('approx_gnf');
const approxEur = document.getElementById('approx_eur');

// Approx standard pricing (modifiable variables)
const PRICES = {
    site_vitrine: 3500000,    // ~375 EUR in GNF
    site_ecommerce: 8000000,  // ~860 EUR in GNF
    mobile_app: 6000000,     // ~645 EUR in GNF
    windows_app: 12000000,   // ~1300 EUR in GNF
    camera_base: 1500000,     // Prix par caméra avec installation incluse
    solar_add: 900000,        // Supplément kit solaire par unité de caméra
    router_add: 850000        // Supplément modem 4G global
};

function recalculateEstimator() {
    if (!calcForm || !cameraQtyInput || !cameraValText || !invoiceItems || !approxGnf || !approxEur) return;

    // Read all checkboxed types
    const selectedWebTypes = Array.from(document.querySelectorAll('input[name="web_type"]:checked')).map(el => el.value);
    const cameraQty = parseInt(cameraQtyInput.value, 10);
    const useSolar = solarCheckbox ? solarCheckbox.checked : false;
    const use4G = routerCheckbox ? routerCheckbox.checked : false;

    cameraValText.innerText = cameraQty;

    let finalPriceGNF = 0;
    let receiptHtml = '';

    // 1. Web additions
    if (selectedWebTypes.includes('site_vitrine')) {
        finalPriceGNF += PRICES.site_vitrine;
        receiptHtml += `<div class="flex justify-between text-xs"><span>Site Web Vitrine :</span><span class="font-mono text-brandCyan">3 500 000 GNF</span></div>`;
    }
    if (selectedWebTypes.includes('site_ecommerce')) {
        finalPriceGNF += PRICES.site_ecommerce;
        receiptHtml += `<div class="flex justify-between text-xs"><span>E-Commerce Complet :</span><span class="font-mono text-brandCyan">8 000 000 GNF</span></div>`;
    }
    if (selectedWebTypes.includes('mobile_app')) {
        finalPriceGNF += PRICES.mobile_app;
        receiptHtml += `<div class="flex justify-between text-xs"><span>App Mobile Android & iOS :</span><span class="font-mono text-emerald-500">6 000 000 GNF</span></div>`;
    }
    if (selectedWebTypes.includes('windows_app')) {
        finalPriceGNF += PRICES.windows_app;
        receiptHtml += `<div class="flex justify-between text-xs"><span>Application Windows (UWP) :</span><span class="font-mono text-brandCyan">12 000 000 GNF</span></div>`;
    }

    // 2. Camera additions
    if (cameraQty > 0) {
        let cameraSubtotal = cameraQty * PRICES.camera_base;
        receiptHtml += `<div class="flex justify-between text-xs"><span>Vidéosurr. (${cameraQty} Caméras IP IR) :</span><span class="font-mono text-brandOrange">${cameraSubtotal.toLocaleString()} GNF</span></div>`;
        finalPriceGNF += cameraSubtotal;

        if (useSolar) {
            let solarCost = cameraQty * PRICES.solar_add;
            receiptHtml += `<div class="flex justify-between text-xs"><span>Autonomie Solaire (x${cameraQty}) :</span><span class="font-mono text-slate-400">+${solarCost.toLocaleString()} GNF</span></div>`;
            finalPriceGNF += solarCost;
        }
    }

    // 3. Router addition
    if (use4G && cameraQty > 0) {
        finalPriceGNF += PRICES.router_add;
        receiptHtml += `<div class="flex justify-between text-xs"><span>Routeur Réseau 4G Sim :</span><span class="font-mono text-slate-400">+${PRICES.router_add.toLocaleString()} GNF</span></div>`;
    }

    if (!selectedWebTypes.length && cameraQty === 0) {
        invoiceItems.innerHTML = '<div class="text-sm text-slate-400 italic">Veuillez cocher ou sélectionner des options pour estimer le coût de votre projet d\'infrastructure.</div>';
        approxGnf.innerText = '0 GNF';
        approxEur.innerText = '~0 €';
        return;
    }

    invoiceItems.innerHTML = `<div class="space-y-3 font-semibold text-slate-200">${receiptHtml}</div>`;
    approxGnf.innerText = `${finalPriceGNF.toLocaleString()} GNF`;
    
    // convert to euro for presentation purposes (~1 EUR = 9300 GNF as indicative calculation)
    let conversionEur = Math.round(finalPriceGNF / 9300);
    approxEur.innerText = `~${conversionEur.toLocaleString()} €`;
}

if (calcForm) calcForm.addEventListener('change', recalculateEstimator);
if (cameraQtyInput) cameraQtyInput.addEventListener('input', recalculateEstimator);

window.sendCalculatedQuote = function() {
    // Pre-fill the contact form inputs below
    const totalGNF = approxGnf ? approxGnf.innerText : '0 GNF';
    const textToInsert = `Bonjour, je souhaite obtenir un devis final. Mon estimation préliminaire : ${totalGNF}. Merci de me recontacter.`;
    
    const messageEl = document.getElementById('message');
    if (messageEl) messageEl.value = textToInsert;
    // Scroll user smoothly to contact
    const contactEl = document.getElementById('contact');
    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
}

// Portfolio Filtering system
const portFilterBtns = document.querySelectorAll('#portfolioFilters button');
const portfolioItems = document.querySelectorAll('#portfolioGrid .portfolio-item');

if (portFilterBtns.length > 0) {
    portFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            portFilterBtns.forEach(b => {
                b.classList.remove('bg-brandCyan', 'text-brandDark', 'active');
                b.classList.add('bg-brandBlue', 'text-slate-300');
            });
            
            btn.classList.add('bg-brandCyan', 'text-brandDark', 'active');
            btn.classList.remove('bg-brandBlue', 'text-slate-300');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    // Optional: trigger an entry animation
                    item.classList.add('animate-fade-in');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact Form Handle
window.handleContactSubmit = async function(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('formSuccess');

    const originalBtnText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Envoi en cours...';

    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        estimate: document.getElementById('approx_gnf')?.innerText || 'Non spécifié'
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: EMAILJS_CONFIG.serviceID,
                template_id: EMAILJS_CONFIG.templateID,
                user_id: EMAILJS_CONFIG.publicKey,
                template_params: templateParams
            })
        });

        if (response.ok) {
            successEl.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
                successEl.classList.add('hidden');
            }, 5000);
        } else {
            const text = await response.text();
            alert("Erreur " + response.status + " : " + text);
        }
    } catch (error) {
        alert("Erreur réseau : " + error.message);
    } finally {
        button.disabled = false;
        button.innerHTML = originalBtnText;
    }
}

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.section-reveal').forEach(el => revealObserver.observe(el));
