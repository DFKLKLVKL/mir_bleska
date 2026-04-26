// ===== АДМИН-ПАНЕЛЬ =====
const tg = window.Telegram.WebApp;

function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const input = document.getElementById('adminPassword');
    const error = document.getElementById('passwordError');
    modal.classList.remove('hidden');
    input.value = '';
    error.style.display = 'none';
    input.focus();
}

function hidePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
}

function openAdminPanel() {
    document.getElementById('adminPanel').classList.remove('hidden');
    renderAdminTab(currentTab);
    hidePasswordModal();
    notify('✅ Доступ разрешён', 'success');
}

function renderAdminTab(tab) {
    const content = document.getElementById('adminContent');
    if (!content) return;
    currentTab = tab;
    
    if (tab === 'products') {
        let html = `<div class="admin-card">
            <div class="admin-section-title">🛍️ Управление товарами (${products.length})</div>`;
        
        if (products.length === 0) {
            html += '<p>Нет товаров</p>';
        } else {
            products.forEach(p => {
                html += `<div style="display:flex;gap:12px;padding:12px;border-bottom:1px solid #eee;">
                    <div class="admin-product-image" style="width:60px;height:60px;background: url('${p.image || 'https://images.pexels.com/photos/4045034/pexels-photo-4045034.jpeg'}'); background-size: contain; background-position: center; background-repeat: no-repeat; background-color: #f5f5f5; border-radius:8px;"></div>
                    <div style="flex:1;">
                        <strong>${p.title}</strong><br>
                        <small>${(p.price || 0).toLocaleString()} ₽ · ${p.inStock ? '✅ В наличии' : '❌ Нет в наличии'}</small>
                    </div>
                    <div>
                        <button class="btn btn-outline btn-sm admin-edit-product" data-id="${p.id}">✏️</button>
                        <button class="btn btn-danger btn-sm admin-delete-product" data-id="${p.id}">🗑️</button>
                    </div>
                </div>`;
            });
        }
        
        html += `<button class="btn btn-primary btn-sm" id="adminAddProductBtn" style="margin-top:16px;">➕ Добавить товар</button>
            </div>
            <div id="editProductForm"></div>`;
        
        content.innerHTML = html;
        
        document.getElementById('adminAddProductBtn')?.addEventListener('click', () => showEditForm(null));
        document.querySelectorAll('.admin-edit-product').forEach(btn => {
            btn.addEventListener('click', () => showEditForm(parseInt(btn.dataset.id)));
        });
        document.querySelectorAll('.admin-delete-product').forEach(btn => {
            btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id)));
        });
        
    } else if (tab === 'backgrounds') {
        let html = `<div class="admin-card">
            <div class="admin-section-title">🖼️ Фоны для слайд-шоу</div>`;
        
        bgImages.forEach((url, i) => {
            html += `<div style="display:flex;gap:12px;margin-bottom:12px;">
                <div style="width:80px;height:60px;background: url('${url}'); background-size: cover; background-position: center; border-radius:8px;"></div>
                <input type="text" value="${url}" data-index="${i}" class="admin-input bg-input" style="flex:1;">
                <button class="btn btn-danger btn-sm admin-remove-bg" data-index="${i}">🗑️</button>
            </div>`;
        });
        
        html += `<button class="btn btn-primary btn-sm" id="adminAddBgBtn">➕ Добавить фон</button>
            </div>`;
        
        content.innerHTML = html;
        
        document.querySelectorAll('.bg-input').forEach(inp => {
            inp.addEventListener('change', function() {
                const index = parseInt(this.dataset.index);
                bgImages[index] = this.value;
                saveAll();
                renderBackgrounds();
                notify('✅ Фон обновлён', 'success');
            });
        });
        
        document.querySelectorAll('.admin-remove-bg').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                removeBg(index);
            });
        });
        
        document.getElementById('adminAddBgBtn')?.addEventListener('click', addBg);
        
    } else if (tab === 'content') {
        content.innerHTML = `
            <div class="admin-card">
                <div class="admin-section-title">📝 Редактирование контента</div>
                
                <label class="admin-label">Адрес</label>
                <input id="editAddress" class="admin-input" value="${siteContent.address.replace(/"/g, '&quot;')}">
                
                <label class="admin-label">Телефон</label>
                <input id="editPhone" class="admin-input" value="${siteContent.phone}">
                
                <label class="admin-label">Email</label>
                <input id="editEmail" class="admin-input" value="${siteContent.email}">
                
                <label class="admin-label">Ссылка VK</label>
                <input id="editVkUrl" class="admin-input" value="${siteContent.vkUrl}">
                
                <label class="admin-label">Подзаголовок Hero</label>
                <input id="editHeroSubtitle" class="admin-input" value="${siteContent.hero.subtitle.replace(/"/g, '&quot;')}">
                
                <label class="admin-label">Заголовок Hero (можно с HTML)</label>
                <textarea id="editHeroTitle" class="admin-textarea" rows="2">${siteContent.hero.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                
                <label class="admin-label">Описание Hero</label>
                <textarea id="editHeroDesc" class="admin-textarea" rows="3">${siteContent.hero.description.replace(/"/g, '&quot;')}</textarea>
                
                <label class="admin-label">Copyright в футере</label>
                <input id="editCopyright" class="admin-input" value="${siteContent.footer.copyright.replace(/"/g, '&quot;')}">
                
                <label class="admin-label">Локация в футере</label>
                <input id="editFooterLocation" class="admin-input" value="${siteContent.footer.location.replace(/"/g, '&quot;')}">
                
                <button class="btn btn-primary" id="saveContentBtn">💾 Сохранить изменения</button>
            </div>
        `;
        
        document.getElementById('saveContentBtn')?.addEventListener('click', saveContent);
        
    } else if (tab === 'orders') {
        let html = `<div class="admin-card">
            <div class="admin-section-title">📦 Заказы (${orders.length})</div>`;
        
        if (orders.length === 0) {
            html += '<p>Заказов пока нет</p>';
        } else {
            orders.slice().reverse().forEach(o => {
                const itemsList = o.items.map(i => `${i.title} x${i.quantity}`).join('<br>');
                html += `<div style="padding:16px;background:#f9f9f9;border-radius:8px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;">
                        <strong>Заказ #${o.id}</strong>
                        <span>${(o.total || 0).toLocaleString()} ₽</span>
                    </div>
                    <div style="font-size:13px;margin:8px 0;">
                        <strong>👤 ${o.customer?.name || '—'}</strong> · 📞 ${o.customer?.phone || '—'}
                        ${o.customer?.email ? ' · ✉️ ' + o.customer.email : ''}
                    </div>
                    ${o.comment ? `<div style="font-size:12px;color:var(--gray);margin:8px 0;">💬 ${o.comment}</div>` : ''}
                    <div style="font-size:12px;color:var(--gray);">${o.date || '—'}</div>
                    <div style="margin-top:8px;font-size:14px;">${itemsList}</div>
                </div>`;
            });
        }
        html += `</div>`;
        content.innerHTML = html;
    }
}

function showEditForm(id) {
    const formContainer = document.getElementById('editProductForm');
    if (!formContainer) return;
    
    const product = id ? products.find(p => p.id === id) : { 
        id: Date.now(), 
        title: '', 
        description: '', 
        price: 0, 
        image: 'https://images.pexels.com/photos/4045034/pexels-photo-4045034.jpeg', 
        inStock: true, 
        featured: true, 
        label: null,
        dimensions: '—',
        weight: '—'
    };
    
    formContainer.innerHTML = `
        <div class="admin-card" style="margin-top:20px;">
            <h4 style="margin-bottom:16px;">${id ? '✏️ Редактирование товара' : '✨ Новый товар'}</h4>
            
            <label class="admin-label">Название *</label>
            <input id="editTitle" class="admin-input" value="${product.title.replace(/"/g, '&quot;')}">
            
            <label class="admin-label">Цена (₽) *</label>
            <input id="editPrice" class="admin-input" type="number" min="0" value="${product.price || 0}">
            
            <label class="admin-label">Описание</label>
            <textarea id="editDesc" class="admin-textarea" rows="2">${(product.description || '').replace(/"/g, '&quot;')}</textarea>
            
            <label class="admin-label">Изображение URL</label>
            <input id="editImage" class="admin-input" value="${product.image || ''}">
            
            <label class="admin-label">Метка</label>
            <select id="editLabel" class="admin-select">
                <option value="">Без метки</option>
                <option value="hit" ${product.label === 'hit' ? 'selected' : ''}>Хит</option>
                <option value="new" ${product.label === 'new' ? 'selected' : ''}>Новинка</option>
                <option value="limited" ${product.label === 'limited' ? 'selected' : ''}>Лимит</option>
            </select>
            
            <div class="checkbox-wrapper">
                <input type="checkbox" id="editInStock" ${product.inStock ? 'checked' : ''}>
                <label for="editInStock">В наличии</label>
            </div>
            
            <div class="checkbox-wrapper">
                <input type="checkbox" id="editFeatured" ${product.featured !== false ? 'checked' : ''}>
                <label for="editFeatured">Показывать на главной</label>
            </div>
            
            <div style="display:flex;gap:12px;margin-top:20px;">
                <button class="btn btn-primary" id="saveProductBtn" data-id="${id}">💾 Сохранить</button>
                <button class="btn btn-outline" id="cancelEditBtn">Отмена</button>
            </div>
        </div>
    `;
    
    document.getElementById('saveProductBtn')?.addEventListener('click', () => saveProduct(id));
    document.getElementById('cancelEditBtn')?.addEventListener('click', () => {
        renderAdminTab('products');
    });
}

function saveProduct(id) {
    const titleInput = document.getElementById('editTitle');
    const priceInput = document.getElementById('editPrice');
    const descInput = document.getElementById('editDesc');
    const imageInput = document.getElementById('editImage');
    const labelInput = document.getElementById('editLabel');
    const inStockInput = document.getElementById('editInStock');
    const featuredInput = document.getElementById('editFeatured');
    
    const title = titleInput?.value.trim() || '';
    const price = parseInt(priceInput?.value) || 0;
    
    if (!title) {
        notify('❌ Название обязательно', 'error');
        return;
    }
    
    const productData = {
        title: title,
        price: price,
        description: descInput?.value.trim() || '',
        image: imageInput?.value.trim() || 'https://images.pexels.com/photos/4045034/pexels-photo-4045034.jpeg',
        label: labelInput?.value || null,
        inStock: inStockInput?.checked || false,
        featured: featuredInput?.checked || false
    };
    
    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            notify('✅ Товар обновлён', 'success');
        } else {
            notify('❌ Товар не найден', 'error');
            return;
        }
    } else {
        const newProduct = {
            id: Date.now(),
            dimensions: '—',
            weight: '—',
            ...productData
        };
        products.push(newProduct);
        notify('✅ Товар добавлен', 'success');
    }
    
    saveAll();
    renderProducts();
    renderAdminTab('products');
}

function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;
    products = products.filter(p => p.id !== id);
    saveAll();
    renderProducts();
    renderAdminTab('products');
    notify('✅ Товар удалён', 'success');
}

function addBg() {
    const url = prompt('Введите URL изображения:');
    if (url && url.trim()) {
        bgImages.push(url.trim());
        saveAll();
        renderBackgrounds();
        renderAdminTab('backgrounds');
        notify('✅ Фон добавлен', 'success');
    }
}

function removeBg(index) {
    if (bgImages.length <= 1) {
        notify('❌ Должен быть хотя бы один фон', 'error');
        return;
    }
    bgImages.splice(index, 1);
    saveAll();
    renderBackgrounds();
    renderAdminTab('backgrounds');
    notify('✅ Фон удалён', 'success');
}

function saveContent() {
    const address = document.getElementById('editAddress')?.value || '';
    const phone = document.getElementById('editPhone')?.value || '';
    const email = document.getElementById('editEmail')?.value || '';
    const vkUrl = document.getElementById('editVkUrl')?.value || '#';
    const heroSubtitle = document.getElementById('editHeroSubtitle')?.value || '';
    let heroTitle = document.getElementById('editHeroTitle')?.value || '';
    const heroDesc = document.getElementById('editHeroDesc')?.value || '';
    const copyright = document.getElementById('editCopyright')?.value || '';
    const footerLocation = document.getElementById('editFooterLocation')?.value || '';
    
    heroTitle = heroTitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    siteContent = {
        address, phone, email, vkUrl,
        hero: { subtitle: heroSubtitle, title: heroTitle, description: heroDesc },
        footer: { copyright, location: footerLocation }
    };
    
    saveAll();
    updateSiteContent();
    notify('✅ Контент сохранён', 'success');
}