let products = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    document.getElementById("checkoutBtn").addEventListener("click", openContactModal);
    document.getElementById("contactForm").addEventListener("submit", submitOrder);
});

async function loadProducts() {
    try {
        products = await api("/products");

        const grid = document.getElementById("productGrid");
        grid.innerHTML = "";

        products.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <div class="product-media" style="background-image:url('${p.imageUrl}')"></div>
                <div class="product-details">
                    <h3>${p.name}</h3>
                    <div class="current-price">${p.price} ₽</div>
                    <button onclick='addToCart(${JSON.stringify(p)})' class="btn btn-primary">В корзину</button>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (e) {
        showNotification("Ошибка загрузки товаров");
    }
}

function openContactModal() {
    document.getElementById("contactModal").classList.remove("hidden");
}

async function submitOrder(e) {
    e.preventDefault();

    const order = {
        customerName: document.getElementById("customerName").value,
        phone: document.getElementById("customerPhone").value,
        email: document.getElementById("customerEmail").value,
        comment: document.getElementById("orderComment").value,
        items: cart
    };

    try {
        await api("/orders", "POST", order);

        showNotification("Заказ отправлен ✅");

        cart = [];
        renderCart();

        document.getElementById("contactModal").classList.add("hidden");

    } catch {
        showNotification("Ошибка отправки заказа ❌");
    }
}