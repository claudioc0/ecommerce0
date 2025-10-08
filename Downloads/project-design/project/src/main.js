import { AuthService } from './auth/auth.js';
import { ProductService } from './products/productService.js';
import { CartService } from './cart/cartService.js';
import { AdminService } from './admin/adminService.js';
import { renderNavbar } from './components/navbar.js';
import { renderFilters } from './components/filters.js';
import { renderProducts } from './components/productGrid.js';
import { renderCart } from './components/cart.js';
import { renderCheckout } from './components/checkout.js';
import { renderAdmin } from './components/admin.js';
import { renderProfile } from './components/profile.js';
import { renderAuth } from './components/auth.js';
import  WishlistService from './wishlist/wishlistService.js';
import { renderWishlist } from './components/wishlist.js';
import ReviewService from './reviews/reviewService.js';
import { renderReviewList, renderReviewForm } from './components/reviews.js';
import SupportService from './support/supportService.js';
import { renderSupportTickets, renderTicketDetail, renderNewTicketForm } from './components/support.js';
import { initCepService } from './utils/cepService.js';
import { antiFraudService } from './utils/antiFraudService.js';
import { currencyService } from './currency/currencyService.js';

import { ConfigManager } from './patterns/singleton/ConfigManager.js';
import { Logger } from './patterns/singleton/Logger.js';
import { SalesReportGenerator, InventoryReportGenerator } from './patterns/template/ReportGenerator.js';
import { CreditCardProcessor, PIXProcessor } from './patterns/template/PaymentProcessor.js';
import { EmailNotificationSender, SMSNotificationSender } from './patterns/template/NotificationSender.js';
import { globalEventManager } from './patterns/observer/EventManager.js';
import { globalActivityTracker, AnalyticsObserver } from './patterns/observer/UserActivityTracker.js';
import { globalNotificationCenter, NotificationDisplay } from './patterns/observer/NotificationCenter.js';

class App {
    constructor() {
        this.initializeDesignPatterns();

        this.authService = new AuthService();
        this.productService = new ProductService();
        this.cartService = new CartService();
        this.adminService = new AdminService();
        this.wishlistService = new WishlistService();
        this.reviewService = new ReviewService();
        this.supportService = new SupportService();
        
        // Disponibiliza o serviço de moedas globalmente
        window.currencyService = currencyService;

        this.currentView = 'catalog';
        this.currentProductView = 'grid';

        this.productService.setFilters({
            category: '',
            size: '',
            color: '',
            condition: '',
            minPrice: 0,
            maxPrice: 999999
        });

        this.init();
    }

    initializeDesignPatterns() {
        this.config = ConfigManager.getInstance();
        this.logger = Logger.getInstance();

        this.salesReportGenerator = new SalesReportGenerator();
        this.inventoryReportGenerator = new InventoryReportGenerator();
        this.creditCardProcessor = new CreditCardProcessor();
        this.pixProcessor = new PIXProcessor();
        this.emailSender = new EmailNotificationSender();
        this.smsSender = new SMSNotificationSender();

        this.eventManager = globalEventManager;
        this.activityTracker = globalActivityTracker;
        this.notificationCenter = globalNotificationCenter;

        this.analyticsObserver = new AnalyticsObserver('FashionStore Analytics');
        this.activityTracker.addObserver(this.analyticsObserver);
        this.notificationDisplay = new NotificationDisplay(this.notificationCenter);

        this.activityTracker.startTracking();
        this.setupDesignPatternEvents();

        this.logger.info('Design patterns initialized successfully');
    }

    setupDesignPatternEvents() {
        this.eventManager.subscribe('user_login', (event) => {
            this.logger.info('User logged in', event.data);
            this.notificationCenter.success('Login realizado', `Bem-vindo, ${event.data.user.name}!`);
        });

        this.eventManager.subscribe('user_logout', (event) => {
            this.logger.info('User logged out', event.data);
            this.notificationCenter.info('Logout realizado', 'Até logo!');
        });

        this.eventManager.subscribe('product_added_to_cart', (event) => {
            this.logger.info('Product added to cart', event.data);
            this.notificationCenter.success('Produto adicionado', `${event.data.product.name} foi adicionado ao carrinho`);
        });

        this.eventManager.subscribe('order_placed', (event) => {
            this.logger.info('Order placed', event.data);
            this.notificationCenter.orderPlaced(event.data.order);
        });

        this.eventManager.subscribe('low_stock_alert', (event) => {
            this.logger.warn('Low stock alert', event.data);
            this.notificationCenter.lowStock(event.data.product);
        });

        window.addEventListener('notificationAction', (event) => {
            this.handleNotificationAction(event.detail);
        });
    }

    handleNotificationAction(detail) {
        const { actionType, notification } = detail;
        switch (actionType) {
            case 'view_order':
            case 'track_order':
                this.showView('profile');
                break;
            case 'continue_shopping':
                this.showView('catalog');
                break;
            case 'restock_product':
                if (this.authService.getCurrentUser()?.isAdmin) {
                    this.showView('admin');
                }
                break;
        }
    }

    // Atualiza os preços dos produtos com base na moeda selecionada
    updateProductPrices() {
        const priceElements = document.querySelectorAll('.product-price');
        priceElements.forEach(element => {
            const priceBRL = parseFloat(element.getAttribute('data-price-brl'));
            if (priceBRL) {
                element.innerHTML = window.currencyService.formatCurrency(
                    window.currencyService.convertFromBRL(priceBRL)
                );
            }
        });
        this.notificationCenter.info('Moeda alterada', `Preços atualizados para ${currencyService.getCurrentCurrency()}`);
    }
     
     init() {
        this.renderNavbar();
        this.renderFilters();
        this.renderProducts();
        this.setupEventListeners();
        this.setupCartButtonListener();
        this.checkAuthStatus();
        initCepService(); // Inicializa o serviço de CEP

        this.logger.info('Application initialized');
        this.eventManager.publish('app_initialized', { timestamp: Date.now() });
    }

    renderNavbar() {
        const navbar = document.getElementById('navbar');
        navbar.innerHTML = renderNavbar(
            this.authService.getCurrentUser(),
            this.cartService.getItemCount()
        );
    }

    setupCartButtonListener() {
        const cartButton = document.getElementById('cart-button');
        if (!cartButton) return;

        cartButton.addEventListener('click', (event) => {
            this.openCart(); // chama a função que renderiza o carrinho
            globalActivityTracker.handleClick(event);
        });
    }


    renderFilters() {
        const filtersContainer = document.getElementById('filters');
        filtersContainer.innerHTML = renderFilters();
        this.setupFilterListeners();
    }

    renderWishlist() {
        const userId = this.authService.getCurrentUser()?.id;
        const wishlistIds = this.wishlistService.getItemsByUser(userId);
        const wishlistProducts = this.productService.getProductsByIds(wishlistIds);

        // O id depende do seu HTML. Adapte se for diferente!
        const wishlistContent = document.getElementById('wishlist-content');
        if (wishlistContent) {
            wishlistContent.innerHTML = renderWishlist(wishlistProducts);
        }
    }

    renderProducts() {
        const products = this.productService.getFilteredProducts();
        const productsGrid = document.getElementById('products-grid');
        productsGrid.className = this.currentProductView === 'grid' ? 'products-grid' : 'products-list';

        productsGrid.innerHTML = renderProducts(
            products,
            this.currentProductView,
            this.wishlistService,
            this.authService.getCurrentUser()?.id
        );
        this.setupProductListeners();
    }

    renderSupport() {
        const userId = this.authService.getCurrentUser()?.id;
        const tickets = this.supportService.getTicketsByUser(userId);
        const supportContent = document.getElementById('support-content');
        supportContent.innerHTML = renderSupportTickets(tickets);

        // Listener para abrir novo ticket
        document.getElementById('new-ticket-btn')?.addEventListener('click', () => {
            supportContent.innerHTML = renderNewTicketForm();
            document.getElementById('cancel-new-ticket-btn')?.addEventListener('click', () => {
                this.renderSupport();
            });
            document.getElementById('new-ticket-form')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const ticket = this.supportService.createTicket({
                    userId,
                    subject: formData.get('subject'),
                    createdAt: new Date().toISOString(),
                    status: 'open',
                    messages: [{
                        userId,
                        userName: this.authService.getCurrentUser()?.name,
                        text: formData.get('text'),
                        createdAt: new Date().toISOString()
                    }]
                });
                this.showNotification('Ticket criado com sucesso!', 'success');
                this.renderSupport();
            });
        });

        // Listener para ver detalhes de ticket
        document.querySelectorAll('.view-ticket-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ticketId = btn.getAttribute('data-ticket-id');
                const ticket = this.supportService.getTicketById(ticketId);
                supportContent.innerHTML = renderTicketDetail(ticket);

                document.getElementById('back-to-tickets-btn')?.addEventListener('click', () => {
                    this.renderSupport();
                });
                document.getElementById('ticket-message-form')?.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    this.supportService.addMessageToTicket(ticket.id, {
                        userId,
                        userName: this.authService.getCurrentUser()?.name,
                        text: formData.get('text')
                    });
                    this.showNotification('Mensagem enviada!', 'success');
                    // Atualiza detalhes
                    this.renderSupport();
                    // Reabre detalhes do ticket
                    setTimeout(() => {
                        const ticket = this.supportService.getTicketById(ticketId);
                        supportContent.innerHTML = renderTicketDetail(ticket);
                        document.getElementById('back-to-tickets-btn')?.addEventListener('click', () => {
                            this.renderSupport();
                        });
                        document.getElementById('ticket-message-form')?.addEventListener('submit', (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            this.supportService.addMessageToTicket(ticket.id, {
                                userId,
                                userName: this.authService.getCurrentUser()?.name,
                                text: formData.get('text')
                            });
                            this.showNotification('Mensagem enviada!', 'success');
                            this.renderSupport();
                        });
                    }, 100);
                });
            });
        });
    }

    renderCart() {
        const cartContent = document.getElementById('cart-content');
        cartContent.innerHTML = renderCart(
            this.cartService.getItems(),
            this.cartService.getTotal(),
            this.cartService.getShipping(),
            this.cartService.getDiscount()
        );
    }

        openCart() {
        this.showView('cart');  
        this.renderCart();     
    }

    renderCheckout() {
        const checkoutContent = document.getElementById('checkout-content');
        checkoutContent.innerHTML = renderCheckout(
            this.cartService.getItems(),
            this.cartService.getTotal(),
            this.cartService.getShipping()
        );
        this.setupCheckoutListeners();
    }

    renderAdmin() {
        if (!this.authService.getCurrentUser()?.isAdmin) {
            this.showView('catalog');
            return;
        }
        
        const adminContent = document.getElementById('admin-content');
        adminContent.innerHTML = renderAdmin(
            this.adminService.getStats(),
            this.productService.getAllProducts(),
            this.adminService.getOrders()
        );
        this.setupAdminListeners();
    }

    renderSuperAdmin() {
        if (this.authService.getUserRole() !== 'super_admin') {
            this.showView('catalog');
            return;
        }
        
        const superAdminContent = document.getElementById('super-admin-content');
        const systemStats = {
            criticalAlerts: 2,
            systemLoad: 67,
            uptime: '99.8%',
            totalUsers: 1247,
            customers: 1089,
            premiumUsers: 89,
            vendors: 45,
            admins: 24
        };
        
        import('./components/superAdminPanel.js').then(module => {
            superAdminContent.innerHTML = module.renderSuperAdminPanel(systemStats);
        });
    }

    renderVendor() {
        if (!this.authService.getCurrentUser()?.isVendor) {
            this.showView('catalog');
            return;
        }
        
        const vendorContent = document.getElementById('vendor-content');
        const vendorStats = {
            totalRevenue: 15420.50,
            totalOrders: 89,
            totalProducts: 23,
            totalCustomers: 156,
            lowStockCount: 3,
            products: this.productService.getAllProducts().slice(0, 5),
            orders: this.adminService.getOrders().slice(0, 5)
        };
        
        import('./components/vendorDashboard.js').then(module => {
            vendorContent.innerHTML = module.renderVendorDashboard(this.authService.getCurrentUser(), vendorStats);
        });
    }

    renderPremium() {
        const premiumContent = document.getElementById('premium-content');
        import('./components/premiumArea.js').then(module => {
            premiumContent.innerHTML = module.renderPremiumArea(this.authService.getCurrentUser());
        });
    }

    renderProfile() {
        const user = this.authService.getCurrentUser();
        const orders = this.adminService.getUserOrders();
        const tickets = this.supportService.getTicketsByUser(user?.id);
        const profileContent = document.getElementById('profile-content');
        profileContent.innerHTML = renderProfile(user, orders, tickets);

        // Listener para botão "Novo Ticket" no perfil
        const newTicketBtn = document.getElementById('new-ticket-profile-btn');
        if (newTicketBtn) {
            newTicketBtn.addEventListener('click', () => {
                profileContent.innerHTML = renderNewTicketForm();
                document.getElementById('cancel-new-ticket-btn')?.addEventListener('click', () => {
                    this.renderProfile();
                });
                document.getElementById('new-ticket-form')?.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    this.supportService.createTicket({
                        userId: user.id,
                        subject: formData.get('subject'),
                        createdAt: new Date().toISOString(),
                        status: 'open',
                        messages: [{
                            userId: user.id,
                            userName: user.name,
                            text: formData.get('text'),
                            createdAt: new Date().toISOString()
                        }]
                    });
                    this.showNotification('Ticket criado com sucesso!', 'success');
                    this.renderProfile();
                });
            });
        }

        this.setupProfileListeners();
    }

    setupEventListeners() {
        // Ouvinte global para eventos de 'click'
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // --- Navegação Principal ---
            if (target.matches('[data-view]')) {
                e.preventDefault();
                this.showView(target.dataset.view);
            }
            
            // Seletor de moedas
            if (target.id === 'currency-select' || target.closest('#currency-select')) {
                const select = target.id === 'currency-select' ? target : target.closest('#currency-select');
                currencyService.setCurrentCurrency(select.value);
                this.updateProductPrices();
            }
            
            // --- Modais de Autenticação ---
            if (target.matches('[data-auth]')) {
                this.showAuthModal(target.dataset.auth);
            }


            
            // --- Ações do Carrinho ---
            const quantityBtn = target.closest('.quantity-btn');
            if (quantityBtn) {
                const action = quantityBtn.dataset.action;
                // CORRIGIDO: Adicionado parseInt para consistência de tipo (número)
                const productId = parseInt(quantityBtn.dataset.productId, 10);
                const productSize = quantityBtn.dataset.productSize;
                this.updateCartQuantity(productId, productSize, action);
            }

            const removeBtn = target.closest('.remove-item-btn');
            if (removeBtn) {
                const productId = parseInt(removeBtn.dataset.productId, 10);
                const productSize = removeBtn.dataset.productSize;
                this.cartService.removeItem(productId, productSize);
                this.renderCart();
                this.renderNavbar();
            }
            
            // --- Ações de Produto ---
            if (target.matches('[data-product-action]')) {
                this.handleProductAction(target.dataset.productAction, target.dataset.productId);
            }
        });

        // NOVO OUVINTE: Para eventos de 'change' em formulários
        document.addEventListener('change', (e) => {
            // Lógica para o <select> do tipo de conta no formulário de registro
            if (e.target.matches('#register-user-type')) {
                const select = e.target;
                const premiumInfo = document.getElementById('premium-info');
                const vendorInfo = document.getElementById('vendor-info');
                
                if (!premiumInfo || !vendorInfo) return;

                premiumInfo.style.display = 'none';
                vendorInfo.style.display = 'none';
                
                if (select.value === 'premium') {
                    premiumInfo.style.display = 'block';
                } else if (select.value === 'vendor') {
                    vendorInfo.style.display = 'block';
                }
            }
        });
        
        // Ouvinte global para submissão de formulários
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#auth-form')) {
                e.preventDefault();
                this.handleAuth(e.target);
            }
            
            if (e.target.matches('#checkout-form')) {
                e.preventDefault();
                this.handleCheckout(e.target);
            }
            
            if (e.target.matches('#product-form')) {
                e.preventDefault();
                this.handleProductForm(e.target);
            }
        });
    }

    setupFilterListeners() {
        const filterInputs = document.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    setupProductListeners() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.addToCart(productId);
            });
        });
        
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                this.showProductDetail(productId);
            });
        });

        const userId = this.authService.getCurrentUser()?.id;
        document.querySelectorAll('.wishlist-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!userId) {
                    this.showNotification('Faça login para usar a lista de desejos', 'warning');
                    return;
                }
                const productId = icon.getAttribute('data-product-id');
                if (this.wishlistService.isInWishlist(userId, productId)) {
                    this.wishlistService.removeItem(userId, productId);
                } else {
                    this.wishlistService.addItem(userId, productId);
                }
                // Atualiza a renderização dos produtos para refletir o estado do coração
                this.renderProducts();
            });
        });
    }

    setupCheckoutListeners() {
        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        // Coupon application
        const applyCouponBtn = document.getElementById('apply-coupon-btn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const couponCode = document.getElementById('coupon-code').value;
                this.applyCoupon(couponCode);
            });
        }
    }

    setupAdminListeners() {
        // Admin navigation
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showAdminSection(btn.dataset.section);
            });
        });
    }

    setupProfileListeners() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile(new FormData(profileForm));
            });
        }
    }

    showView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const selectedView = document.getElementById(`${viewName}-view`);
        if (selectedView) {
            selectedView.classList.add('active');
            this.currentView = viewName;
            
            switch (viewName) {
                case 'cart':
                    this.renderCart();
                    break;
                case 'checkout':
                    this.renderCheckout();
                    break;
                case 'admin':
                    this.renderAdmin();
                    break;
                case 'super-admin':
                    this.renderSuperAdmin();
                    break;
                case 'vendor':
                    this.renderVendor();
                    break;
                case 'premium':
                    this.renderPremium();
                    break;
                case 'profile':
                    this.renderProfile();
                    break;
                case 'wishlist': 
                    this.renderWishlist();
                    break;
                case 'support':
                    this.renderSupport();
                    break;
            }
        }
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('login-modal');
        const authContent = document.getElementById('auth-content');
        authContent.innerHTML = renderAuth(type);
        modal.classList.add('active');
        this.attachAuthListeners(type, authContent);
    }

    attachAuthListeners(type = 'login', authContent = document.getElementById('auth-content')) {
        document.getElementById('google-login-btn')?.addEventListener('click', async () => {
            const user = await this.authService.loginWithProvider('google');
            if (user) {
                this.showNotification('Login com Google realizado!', 'success');
                this.closeModal('login-modal');
                this.renderNavbar();
                this.showView('catalog');
            }
        });

        document.getElementById('facebook-login-btn')?.addEventListener('click', async () => {
            const user = await this.authService.loginWithProvider('facebook');
            if (user) {
                this.showNotification('Login com Facebook realizado!', 'success');
                this.closeModal('login-modal');
                this.renderNavbar();
                this.showView('catalog');
            }
        });

        // Formulário padrão (login ou registro)
        if (type === 'login') {
            document.getElementById('login-form')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuth(e.target);
            });
        } else if (type === 'register') {
            document.getElementById('register-form')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuth(e.target);
            });
        }

        // Abas de troca
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;
                authContent.innerHTML = renderAuth(tabType);
                this.attachAuthListeners(tabType, authContent); // re-adiciona listeners!
            });
        });
    }

    applyFilters() {
        const filters = {
            category: document.getElementById('filter-category')?.value || '',
            size: document.getElementById('filter-size')?.value || '',
            color: document.getElementById('filter-color')?.value || '',
            minPrice: parseFloat(document.getElementById('filter-min-price')?.value) || 0,
            maxPrice: parseFloat(document.getElementById('filter-max-price')?.value) || Infinity,
            condition: document.getElementById('filter-condition')?.value || ''
        };
        
        this.productService.setFilters(filters);
        this.renderProducts();
    }

    addToCart(productId) {
        const product = this.productService.getProductById(productId);
        if (product) {
            this.cartService.addItem(product);
            this.renderNavbar();
            
            this.eventManager.publish('product_added_to_cart', { product });
            
            if (product.stock < 5) {
                this.eventManager.publish('low_stock_alert', { product });
            }
        }
    }

    updateCartQuantity(productId, action) {
        if (action === 'increase') {
            this.cartService.increaseQuantity(productId);
        } else if (action === 'decrease') {
            this.cartService.decreaseQuantity(productId);
        }
        
        this.renderCart();
        this.renderNavbar();
    }

    updateCartQuantity(productId, productSize, action) {
        const id = parseInt(productId);

        if (action === 'increase') {
            this.cartService.increaseQuantity(id, productSize);
        } else if (action === 'decrease') {
            this.cartService.decreaseQuantity(id, productSize);
        }
        
        this.renderCart();
        this.renderNavbar();
    }


   showProductDetail(productId) {
    const product = this.productService.getProductById(productId);
    if (product) {
        const modal = document.getElementById('product-modal');
        const productDetails = document.getElementById('product-details');
        
        // Avaliações
        const reviews = this.reviewService.getReviewsForProduct(productId);
        const ratingInfo = this.reviewService.getAverageRatingForProduct(productId);

        productDetails.innerHTML = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-detail-info">
                    <h3>${product.name}</h3>
                    <p class="product-detail-price">R$ ${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    
                    <div class="product-meta mb-4">
                        ${product.sizes.map(size => `<span class="product-tag">${size}</span>`).join('')}
                    </div>
                    
                    <div class="size-selector">
                        ${product.sizes.map(size => 
                            `<div class="size-option" data-size="${size}">${size}</div>`
                        ).join('')}
                    </div>
                    
                    <button class="btn-primary" onclick="app.addToCart('${product.id}')">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
            <div class="product-reviews">
                ${renderReviewList(reviews, ratingInfo)}
                ${renderReviewForm(productId)}
            </div>
        `;
        
        modal.classList.add('active');
        
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Listener para o formulário de avaliação
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(reviewForm);
                const reviewData = {
                    productId: productId,
                    userId: this.authService.getCurrentUser()?.id || 'anon',
                    userName: this.authService.getCurrentUser()?.name || 'Anônimo',
                    rating: parseInt(formData.get('rating')),
                    text: formData.get('text'),
                    createdAt: new Date().toISOString()
                };
                this.reviewService.addReview(reviewData);
                this.showNotification('Avaliação enviada com sucesso!', 'success');
                this.showProductDetail(productId); // Atualiza reviews
            });
        }
    }
}

    applyCoupon(couponCode) {
        const discount = this.cartService.applyCoupon(couponCode);
        if (discount > 0) {
            this.showNotification(`Cupom aplicado! Desconto de R$ ${discount.toFixed(2)}`, 'success');
            this.renderCart();
            if (this.currentView === 'checkout') {
                this.renderCheckout();
            }
        } else {
            this.showNotification('Cupom inválido ou expirado', 'error');
        }
    }

    handleAuth(form) {
        const formData = new FormData(form);
        const type = form.dataset.type;
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (type === 'login') {
            const user = this.authService.login(email, password);
            if (user) {
                this.showNotification('Login realizado com sucesso!', 'success');
                this.closeModal('login-modal');
                this.renderNavbar();
                if (user.isAdmin) {
                    this.showView('admin');
                }
            } else {
                this.showNotification('Credenciais inválidas', 'error');
            }
        } else if (type === 'register') {
            const name = formData.get('name');
            const userType = formData.get('userType') || 'customer';
            
            const user = this.authService.register({
                email,
                password,
                name,
                role: userType
            });
            
            if (user) {
                this.showNotification('Cadastro realizado com sucesso!', 'success');
                this.closeModal('login-modal');
                this.renderNavbar();
                
                this.eventManager.publish('user_registered', { user });
            } else {
                this.showNotification('Erro ao criar conta', 'error');
            }
        }
    }

    async handleCheckout(form) {
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData.entries());
        
        const requiredFields = ['name', 'email', 'address', 'city', 'zip'];
        const missingFields = requiredFields.filter(field => !orderData[field]);
        
        if (missingFields.length > 0) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        const order = {
            id: Date.now().toString(),
            items: this.cartService.getItems(),
            total: this.cartService.getTotal(),
            shipping: this.cartService.getShipping(),
            discount: this.cartService.getDiscount(),
            customerData: orderData,
            status: 'pending',
            date: new Date()
        };
        
        // Exibe notificação de análise em andamento
        this.showNotification('Analisando transação...', 'info');
        
        try {
            // Chama o serviço anti-fraude para analisar o pedido
            const riskScore = await antiFraudService.analyze(order);
            
            // Verifica se o score de risco é aceitável
            if (!antiFraudService.isAcceptable(riskScore)) {
                this.showNotification('Transação recusada pelo sistema anti-fraude. Por favor, tente novamente ou entre em contato com o suporte.', 'error');
                return;
            }
            
            // Continua com o processamento do pedido se o risco for aceitável
            this.adminService.addOrder(order);
            this.eventManager.publish('order_placed', { order });
            this.cartService.clearCart();
            
            this.showNotification('Pedido realizado com sucesso!', 'success');
            this.showView('catalog');
            this.renderNavbar();
            
            this.sendOrderConfirmationEmail(order);
        } catch (error) {
            console.error('Erro ao processar análise anti-fraude:', error);
            this.showNotification('Erro ao processar o pagamento. Por favor, tente novamente.', 'error');
        }
    }

    async sendOrderConfirmationEmail(order) {
        try {
            const recipient = {
                email: order.customerData.email,
                name: order.customerData.name
            };
            
            const message = {
                subject: `Confirmação do Pedido #${order.id}`,
                content: `
                    <p>Seu pedido foi realizado com sucesso!</p>
                    <p><strong>Número do Pedido:</strong> #${order.id}</p>
                    <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
                    <p>Você receberá atualizações sobre o status do seu pedido.</p>
                `
            };
            
            const options = {
                template: 'order_confirmation',
                variables: {
                    orderNumber: order.id,
                    customerName: order.customerData.name,
                    orderTotal: order.total.toFixed(2)
                }
            };
            
            const result = await this.emailSender.sendNotification(recipient, message, options);
            this.logger.info('Order confirmation email sent', result);
        } catch (error) {
            this.logger.error('Failed to send order confirmation email', error);
        }
    }

    handleProductForm(form) {
        const formData = new FormData(form);
        const productData = Object.fromEntries(formData.entries());
        
        productData.sizes = productData.sizes ? productData.sizes.split(',').map(s => s.trim()) : [];
        productData.colors = productData.colors ? productData.colors.split(',').map(c => c.trim()) : [];
        productData.price = parseFloat(productData.price);
        
        if (productData.id) {
            this.productService.updateProduct(productData.id, productData);
            this.showNotification('Produto atualizado com sucesso!', 'success');
        } else {
            this.productService.addProduct(productData);
            this.showNotification('Produto adicionado com sucesso!', 'success');
        }
        
        this.renderAdmin();
        this.renderProducts();
    }

    checkAuthStatus() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.renderNavbar();
            this.eventManager.publish('user_login', { user });
        }
    }

    logout() {
        const user = this.authService.getCurrentUser();
        this.authService.logout();
        this.renderNavbar();
        this.showView('catalog');
        
        this.eventManager.publish('user_logout', { user });
    }

    showAdminSection(section) {
        console.log(`Showing admin section: ${section}`);
    }

    updateProfile(formData) {
        const userData = Object.fromEntries(formData.entries());
        this.authService.updateProfile(userData);
        this.showNotification('Perfil atualizado com sucesso!', 'success');
        this.renderNavbar();
    }

    simulateEmailNotification(order) {
        console.log(`📧 Email enviado para ${order.customerData.email}: Seu pedido #${order.id} foi recebido!`);
    }

    showNotification(message, type = 'info') {
        switch (type) {
            case 'success':
                this.notificationCenter.success('Sucesso', message);
                break;
            case 'error':
                this.notificationCenter.error('Erro', message);
                break;
            case 'warning':
                this.notificationCenter.warning('Aviso', message);
                break;
            default:
                this.notificationCenter.info('Informação', message);
        }
        

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            background: ${type === 'success' ? 'var(--success-500)' : type === 'error' ? 'var(--error-500)' : 'var(--primary-500)'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    generateSalesReport(options = {}) {
        try {
            const orders = this.adminService.getOrders();
            const report = this.salesReportGenerator.generateReport(orders, {
                title: 'Relatório de Vendas - FashionStore',
                groupBy: options.groupBy || 'day',
                includeDetails: options.includeDetails !== false,
                includeCharts: options.includeCharts || false
            });
            
            this.logger.info('Sales report generated successfully');
            return report;
        } catch (error) {
            this.logger.error('Failed to generate sales report', error);
            this.notificationCenter.error('Erro', 'Falha ao gerar relatório de vendas');
            return null;
        }
    }

    generateInventoryReport(options = {}) {
        try {
            const products = this.productService.getAllProducts();
            const report = this.inventoryReportGenerator.generateReport(products, {
                title: 'Relatório de Estoque - FashionStore',
                sortBy: options.sortBy || 'stock',
                order: options.order || 'asc',
                showLowStock: options.showLowStock !== false
            });
            
            this.logger.info('Inventory report generated successfully');
            return report;
        } catch (error) {
            this.logger.error('Failed to generate inventory report', error);
            this.notificationCenter.error('Erro', 'Falha ao gerar relatório de estoque');
            return null;
        }
    }

    async processPayment(paymentData) {
        try {
            let processor;
            
            switch (paymentData.method) {
                case 'credit_card':
                    processor = this.creditCardProcessor;
                    break;
                case 'pix':
                    processor = this.pixProcessor;
                    break;
                default:
                    throw new Error('Unsupported payment method');
            }
            
            const result = await processor.processPayment(paymentData);
            
            if (result.success) {
                this.logger.info('Payment processed successfully', result);
                this.notificationCenter.success('Pagamento', 'Pagamento processado com sucesso!');
            } else {
                this.logger.error('Payment processing failed', result);
                this.notificationCenter.error('Pagamento', 'Falha no processamento do pagamento');
            }
            
            return result;
        } catch (error) {
            this.logger.error('Payment processing error', error);
            this.notificationCenter.error('Pagamento', 'Erro no processamento do pagamento');
            return { success: false, error: error.message };
        }
    }

    getAnalytics() {
        return {
            userActivity: this.analyticsObserver.getMetrics(),
            sessionData: this.activityTracker.getSessionData(),
            notifications: this.notificationCenter.getCounts()
        };
    }

    exportUserActivities() {
        this.activityTracker.exportActivities();
        this.logger.info('User activities exported');
    }

    exportLogs() {
        this.logger.exportLogs();
        this.notificationCenter.success('Logs', 'Logs exportados com sucesso!');
    }
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    }
}

window.showProducts = () => {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    app.eventManager.publish('products_section_viewed');
};

window.setProductView = (view) => {
    app.currentProductView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${view}-view`).classList.add('active');
    app.renderProducts();
};

window.closeModal = (modalId) => {
    app.closeModal(modalId);
};

window.logout = () => {
    app.logout();
};

window.generateSalesReport = (options) => {
    const report = app.generateSalesReport(options);
    if (report) {
        console.log('Sales Report Generated:', report);
    }
};

window.generateInventoryReport = (options) => {
    const report = app.generateInventoryReport(options);
    if (report) {
        console.log('Inventory Report Generated:', report);
    }
};

window.exportUserActivities = () => {
    app.exportUserActivities();
};

window.exportLogs = () => {
    app.exportLogs();
};

window.getAnalytics = () => {
    const analytics = app.getAnalytics();
    console.log('Analytics Data:', analytics);
    return analytics;
};
const app = new App();
window.app = app;

window.openCart = () => {
    app.showView('cart');
};

window.designPatterns = {
    config: app.config,
    logger: app.logger,
    eventManager: app.eventManager,
    activityTracker: app.activityTracker,
    notificationCenter: app.notificationCenter
};
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }
    
    .notification-content button:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);