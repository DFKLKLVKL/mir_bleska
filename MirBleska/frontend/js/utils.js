// ===== КОНФИГУРАЦИЯ =====
const ADMIN_PASSWORD = 'ArtemVolik&';

// ===== ДАННЫЕ ПО УМОЛЧАНИЮ =====
const DEFAULT_BG = [
    'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg',
    'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg',
    'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg'
];

const DEFAULT_PRODUCTS = [
    { 
        id: 1, 
        title: 'Морская волна', 
        description: 'Эпоксидная смола с эффектом морской волны. Глубокий синий цвет с белыми переливами. Ручная работа.', 
        price: 8900, 
        dimensions: '60×40 см', 
        weight: '2.4 кг', 
        image: 'https://sun9-67.userapi.com/s/v1/ig2/RXPYEq3oXUoPjJML8pInoiLb1ujzUREpnsuFZ1ehavTBhNCkwSeSf_vcgr8--FJ3f5zsKXuSFY6Kx5JNIpjeGAOu.jpg?quality=95&as=32x48,48x72,72x107,108x161,160x239,240x358,360x537,480x716,540x805,640x955,720x1074,1080x1611,1168x1742&from=bu&u=7Izv1RhOqUW2IkF8aaxvPkcWWZaVZHVVjX_mgJGA_4&cs=640x0', 
        inStock: true, 
        featured: true, 
        label: 'hit' 
    },
    { 
        id: 2, 
        title: 'Золотое сияние', 
        description: 'Интерьерное панно с добавлением золотой потали. Тёплые оттенки создают атмосферу уюта и роскоши.', 
        price: 14500, 
        dimensions: '80×50 см', 
        weight: '3.8 кг', 
        image: 'https://sun9-3.userapi.com/s/v1/ig2/__hKhh8NyELRj3dzlNc7LEuGeRI81kKtGSeKcGz2WyHqYLEp8Ea2lgWj6u4RAjXILAeMARYqpTr0xJmQH_uVRBPD.jpg?quality=95&as=32x48,48x72,72x108,108x161,160x239,240x359,360x538,480x718,540x807,640x957,720x1077,856x1280&from=bu&u=OQ1GgqRI7Xnsl1nv-MkJRWO2jatDatfvTv0rsiFGyGU&cs=640x0', 
        inStock: true, 
        featured: true, 
        label: 'new' 
    },
    { 
        id: 3, 
        title: 'Лазурный берег', 
        description: 'Панно, вдохновлённое Азовским морем. Натуральный песок, ракушки и эпоксидная смола. Каждое изделие уникально.', 
        price: 12400, 
        dimensions: '70×45 см', 
        weight: '3.2 кг', 
        image: 'https://sun9-59.userapi.com/s/v1/ig2/-QVNydrjmSWbB21o6bnW0hif3fijMowsSfSpBIo0Pr6Sb-gZiCVSg5BoieZ7RBic8QkUTk7yYosjzLAKlLCmdl6S.jpg?quality=95&as=32x48,48x72,72x108,108x162,160x241,240x361,360x541,480x722,540x812,640x963,720x1083,851x1280&from=bu&u=BCbUNJqZgcpfJJK-8LudnInnSemS_kaEI6T78CPr_nI&cs=640x0', 
        inStock: true, 
        featured: true, 
        label: 'limited' 
    }
];

const DEFAULT_CONTENT = {
    address: 'Ейск, Таганрогская набережная, 15',
    phone: '+7 (861) 123-45-67',
    email: 'info@mirbleska.ru',
    vkUrl: '#',
    hero: { 
        subtitle: 'Студия эпоксидной смолы', 
        title: 'Искусство в каждой <span style="color: var(--secondary);">детали</span>', 
        description: 'Эксклюзивные изделия ручной работы с использованием натуральных материалов Азовского побережья' 
    },
    footer: { 
        copyright: '© 2025 Мир Блеска', 
        location: 'Сделано в Ейске · Азовское море' 
    }
};

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let siteContent = JSON.parse(localStorage.getItem('mirbleska_content')) || JSON.parse(JSON.stringify(DEFAULT_CONTENT));
let bgImages = JSON.parse(localStorage.getItem('mirbleska_bg')) || [...DEFAULT_BG];
let products = JSON.parse(localStorage.getItem('mirbleska_products')) || JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
let cart = JSON.parse(localStorage.getItem('mirbleska_cart')) || [];
let orders = JSON.parse(localStorage.getItem('mirbleska_orders')) || [];

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function notify(msg, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = msg;
    notification.classList.remove('hidden');
    notification.style.borderLeftColor = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--secondary)';
    clearTimeout(window.notifyTimeout);
    window.notifyTimeout = setTimeout(() => notification.classList.add('hidden'), duration);
}

function saveAll() {
    localStorage.setItem('mirbleska_bg', JSON.stringify(bgImages));
    localStorage.setItem('mirbleska_products', JSON.stringify(products));
    localStorage.setItem('mirbleska_cart', JSON.stringify(cart));
    localStorage.setItem('mirbleska_orders', JSON.stringify(orders));
    localStorage.setItem('mirbleska_content', JSON.stringify(siteContent));
}

function updateSiteContent() {
    const displayAddress = document.getElementById('displayAddress');
    const displayContacts = document.getElementById('displayContacts');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroTitle = document.getElementById('heroTitle');
    const heroDescription = document.getElementById('heroDescription');
    const footerCopyright = document.getElementById('footerCopyright');
    const footerLocation = document.getElementById('footerLocation');
    
    if (displayAddress) displayAddress.innerHTML = `📍 ${siteContent.address}`;
    if (displayContacts) displayContacts.innerHTML = `📞 ${siteContent.phone}`;
    if (heroSubtitle) heroSubtitle.textContent = siteContent.hero.subtitle;
    if (heroTitle) heroTitle.innerHTML = siteContent.hero.title;
    if (heroDescription) heroDescription.textContent = siteContent.hero.description;
    if (footerCopyright) footerCopyright.textContent = siteContent.footer.copyright;
    if (footerLocation) footerLocation.textContent = siteContent.footer.location;
}