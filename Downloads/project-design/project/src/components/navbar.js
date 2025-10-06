export function renderNavbar(user, cartItemCount) {
    const userRole = user?.role || 'guest';
    
    return `
        <div class="nav-content">
            <a href="#" class="logo" data-view="catalog">FashionStore</a>
            
            <div class="nav-links">
                <a href="#" class="nav-link" data-view="catalog">Produtos</a>
                
                ${user?.isPremium ? `
                    <a href="#" class="nav-link" data-view="premium" style="color: var(--accent-500);">
                        Premium ⭐
                    </a>` : ''}
                
                ${user ? `
                    <a href="#" class="nav-link" data-view="profile">Perfil</a>
                    ${user.isVendor ? `<a href="#" class="nav-link" data-view="vendor">Loja</a>` : ''}
                    ${user.isAdmin && userRole === 'admin' ? `<a href="#" class="nav-link" data-view="admin">Admin</a>` : ''}
                    ${userRole === 'super_admin' ? `<a href="#" class="nav-link" data-view="super-admin">Super Admin</a>` : ''}
                    <a href="#" class="nav-link" data-view="wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                            <path d="M12 21s-7.5-4.8-7.5-10.3a5.8 5.8 0 0 1 11.6 0A5.8 5.8 0 0 1 19.5 10.7C19.5 16.2 12 21 12 21z" />
                        </svg>
                        Lista de Desejos
                    </a>
                    <a href="#" class="nav-link" onclick="logout()">Sair</a>
                ` : `
                    <a href="#" class="nav-link" data-auth="login">Entrar</a>
                `}

                ${!user?.isVendor ? `
                    <a href="#" class="cart-container" data-view="cart">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="m1 1 4 4 5.5 11"></path>
                            <path d="M16 8h6l-2 7h-4"></path>
                        </svg>
                        ${cartItemCount > 0 
                            ? `<span class="cart-badge">${cartItemCount}</span>` 
                            : ''}
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}