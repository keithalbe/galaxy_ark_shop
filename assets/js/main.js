const DATA_PATH = './assets/data/cards.json';

const STAT_INFO = {
    Health: { color: 'rgba(142, 68, 173, 0.34)', icon: './img/stats/health.png' },
    Stamina: { color: 'rgba(56, 200, 138, 0.34)', icon: './img/stats/stamina.png' },
    Food: { color: 'rgba(255, 107, 53, 0.34)', icon: './img/stats/food.png' },
    Water: { color: 'rgba(74, 163, 255, 0.34)', icon: './img/stats/water.png' },
    Weight: { color: 'rgba(74, 163, 255, 0.28)', icon: './img/stats/weight.png' },
    Oxygen: { color: 'rgba(74, 163, 255, 0.40)', icon: './img/stats/oxygen.png' },
    Melee: { color: 'rgba(255, 107, 53, 0.40)', icon: './img/stats/melee.png' },
    Speed: { color: 'rgba(56, 200, 138, 0.40)', icon: './img/stats/speed.png' }
};

const CURRENCY_INFO = {
    Element: { rate: 1, icon: './img/currency/element.png' },
    Polymer: { rate: 20, icon: './img/currency/polymer.png' },
    'Metal Ingot': { rate: 30, icon: './img/currency/metal_ingot.png' }
};

const CART_KEY = 'galaxy_cart_v1';

// Discord webhook that receives orders when the buyer clicks "Buy Now".
// NOTE: this URL is embedded in the page and is visible to anyone who views
// the site source, so treat it as public. Leave it empty to disable sending —
// the button then falls back to copying the order to the clipboard.
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1546295798923268178/Ntj-x-jnw64wUjhJEzbBPhZDcY4Cbk_f6UxdJPX9CfqUDwGn_zxp_wV-rJ9ka3MpMtDp';

const VARIANT_INFO = {
    Base: { color: '#8e44ad' },
    Arkology: { color: '#38c88a' },
    Scorched: { color: '#ff6b35' },
    Aberrant: { color: '#4aa3ff' }
};

let cards = [];
function hexToRgb(hex) {
    if (!hex) return null;
    const c = hex.replace('#', '');
    if (c.length !== 6) return null;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return { r, g, b };
}

function getColor(stat) {
    const entry = STAT_INFO[stat];
    if (!entry) return '#3a3a3a';
    return typeof entry === 'string' ? entry : (entry.color || '#3a3a3a');
}

function getIcon(stat) {
    const entry = STAT_INFO[stat];
    if (entry && typeof entry === 'object' && entry.icon) return entry.icon;
    return null;
}

function getCurrencyInfo(currency) {
    return CURRENCY_INFO[currency] || null;
}

function renderCards(list) {
    const items = list || cards;
    const container = document.getElementById('cardsContainer');

    container.innerHTML = items.map(card => `
        <article class="card">
            ${card.warning ? `<div class="warning-badge warning-overlay" title="${card.warning}">! ${card.warning}</div>` : ''}
            <img src="${card.image}" alt="${card.name}" class="card-image">
            <div class="card-content">
                <div class="card-header">
                    <div class="card-name">${card.name}</div>
                    <div class="level-badge">LVL ${card.level || 1}</div>
                </div>
                <div class="variant-badges">
                    ${(card.variants || []).map(variant => {
                        const variantInfo = VARIANT_INFO[variant] || { color: '#ffffff' };
                        const rgb = hexToRgb(variantInfo.color);
                        const bg = rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.16)` : 'rgba(255,255,255,0.06)';
                        const border = rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)` : 'rgba(255,255,255,0.2)';
                        return `<div class="variant-badge" style="color:${variantInfo.color};background:${bg};border-color:${border};">${variant}</div>`;
                    }).join('')}
                </div>
                <div class="card-description">${card.description}</div>
                <div class="card-stats">
                    ${Object.entries(card.stats || {}).map(([stat, value]) => {
                        const bg = getColor(stat);
                        const uri = getIcon(stat);
                        const iconHtml = `<img class="stat-icon" src="${uri}" alt="${stat} icon">`;
                        return `<div class="stat" style="background:${bg};color:#fff"><div class="stat-left">${iconHtml}</div><span>${value}</span></div>`;
                    }).join('')}
                </div>

                <div class="divider"></div>

                <div class="costs-section">
                    <div class="prices-grid">
                        <div class="price-block">
                            <div class="costs-subtitle">Single</div>
                            <div class="card-costs-grid">
                            ${Object.keys(CURRENCY_INFO).map(currency => {
                                const cInfo = getCurrencyInfo(currency);
                                const iconHtml = cInfo && cInfo.icon
                                    ? `<img class="cost-icon" src="${cInfo.icon}" alt="${currency} icon">`
                                    : `<span class="cost-icon"></span>`;
                                const elementAmount = card.costs && card.costs.Element ? Number(card.costs.Element) : 0;
                                const single = elementAmount * (cInfo && typeof cInfo.rate === 'number' ? cInfo.rate : 0);
                                const displaySingle = Number.isInteger(single) ? single : single.toFixed(2);
                                return `<div class="cost">${iconHtml}<span class="currency-amount">${displaySingle}</span></div>`;
                            }).join('')}
                            </div>
                        </div>

                        <div class="price-block">
                            <div class="costs-subtitle">Pair (10% off)</div>
                            <div class="card-costs-grid">
                            ${Object.keys(CURRENCY_INFO).map(currency => {
                                const cInfo = getCurrencyInfo(currency);
                                const iconHtml = cInfo && cInfo.icon
                                    ? `<img class="cost-icon" src="${cInfo.icon}" alt="${currency} icon">`
                                    : `<span class="cost-icon"></span>`;
                                const elementAmount = card.costs && card.costs.Element ? Number(card.costs.Element) : 0;
                                const single = elementAmount * (cInfo && typeof cInfo.rate === 'number' ? cInfo.rate : 0);
                                const pair = single * 2 * 0.9;
                                const displayPair = Number.isInteger(pair) ? pair : pair.toFixed(2);
                                return `<div class="cost">${iconHtml}<span class="currency-amount">${displayPair}</span></div>`;
                            }).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <button class="add-cart-btn" type="button" data-name="${card.name}">Add to Cart</button>
            </div>
        </article>
    `).join('');
}

function searchCards() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    let results = activeFilter === 'all'
        ? cards.slice()
        : cards.filter(card => {
            if (Array.isArray(card.category)) {
                return card.category.some(cat => String(cat).toLowerCase() === activeFilter);
            }
            return String(card.category || '').toLowerCase() === activeFilter;
        });

    if (searchTerm) {
        results = results.filter(card =>
            (card.name && card.name.toLowerCase().includes(searchTerm))
            || (card.description && card.description.toLowerCase().includes(searchTerm))
        );
    }

    renderCards(results);
}

function setupSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', searchCards);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            searchCards();
        });
    });
}

function setupStarfield() {
    const sf = document.getElementById('starfield');
    const ctx = sf.getContext('2d');

    function drawStars() {
        const width = sf.width;
        const height = sf.height;
        ctx.clearRect(0, 0, width, height);
        const numStars = Math.random() * 200 + 400;
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 2 + 0.2;
            const brightness = Math.random();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${brightness})`;
            ctx.shadowBlur = Math.random() * 4 + 1;
            ctx.shadowColor = 'white';
            ctx.fill();
        }
    }

    function resizeCanvas() {
        sf.width = window.innerWidth;
        sf.height = window.innerHeight;
        drawStars();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

async function loadCards() {
    const response = await fetch(DATA_PATH);
    if (!response.ok) {
        throw new Error(`Could not load cards data (${response.status})`);
    }
    const data = await response.json();
    return data.map(card => ({
        ...card,
        category: card.category || 'dinosaur'
    }));
}

/* ---------------------------------------------------------------------------
 * Shopping cart
 * -------------------------------------------------------------------------*/

let cart = loadCart();

function loadCart() {
    try {
        const stored = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findCard(name) {
    return cards.find(card => card.name === name);
}

function formatAmount(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

// Price of a single unit paid in the given currency (Element amount * rate).
function perUnitCost(card, currency) {
    const cInfo = getCurrencyInfo(currency);
    const rate = cInfo && typeof cInfo.rate === 'number' ? cInfo.rate : 0;
    const element = card && card.costs && card.costs.Element ? Number(card.costs.Element) : 0;
    return element * rate;
}

// Every complete pair of 2 gets 10% off (matches the card "Pair (10% off)"
// price); any leftover single is charged at full price.
function lineTotal(card, currency, qty) {
    const unit = perUnitCost(card, currency);
    const pairs = Math.floor(qty / 2);
    const singles = qty % 2;
    return pairs * (unit * 2 * 0.9) + singles * unit;
}

function cartCount() {
    return cart.reduce((sum, line) => sum + line.qty, 0);
}

// Sum per currency, since currency is chosen per line item.
function cartTotals() {
    const totals = {};
    cart.forEach(line => {
        const card = findCard(line.name);
        if (!card) return;
        totals[line.currency] = (totals[line.currency] || 0) + lineTotal(card, line.currency, line.qty);
    });
    return totals;
}

function addToCart(name) {
    const line = cart.find(l => l.name === name);
    if (line) {
        line.qty += 1;
    } else {
        cart.push({ name, currency: 'Element', qty: 1 });
    }
    saveCart();
    renderCart();
    openCart();
}

function setQty(name, qty) {
    const line = cart.find(l => l.name === name);
    if (!line) return;
    if (qty < 1) {
        removeFromCart(name);
        return;
    }
    line.qty = qty;
    saveCart();
    renderCart();
}

function setCurrency(name, currency) {
    const line = cart.find(l => l.name === name);
    if (!line || !CURRENCY_INFO[currency]) return;
    line.currency = currency;
    saveCart();
    renderCart();
}

function removeFromCart(name) {
    cart = cart.filter(line => line.name !== name);
    saveCart();
    renderCart();
}

function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartBackdrop').classList.add('open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartBackdrop').classList.remove('open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
}

function currencyIcon(currency) {
    const cInfo = getCurrencyInfo(currency);
    return cInfo && cInfo.icon
        ? `<img src="${cInfo.icon}" alt="${currency} icon">`
        : '';
}

function renderCart() {
    // Drop any lines whose card no longer exists in the data.
    cart = cart.filter(line => findCard(line.name));
    saveCart();

    const badge = document.getElementById('cartCount');
    if (badge) {
        const count = cartCount();
        badge.textContent = count;
        badge.classList.toggle('empty', count === 0);
    }

    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');
    if (!body || !foot) return;

    if (cart.length === 0) {
        body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        foot.innerHTML = '';
        return;
    }

    body.innerHTML = cart.map(line => {
        const card = findCard(line.name);
        const total = lineTotal(card, line.currency, line.qty);
        const currencyBtns = Object.keys(CURRENCY_INFO).map(currency => `
            <button class="cur-btn ${currency === line.currency ? 'active' : ''}" type="button"
                    data-act="cur" data-name="${line.name}" data-cur="${currency}" title="${currency}">
                ${currencyIcon(currency)}
            </button>`).join('');

        return `
            <div class="cart-line">
                <img class="cart-thumb" src="${card.image}" alt="${card.name}">
                <div class="cart-line-main">
                    <div class="cart-line-name">${card.name}</div>
                    <div class="cart-cur">${currencyBtns}</div>
                    <div class="cart-line-row">
                        <div class="cart-qty">
                            <button type="button" data-act="dec" data-name="${line.name}" aria-label="Decrease quantity">&minus;</button>
                            <span>${line.qty}</span>
                            <button type="button" data-act="inc" data-name="${line.name}" aria-label="Increase quantity">+</button>
                        </div>
                        <div class="cart-line-total">${currencyIcon(line.currency)}<span>${formatAmount(total)}</span></div>
                    </div>
                </div>
                <button class="cart-remove" type="button" data-act="remove" data-name="${line.name}" aria-label="Remove ${card.name}">&times;</button>
            </div>`;
    }).join('');

    const totals = cartTotals();
    const totalsHtml = Object.entries(totals).map(([currency, value]) => `
        <div class="cart-total-pill">${currencyIcon(currency)}<span>${formatAmount(value)}</span></div>`).join('');

    foot.innerHTML = `
        <div class="cart-totals">
            <span class="cart-totals-label">Total</span>
            <div class="cart-totals-pills">${totalsHtml}</div>
        </div>
        <button class="cart-buy" type="button" id="cartBuy">Buy Now</button>`;

    document.getElementById('cartBuy').addEventListener('click', sendOrder);
}

function orderToText() {
    const rows = cart.map(line => {
        const card = findCard(line.name);
        const total = lineTotal(card, line.currency, line.qty);
        return `• ${line.qty}× ${card.name} — ${formatAmount(total)} ${line.currency}`;
    });
    const totals = Object.entries(cartTotals())
        .map(([currency, value]) => `${formatAmount(value)} ${currency}`)
        .join('   |   ');
    return `**New GALAXY order**\n${rows.join('\n')}\n\n**Total:** ${totals}`;
}

async function sendOrder() {
    if (cart.length === 0) return;
    const text = orderToText();

    if (!DISCORD_WEBHOOK_URL) {
        try {
            await navigator.clipboard.writeText(text);
            alert('Order copied to your clipboard — send it to us to complete your purchase.\n\n(No Discord webhook is configured yet.)');
        } catch (error) {
            alert('Order summary:\n\n' + text);
        }
        return;
    }

    const buyBtn = document.getElementById('cartBuy');
    if (buyBtn) {
        buyBtn.disabled = true;
        buyBtn.textContent = 'Sending…';
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text })
        });
        if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
        cart = [];
        saveCart();
        renderCart();
        closeCart();
        alert('Order sent! We\'ll reach out on Discord to arrange the trade.');
    } catch (error) {
        console.error('Order send failed:', error);
        if (buyBtn) {
            buyBtn.disabled = false;
            buyBtn.textContent = 'Buy Now';
        }
        alert('Sorry, we could not send your order. Please try again or contact us directly.');
    }
}

function setupCart() {
    // Inject the drawer + backdrop once.
    const wrap = document.createElement('div');
    wrap.innerHTML = `
        <div class="cart-backdrop" id="cartBackdrop"></div>
        <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping cart" aria-hidden="true">
            <div class="cart-head">
                <h2>Your Cart</h2>
                <button class="cart-close" type="button" id="cartClose" aria-label="Close cart">&times;</button>
            </div>
            <div class="cart-body" id="cartBody"></div>
            <div class="cart-foot" id="cartFoot"></div>
        </aside>`;
    while (wrap.firstElementChild) {
        document.body.appendChild(wrap.firstElementChild);
    }

    document.getElementById('cartToggle').addEventListener('click', openCart);
    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('cartBackdrop').addEventListener('click', closeCart);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeCart();
    });

    // Add-to-cart (delegated — cards are re-rendered on search/filter).
    document.getElementById('cardsContainer').addEventListener('click', event => {
        const btn = event.target.closest('.add-cart-btn');
        if (btn) addToCart(btn.dataset.name);
    });

    // Cart line controls (delegated).
    document.getElementById('cartBody').addEventListener('click', event => {
        const btn = event.target.closest('[data-act]');
        if (!btn) return;
        const name = btn.dataset.name;
        const line = cart.find(l => l.name === name);
        switch (btn.dataset.act) {
            case 'inc': setQty(name, (line ? line.qty : 0) + 1); break;
            case 'dec': setQty(name, (line ? line.qty : 0) - 1); break;
            case 'remove': removeFromCart(name); break;
            case 'cur': setCurrency(name, btn.dataset.cur); break;
        }
    });

    renderCart();
}

async function init() {
    try {
        cards = await loadCards();
        setupSearchAndFilters();
        setupStarfield();
        renderCards();
        setupCart();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

init();
