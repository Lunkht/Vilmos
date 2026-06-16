// Theme light/dark state toggle
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Auto check darkmode preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-lg text-amber-500 animate-spin-slow';
} else {
    document.documentElement.classList.remove('dark');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-lg text-slate-700';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-lg text-slate-700';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-lg text-amber-500';
        }
    });
}

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
        // reset actives
        filterBtns.forEach(b => b.classList.remove('bg-brandCyan', 'text-brandDark', 'active'));
        filterBtns.forEach(b => b.classList.add('bg-slate-100', 'dark:bg-brandBlue', 'text-slate-700', 'dark:text-slate-300'));
        
        btn.classList.add('bg-brandCyan', 'text-brandDark', 'active');
        btn.classList.remove('bg-slate-100', 'dark:bg-brandBlue', 'text-slate-700', 'dark:text-slate-300');

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
    const textToInsert = `Bonjour, je souhaite obtenir un devis final pour une infrastructure estimée à ${totalGNF}. Merci de me recontacter pour planifier l'étude technique.`;
    
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
            // Reset active button state
            portFilterBtns.forEach(b => {
                b.classList.remove('bg-brandCyan', 'text-brandDark', 'active');
                b.classList.add('bg-white', 'dark:bg-brandBlue', 'text-slate-600', 'dark:text-slate-300');
            });
            
            btn.classList.add('bg-brandCyan', 'text-brandDark', 'active');
            btn.classList.remove('bg-white', 'dark:bg-brandBlue', 'text-slate-600', 'dark:text-slate-300');

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
    const data = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('formSuccess');

    // UI Loading state
    const originalBtnText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Envoi en cours...';

    try {
        // Use Formspree (replace with your ID later or use this for demo)
        const response = await fetch('https://formspree.io/f/mqkrpvyy', {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            successEl.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
                successEl.classList.add('hidden');
            }, 5000);
        } else {
            alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        }
    } catch (error) {
        alert("Erreur de connexion. Vérifiez votre accès internet.");
    } finally {
        button.disabled = false;
        button.innerHTML = originalBtnText;
    }
}
