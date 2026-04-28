const API_BASE = "http://localhost:5053/api";

function showNotification(text) {
    const el = document.getElementById("notification");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("hidden");

    setTimeout(() => {
        el.classList.add("hidden");
    }, 3000);
}