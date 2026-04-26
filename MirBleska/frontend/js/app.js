// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentBgIndex = 0;
let currentTab = 'products';
let bgInterval = null;
let deferredPrompt = null;

// ===== РЕНДЕРИНГ ФОНОВ =====
function renderBackgrounds() {
    const bgContainer = document.getElementById('backgroundContainer');
    if (!bgContainer) return;
    bgContainer.innerHTML = '';
    if (bgImages.length === 0) bgImages = [...DEFAULT_BG];
    bgImages.forEach((url, i) => {
        const div = document.createElement('div');
        div.className = 'bg-slide' + (i === currentBgIndex ? ' active' : '');
        div.style.backgroundImage = `url('${url}')`;
        bgContainer.appendChild(div);
    });
}

function startBgRotation() {
    if (bgInterval) clearInterval(bgInterval);
    bgInterval = setInterval(() => {
        if (bgImages.length === 0) return;
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        const slides = document.querySelectorAll('.bg-slide');
        slides.forEach((s, i) => s.classList.toggle('active', i === currentBgIndex));
    }, 6000);
}

// ===== РЕНДЕРИНГ ТОВАРОВ =====
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    let html = '';
    const featuredProducts = products.filter(p => p.featured !== false);
    if (featuredProducts.length === 0) {
        grid.innerHTML = '<p style="text-align:center;padding:40px;">Товары не найдены</p>';
        return;
    }
    featuredProducts.forEach(p => {
        let labelHtml = '';
        if (p.label === 'hit') labelHtml = '<span style="position:absolute;top:16px;left:16px;padding:6px 16px;font-size:11px;border-radius:20px;background:var(--secondary);color:white;">Хит</span>';
        else if (p.label === 'new') labelHtml = '<span style="position:absolute;top:16px;left:16px;padding:6px 16px;font-size:11px;border-radius:20px;background:var(--primary);color:white;">Новинка</span>';
        else if (p.label === 'limited') labelHtml = '<span style="position:absolute;top:16px;left:16px;padding:6px 16px;font-size:11px;border-radius:20px;background:var(--primary);color:white;">Лимит</span>';
        
        const stockBadge = !p.inStock ? '<span style="position:absolute;top:16px;right:16px;padding:6px 16px;font-size:11px;border-radius:20px;background:var(--danger);color:white;">Нет в наличии</span>' : '';
        
        html += `<div class="product-card">
            <div class="product-media" style="background: url('${p.image || 'https://images.pexels.com/photos/4045034/pexels-photo-4045034.jpeg'}'); background-size: contain; background-position: center; background-repeat: no-repeat;">
                ${labelHtml}${stockBadge}
            </div>
            <div class="product-details">
                <h3>${p.title}</h3>
                <p style="margin:8px 0;color:var(--gray);">${p.description || ''}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
                    <span class="current-price">${(p.price || 0).toLocaleString()} ₽</span>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}" ${!p.inStock ? 'disabled style="opacity:0.5;"' : ''}>
                        ${p.inStock ? 'В корзину' : 'Нет в наличии'}
                    </button>
                </div>
            </div>
        </div>`;
    });
    grid.innerHTML = html;
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            addToCart(id);
        });
    });
}

// ===== ФУНКЦИИ ДЛЯ ПРОВЕРКИ ИМЕНИ =====
function validateName(name) {
    // Разрешаем только буквы (русские и английские), пробелы и дефисы
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
    return nameRegex.test(name);
}

function formatName(name) {
    return name.trim().replace(/\s+/g, ' ').split(' ').map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

// ===== PWA: ЛОГИКА УСТАНОВКИ =====
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const closeInstallBanner = document.getElementById('closeInstallBanner');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        if (installBanner && !isAppInstalled()) {
            installBanner.classList.remove('hidden');
        }
    }, 3000);
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBanner) installBanner.classList.add('hidden');
    localStorage.setItem('pwa_installed', 'true');
    console.log('PWA установлено!');
});

function isAppInstalled() {
    if (localStorage.getItem('pwa_installed') === 'true') return true;
    if (window.matchMedia('(display-mode: standalone)').matches) {
        localStorage.setItem('pwa_installed', 'true');
        return true;
    }
    return false;
}

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Результат установки: ${outcome}`);
            deferredPrompt = null;
            if (installBanner) installBanner.classList.add('hidden');
        } else {
            notify('📱 Чтобы установить, нажмите "На экран" в меню браузера', 'info', 4000);
        }
    });
}

if (closeInstallBanner) {
    closeInstallBanner.addEventListener('click', () => {
        if (installBanner) installBanner.classList.add('hidden');
        sessionStorage.setItem('pwa_banner_closed', 'true');
    });
}

if (sessionStorage.getItem('pwa_banner_closed') === 'true' || isAppInstalled()) {
    if (installBanner) installBanner.classList.add('hidden');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    renderBackgrounds();
    startBgRotation();
    renderProducts();
    updateCart();
    updateSiteContent();
    renderAdminTab('products');
    
    // --- Обработчики корзины ---
    document.getElementById('cartBtn')?.addEventListener('click', () => {
        document.getElementById('cartSidebar')?.classList.remove('hidden');
        document.getElementById('cartOverlay')?.classList.remove('hidden');
    });
    
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
    
    // --- Оформление заказа ---
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            notify('🛒 Корзина пуста', 'error');
            return;
        }
        document.getElementById('contactModal')?.classList.remove('hidden');
    });
    
    document.getElementById('closeContactModalBtn')?.addEventListener('click', closeContactModal);
    document.getElementById('cancelContactBtn')?.addEventListener('click', closeContactModal);
    
    // --- Валидация имени в реальном времени ---
    const customerNameInput = document.getElementById('customerName');
    const nameErrorDiv = document.getElementById('nameError');
    
    if (customerNameInput) {
        customerNameInput.addEventListener('input', function(e) {
            let value = this.value;
            
            // Удаляем запрещенные символы на лету
            const cleaned = value.replace(/[^A-Za-zА-Яа-яЁё\s\-]/g, '');
            if (value !== cleaned) {
                this.value = cleaned;
                if (nameErrorDiv) {
                    nameErrorDiv.textContent = '❌ Разрешены только буквы, пробелы и дефисы';
                    nameErrorDiv.style.display = 'block';
                }
            } else {
                if (nameErrorDiv) nameErrorDiv.style.display = 'none';
            }
            
            // Визуальная обратная связь
            if (cleaned.length > 0 && !validateName(cleaned)) {
                this.classList.add('error');
                this.classList.remove('warning');
            } else if (cleaned.length > 0 && cleaned.length < 2) {
                this.classList.add('warning');
                this.classList.remove('error');
            } else {
                this.classList.remove('error', 'warning');
            }
        });
        
        customerNameInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                const formatted = formatName(this.value);
                if (formatted !== this.value) {
                    this.value = formatted;
                }
            }
            this.classList.remove('error', 'warning');
            if (nameErrorDiv) nameErrorDiv.style.display = 'none';
        });
    }
    
    // --- Обработка отправки формы заказа ---
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let name = document.getElementById('customerName')?.value.trim() || '';
        const phone = document.getElementById('customerPhone')?.value.trim() || '';
        const email = document.getElementById('customerEmail')?.value.trim() || '';
        const comment = document.getElementById('orderComment')?.value.trim() || '';
        const agreeTerms = document.getElementById('agreeTerms')?.checked || false;
        
        // Проверка на пустое имя
        if (!name) {
            notify('❌ Пожалуйста, укажите ваше имя', 'error');
            if (customerNameInput) customerNameInput.focus();
            return;
        }
        
        // Проверка имени на допустимые символы
        if (!validateName(name)) {
            notify('❌ Имя может содержать только буквы (русские или английские), пробелы и дефисы', 'error');
            if (customerNameInput) customerNameInput.focus();
            return;
        }
        
        // Проверка минимальной длины имени
        if (name.length < 2) {
            notify('❌ Имя должно содержать минимум 2 символа', 'error');
            if (customerNameInput) customerNameInput.focus();
            return;
        }
        
        // Проверка максимальной длины имени
        if (name.length > 50) {
            notify('❌ Имя не должно превышать 50 символов', 'error');
            if (customerNameInput) customerNameInput.focus();
            return;
        }
        
        // Форматируем имя (первая буква заглавная)
        name = formatName(name);
        
        // Проверка телефона
        if (!phone) {
            notify('❌ Укажите номер телефона', 'error');
            document.getElementById('customerPhone')?.focus();
            return;
        }
        
        const phoneClean = phone.replace(/\D/g, '');
        if (phoneClean.length < 10) {
            notify('❌ Введите корректный номер телефона', 'error');
            document.getElementById('customerPhone')?.focus();
            return;
        }
        
        // Проверка согласия с условиями
        if (!agreeTerms) {
            notify('❌ Подтвердите согласие на обработку персональных данных', 'error');
            return;
        }
        
        // Если есть email - проверяем его формат
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                notify('❌ Введите корректный email адрес', 'error');
                document.getElementById('customerEmail')?.focus();
                return;
            }
        }
        
        const order = {
            id: Date.now(),
            date: new Date().toLocaleString('ru-RU'),
            customer: { name, phone, email: email || null },
            comment: comment || null,
            items: [...cart],
            total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
            status: 'new'
        };
        
        orders.push(order);
        cart = [];
        updateCart();
        saveAll();
        
        closeContactModal();
        closeCart();
        document.getElementById('contactForm')?.reset();
        
        // ===== ОТПРАВКА ДАННЫХ В TELEGRAM БОТ =====
        const orderData = {
            id: order.id,
            total: order.total,
            items: order.items,
            customer: order.customer,
            comment: order.comment
        };
        
        // ЭТА СТРОКА ОТПРАВЛЯЕТ ЗАКАЗ В БОТ:
        tg.sendData(JSON.stringify(orderData));
        
        notify(`🎉 ${name}, заказ #${order.id} оформлен! Скоро с вами свяжется менеджер.`, 'success', 5000);
        
        // Опционально: закрыть приложение после заказа
        setTimeout(() => {
            tg.close();
        }, 500);
        
        if (currentTab === 'orders') renderAdminTab('orders');
    });
    
    // --- Админ-панель (с паролем) ---
    document.getElementById('devModeBtn')?.addEventListener('click', () => {
        showPasswordModal();
    });
    
    document.getElementById('passwordForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const passwordInput = document.getElementById('adminPassword');
        const errorDiv = document.getElementById('passwordError');
        
        if (passwordInput.value === ADMIN_PASSWORD) {
            openAdminPanel();
        } else {
            errorDiv.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    document.getElementById('closePasswordModalBtn')?.addEventListener('click', hidePasswordModal);
    document.getElementById('cancelPasswordBtn')?.addEventListener('click', hidePasswordModal);
    
    document.getElementById('passwordModal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            hidePasswordModal();
        }
    });
    
    document.getElementById('closeAdminBtn')?.addEventListener('click', () => {
        document.getElementById('adminPanel')?.classList.add('hidden');
    });
    
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderAdminTab(tab.dataset.tab);
        });
    });
    
    document.getElementById('catalogBtn')?.addEventListener('click', () => {
        document.querySelector('.product-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('customerPhone')?.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length === 0) {
            this.value = '';
            return;
        }
        let formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.substring(1, 4);
        if (value.length >= 4) formatted += ') ' + value.substring(4, 7);
        if (value.length >= 7) formatted += '-' + value.substring(7, 9);
        if (value.length >= 9) formatted += '-' + value.substring(9, 11);
        this.value = formatted;
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeContactModal();
            hidePasswordModal();
            document.getElementById('adminPanel')?.classList.add('hidden');
        }
    });
    
    document.getElementById('contactModal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeContactModal();
        }
    });
}

// Запуск приложения
init();