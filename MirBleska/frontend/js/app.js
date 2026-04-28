let products = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен');
    loadProducts();
    
    // ===== ОТКРЫТИЕ КОРЗИНЫ =====
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            console.log('Кнопка корзины нажата');
            if (cartSidebar) cartSidebar.classList.remove('hidden');
            if (cartOverlay) cartOverlay.classList.remove('hidden');
        });
    } else {
        console.error('Кнопка корзины не найдена!');
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.add('hidden');
            if (cartOverlay) cartOverlay.classList.add('hidden');
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.add('hidden');
            if (cartOverlay) cartOverlay.classList.add('hidden');
        });
    }
    
    // ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openContactModal);
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitOrder);
    }
});

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5053/api/products');
        if (!response.ok) {
            throw new Error('Ошибка загрузки');
        }
        
        products = await response.json();
        window.products = products;
        
        const grid = document.getElementById('productGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="product-media" style="background-image: url('${product.imageUrl}')"></div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <div class="current-price">${product.price.toLocaleString()} ₽</div>
                </div>
            `;
            
            const addButton = document.createElement('button');
            addButton.textContent = 'В корзину';
            addButton.className = 'btn btn-primary';
            addButton.onclick = function() {
                addToCart(product.id, 1);
            };
            
            card.querySelector('.product-details').appendChild(addButton);
            grid.appendChild(card);
        });
        
        console.log('Товары загружены:', products.length);
        
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        const grid = document.getElementById('productGrid');
        if (grid) {
            grid.innerHTML = '<div style="text-align:center; padding:40px;">❌ Ошибка загрузки товаров. Убедитесь, что бэкенд запущен на http://localhost:5053</div>';
        }
        showNotification('❌ Не удалось загрузить товары. Запустите бэкенд!');
    }
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.remove('hidden');
}

async function submitOrder(e) {
    e.preventDefault();
    
    const order = {
        customer: {
            name: document.getElementById('customerName')?.value || '',
            phone: document.getElementById('customerPhone')?.value || '',
            email: document.getElementById('customerEmail')?.value || ''
        },
        comment: document.getElementById('orderComment')?.value || '',
        items: cart.items || [],
        total: cart.total || 0
    };
    
    try {
        const response = await fetch('http://localhost:5053/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        
        if (response.ok) {
            showNotification('✅ Заказ отправлен! Мы свяжемся с вами.');
            await clearCart();
            document.getElementById('contactModal')?.classList.add('hidden');
            document.getElementById('contactForm')?.reset();
        } else {
            showNotification('❌ Ошибка отправки заказа');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('❌ Ошибка отправки заказа. Бэкенд не запущен?');
    }
}