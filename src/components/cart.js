export function renderCart(items, total, shipping, discount) {
    if (items.length === 0) {
        return `
            <div class="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="m1 1 4 4 5.5 11"/>
                    <path d="M16 8h6l-2 7h-4"/>
                </svg>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos ao carrinho para continuar</p>
                <button class="btn-primary mt-4" data-view="catalog">Explorar Produtos</button>
            </div>
        `;
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return `
        <div class="cart-items">
            ${items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                        ${item.selectedSize ? `<p><strong>Tamanho:</strong> ${item.selectedSize}</p>` : ''}
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}" data-product-size="${item.selectedSize}">-</button>
                            <input type="number" value="${item.quantity}" class="quantity-input" readonly>
                            <button class="quantity-btn" data-action="increase" data-product-id="${item.id}" data-product-size="${item.selectedSize}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <p><strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong></p>
                        <button class="btn-secondary btn-sm remove-item-btn" data-product-id="${item.id}" data-product-size="${item.selectedSize}">Remover</button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-summary">
            <h3>Resumo do Pedido</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Frete:</span>
                <span>${shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
            </div>
            ${discount > 0 ? `
                <div class="summary-row">
                    <span>Desconto:</span>
                    <span style="color: var(--success-500)">- R$ ${discount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="summary-row total">
                <span>Total:</span>
                <span>R$ ${total.toFixed(2)}</span>
            </div>
            
            <button class="btn-primary" style="width: 100%; margin-top: 16px;" data-view="checkout">
                Finalizar Compra
            </button>
        </div>
    `;
}