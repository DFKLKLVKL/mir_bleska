// ===== КОРЗИНА =====
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        notify('❌ Товар не найден', 'error');
        return;
    }
    if (!product.inStock) {
        notify('❌ Товара нет в наличии', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    saveAll();
    notify(`✅ «${product.title}» добавлен в корзину`, 'success');
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;padding:40px;">✨ Корзина пуста</p>';
    } else {
        let html = '';
        cart.forEach(item => {
            html += `<div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #eee;">
                <div class="cart-item-image" style="width:70px;height:70px;background: url('${item.image || 'https://images.pexels.com/photos/4045034/pexels-photo-4045034.jpeg'}'); background-size: contain; background-position: center; background-repeat: no-repeat; background-color: #f5f5f5; border-radius:8px;"></div>
                <div style="flex:1;">
                    <h4>${item.title}</h4>
                    <p>${item.price.toLocaleString()} ₽</p>
                    <div style="display:flex;gap:12px;margin-top:8px;align-items:center;">
                        <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1" style="width:30px;height:30px;border-radius:50%;border:1px solid #ccc;background:white;cursor:pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-qty-btn" data-id="${item.id}" data-delta="1" style="width:30px;height:30px;border-radius:50%;border:1px solid #ccc;background:white;cursor:pointer;">+</button>
                        <button class="cart-remove-btn" data-id="${item.id}" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:18px;">🗑️</button>
                    </div>
                </div>
            </div>`;
        });
        cartItems.innerHTML = html;
        
        cartItems.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const delta = parseInt(btn.dataset.delta);
                updateQuantity(id, delta);
            });
        });
        
        cartItems.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                removeFromCart(id);
            });
        });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString() + ' ₽';
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
        saveAll();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
    saveAll();
    notify('Товар удалён из корзины');
}

function closeCart() {
    document.getElementById('cartSidebar')?.classList.add('hidden');
    document.getElementById('cartOverlay')?.classList.add('hidden');
}

function closeContactModal() {
    document.getElementById('contactModal')?.classList.add('hidden');
    const nameError = document.getElementById('nameError');
    if (nameError) nameError.style.display = 'none';
}