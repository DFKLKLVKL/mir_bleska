document.getElementById("devModeBtn").addEventListener("click", () => {
    document.getElementById("adminPanel").classList.remove("hidden");
    loadOrders();
});

async function loadOrders() {
    try {
        const orders = await api("/orders");

        const container = document.getElementById("adminContent");

        container.innerHTML = "<h3>Заказы</h3>";

        orders.forEach(o => {
            const div = document.createElement("div");

            div.innerHTML = `
                <div class="admin-card">
                    <b>${o.customerName}</b><br>
                    ${o.phone}<br>
                    ${o.email || ""}<br>
                    <pre>${JSON.stringify(o.items, null, 2)}</pre>
                </div>
            `;

            container.appendChild(div);
        });

    } catch {
        showNotification("Ошибка загрузки заказов");
    }
}