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
    Polymer: { rate: 10, icon: './img/currency/polymer.png' },
    'Metal Ingot': { rate: 20, icon: './img/currency/metal_ingot.png' }
};

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

async function init() {
    try {
        cards = await loadCards();
        setupSearchAndFilters();
        setupStarfield();
        renderCards();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

init();
