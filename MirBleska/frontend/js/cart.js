// Рабочая версия корзины с localStorage
let cart = { items: [], total: 0, count: 0 };

function loadCart() {
    const saved = localStorage.getItem('temp_cart');
    if (saved) {
        cart = JSON.parse(saved);
    } else {
        cart = { items: [], total: 0, count: 0 };
    }
    renderCart();
    updateCartIcon();
}

function saveCart() {
    localStorage.setItem('temp_cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    console.log('addToCart called with productId:', productId);
    
    // Находим товар в глобальном массиве
    if (!window.products) {
        console.error('Products not loaded yet!');
        showNotification('❌ Товары ещё не загружены, попробуйте через секунду');
        return;
    }
    
    const product = window.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('❌ Товар не найден');
        return;
    }
    
    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.items.push({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: quantity
        });
    }
    
    cart.total = cart.items.reduce((sum, i) => sum + i.productPrice * i.quantity, 0);
    cart.count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    
    saveCart();
    renderCart();
    updateCartIcon();
    showNotification('✅ Товар добавлен в корзину');
    
    console.log('Cart after add:', cart);
}

function updateCartItem(productId, quantity) {
    const item = cart.items.find(i => i.productId === productId);
    if (item) {
        if (quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId !== productId);
        } else {
            item.quantity = quantity;
        }
    } else if (quantity > 0) {
        // Если товара нет, но добавляем положительное количество
        const product = window.products?.find(p => p.id === productId);
        if (product) {
            cart.items.push({
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                quantity: quantity
            });
        }
    }
    
    cart.total = cart.items.reduce((sum, i) => sum + i.productPrice * i.quantity, 0);
    cart.count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    
    saveCart();
    renderCart();
    updateCartIcon();
}

function removeFromCart(productId) {
    updateCartItem(productId, 0);
    showNotification('🗑 Товар удален');
}

function clearCart() {
    cart = { items: [], total: 0, count: 0 };
    saveCart();
    renderCart();
    updateCartIcon();
    showNotification('🗑 Корзина очищена');
}

function updateCartIcon() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = cart.count || 0;
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    
    if (!container) return;
    
    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<div class="empty-cart">Корзина пуста 🛒</div>';
        if (totalEl) totalEl.textContent = '0 ₽';
        return;
    }
    
    container.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.productName}</div>
                <div class="cart-item-price">${item.productPrice.toLocaleString()} ₽</div>
            </div>
            <div class="cart-item-controls">
                <button class="cart-qty-btn" onclick="updateCartItem(${item.productId}, ${item.quantity - 1})">-</button>
                <span class="cart-qty">${item.quantity}</span>
                <button class="cart-qty-btn" onclick="updateCartItem(${item.productId}, ${item.quantity + 1})">+</button>
                <button class="cart-remove-btn" onclick="removeFromCart(${item.productId})">🗑</button>
            </div>
        </div>
    `).join('');
    
    if (totalEl) totalEl.textContent = `${(cart.total || 0).toLocaleString()} ₽`;
}

// Загружаем корзину при старте
document.addEventListener('DOMContentLoaded', loadCart);