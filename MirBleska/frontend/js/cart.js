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