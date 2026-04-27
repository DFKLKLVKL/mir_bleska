const API_BASE = "https://localhost:5001/api"; // поменяешь потом на прод

async function api(url, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(API_BASE + url, options);

    if (!res.ok) {
        throw new Error("API error");
    }

    return await res.json();
}

function showNotification(text) {
    const el = document.getElementById("notification");
    el.textContent = text;
    el.classList.remove("hidden");

    setTimeout(() => {
        el.classList.add("hidden");
    }, 3000);
}