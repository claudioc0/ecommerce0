export function renderProducts(products, viewType = 'grid', wishlistService = null, userId = null) {
    if (products.length === 0) {
        return `
            <div class="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H14l-2 2V9"/>
                </svg>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros para encontrar produtos</p>
            </div>
        `;
    }

    return products.map(product => {
        const isListView = viewType === 'list';
        const isWishlisted = wishlistService && userId ? wishlistService.isInWishlist(userId, product.id) : false;

        return `
            <div class="product-card ${isListView ? 'list-view' : ''}" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                        <div class="product-meta">
                            <span class="product-tag">${product.condition}</span>
                            <span class="product-tag">${product.category}</span>
                            ${product.stock === 0 ? '<span class="product-tag" style="background: var(--error-500); color: white;">Esgotado</span>' : ''}

                            <span 
                                class="wishlist-icon ${isWishlisted ? "active" : ""}" 
                                data-product-id="${product.id}" 
                                title="Favoritar"
                                style="cursor:pointer; font-size: 1.5em; margin-left: 8px;"
                            >
                                ${isWishlisted ? "❤️" : "🤍"}
                            </span>
                        </div>
                    </div>
                    <button 
                        class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}" 
                        data-product-id="${product.id}"
                        ${product.stock === 0 ? 'disabled' : ''}
                    >
                        ${product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

export function renderProductCard(product, wishlistService = null, userId = null) {
    const isWishlisted = wishlistService && userId ? wishlistService.isInWishlist(userId, product.id) : false;

    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-meta">
                    <span class="product-tag">${product.condition}</span>
                    <span class="product-tag">${product.category}</span>
                    ${product.sizes.map(size => `<span class="product-tag">${size}</span>`).join('')}
                    <span 
                        class="wishlist-icon ${isWishlisted ? "active" : ""}" 
                        data-product-id="${product.id}" 
                        title="Favoritar"
                        style="cursor:pointer; font-size: 1.5em; margin-left: 8px;"
                    >
                        ${isWishlisted ? "❤️" : "🤍"}
                    </span>
                </div>
                <button 
                    class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}" 
                    data-product-id="${product.id}"
                    ${product.stock === 0 ? 'disabled' : ''}
                >
                    ${product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        </div>
    `;
}