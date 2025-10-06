export function renderWishlist(products) {
  if (!products || products.length === 0) {
    return `<div class="wishlist-empty">Sua lista de desejos está vazia.</div>`;
  }
  return `
    <div class="wishlist">
      <h2>Lista de Desejos</h2>
      <div class="wishlist-grid">
        ${products.map(product => `
          <div class="wishlist-item">
            <img src="${product.image}" alt="${product.name}" />
            <div>${product.name}</div>
            <div>R$ ${product.price}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}