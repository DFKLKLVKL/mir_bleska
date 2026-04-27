let cart = [];

function addToCart(product) {
    const existing = cart.find(x => x.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    renderCart();
}

function getTotal() {
    return cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
}

function renderCart() {
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    const countEl = document.getElementById("cartCount");

    container.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div>
                <b>${item.name}</b><br>
                ${item.quantity} × ${item.price} ₽
                <button onclick="removeFromCart(${item.id})">❌</button>
            </div>
        `;
        container.appendChild(div);
    });

    totalEl.textContent = getTotal() + " ₽";
    countEl.textContent = cart.length;
}
let cart = { items: [], total: 0, count: 0 };

// Загрузить корзину с сервера
async function loadCart() {
    try {
        const response = await fetch(`${API_BASE}/cart`, {
            credentials: 'include' // Важно для cookies
        });
        cart = await response.json();
        renderCart();
        updateCartIcon();
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
    }
}

// Добавить в корзину
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity })
        });
        
        cart = await response.json();
        renderCart();
        updateCartIcon();
        showNotification('✅ Товар добавлен в корзину');
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('❌ Ошибка добавления товара');
    }
}

// Обновить количество
async function updateCartItem(productId, quantity) {
    try {
        const response = await fetch(`${API_BASE}/cart/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity })
        });
        
        cart = await response.json();
        renderCart();
        updateCartIcon();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Очистить корзину
async function clearCart() {
    try {
        await fetch(`${API_BASE}/cart/clear`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        cart = { items: [], total: 0, count: 0 };
        renderCart();
        updateCartIcon();
        showNotification('🗑 Корзина очищена');
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Удалить один товар
async function removeFromCart(productId) {
    await updateCartItem(productId, 0);
}

// Обновить иконку корзины
function updateCartIcon() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = cart.count || 0;
}

// Отобразить корзину
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

// Загрузка корзины при старте
document.addEventListener('DOMContentLoaded', loadCart);