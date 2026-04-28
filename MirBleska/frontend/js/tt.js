
    // ========== ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ДЛЯ ВСЕХ КНОПОК ==========
    (function() {
        // Ждем загрузки страницы
        function init() {
            console.log('Инициализация всех кнопок...');
            
            // 1. Кнопка корзины
            const cartBtn = document.getElementById('cartBtn');
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            const closeCartBtn = document.getElementById('closeCartBtn');
            
            if (cartBtn) {
                cartBtn.onclick = function(e) {
                    e.preventDefault();
                    console.log('Открываем корзину');
                    if (cartSidebar) cartSidebar.classList.remove('hidden');
                    if (cartOverlay) cartOverlay.classList.remove('hidden');
                };
            }
            
            if (closeCartBtn) {
                closeCartBtn.onclick = function(e) {
                    e.preventDefault();
                    console.log('Закрываем корзину');
                    if (cartSidebar) cartSidebar.classList.add('hidden');
                    if (cartOverlay) cartOverlay.classList.add('hidden');
                };
            }
            
            if (cartOverlay) {
                cartOverlay.onclick = function(e) {
                    if (cartSidebar) cartSidebar.classList.add('hidden');
                    if (cartOverlay) cartOverlay.classList.add('hidden');
                };
            }
            
            // 2. Кнопка оформления заказа
            const checkoutBtn = document.getElementById('checkoutBtn');
            const contactModal = document.getElementById('contactModal');
            const closeContactModalBtn = document.getElementById('closeContactModalBtn');
            const cancelContactBtn = document.getElementById('cancelContactBtn');
            const contactForm = document.getElementById('contactForm');
            
            if (checkoutBtn) {
                checkoutBtn.onclick = function(e) {
                    e.preventDefault();
                    console.log('Открываем форму заказа');
                    if (contactModal) contactModal.classList.remove('hidden');
                };
            }
            
            if (closeContactModalBtn) {
                closeContactModalBtn.onclick = function(e) {
                    e.preventDefault();
                    console.log('Закрываем форму');
                    if (contactModal) contactModal.classList.add('hidden');
                };
            }
            
            if (cancelContactBtn) {
                cancelContactBtn.onclick = function(e) {
                    e.preventDefault();
                    console.log('Отмена - закрываем форму');
                    if (contactModal) contactModal.classList.add('hidden');
                };
            }
            
            // 3. Отправка формы заказа
            if (contactForm) {
                contactForm.onsubmit = async function(e) {
                    e.preventDefault();
                    console.log('Отправка заказа...');
                    
                    const name = document.getElementById('customerName')?.value;
                    const phone = document.getElementById('customerPhone')?.value;
                    
                    if (!name || !phone) {
                        showNotification('❌ Заполните имя и телефон');
                        return;
                    }
                    
                    const order = {
                        customer: {
                            name: name,
                            phone: phone,
                            email: document.getElementById('customerEmail')?.value || ''
                        },
                        comment: document.getElementById('orderComment')?.value || '',
                        items: window.cartData?.items || [],
                        total: window.cartData?.total || 0
                    };
                    
                    try {
                        const response = await fetch('http://localhost:5053/api/orders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(order)
                        });
                        
                        if (response.ok) {
                            showNotification('✅ Заказ отправлен! Мы свяжемся с вами.');
                            if (window.clearCart) window.clearCart();
                            if (contactModal) contactModal.classList.add('hidden');
                            contactForm.reset();
                        } else {
                            showNotification('❌ Ошибка отправки заказа');
                        }
                    } catch (error) {
                        console.error('Ошибка:', error);
                        showNotification('❌ Ошибка отправки заказа. Запустите бэкенд!');
                    }
                };
            }
            
            // 4. Закрытие модального окна по клику на фон
            if (contactModal) {
                contactModal.onclick = function(e) {
                    if (e.target === contactModal) {
                        contactModal.classList.add('hidden');
                    }
                };
            }
            
            console.log('Инициализация завершена');
        }
        
        // Запускаем когда страница загружена
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
