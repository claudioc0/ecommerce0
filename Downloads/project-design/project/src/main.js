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

// Import Design Patterns
import { ConfigManager } from './patterns/singleton/ConfigManager.js';
import { Logger } from './patterns/singleton/Logger.js';
import { SalesReportGenerator, InventoryReportGenerator } from './patterns/template/ReportGenerator.js';
import { CreditCardProcessor, PIXProcessor } from './patterns/template/PaymentProcessor.js';
import { EmailNotificationSender, SMSNotificationSender } from './patterns/template/NotificationSender.js';
import { globalEventManager } from './patterns/observer/EventManager.js';
import { globalActivityTracker, AnalyticsObserver, SecurityObserver } from './patterns/observer/UserActivityTracker.js';
import { globalNotificationCenter, NotificationDisplay } from './patterns/observer/NotificationCenter.js';

class App {
    constructor() {
        // Initialize Design Patterns
        this.initializeDesignPatterns();
        
        this.authService = new AuthService();
        this.productService = new ProductService();
        this.cartService = new CartService();
        this.adminService = new AdminService();
        
        this.currentView = 'catalog';
        this.currentProductView = 'grid';
        
        this.init();
    }

    initializeDesignPatterns() {
        // Singleton Pattern Examples
        this.config = ConfigManager.getInstance();
        this.logger = Logger.getInstance();
        
        // Template Method Pattern Examples
        this.salesReportGenerator = new SalesReportGenerator();
        this.inventoryReportGenerator = new InventoryReportGenerator();
        this.creditCardProcessor = new CreditCardProcessor();
        this.pixProcessor = new PIXProcessor();
        this.emailSender = new EmailNotificationSender();
        this.smsSender = new SMSNotificationSender();
        
        // Observer Pattern Examples
        this.eventManager = globalEventManager;
        this.activityTracker = globalActivityTracker;
        this.notificationCenter = globalNotificationCenter;
        
        // Initialize observers
        this.analyticsObserver = new AnalyticsObserver('FashionStore Analytics');
        this.securityObserver = new SecurityObserver('FashionStore Security');
        
        // Add observers to activity tracker
        this.activityTracker.addObserver(this.analyticsObserver);
        this.activityTracker.addObserver(this.securityObserver);
        
        // Initialize notification display
        this.notificationDisplay = new NotificationDisplay(this.notificationCenter);
        
        // Start activity tracking
        this.activityTracker.startTracking();
        
        // Setup event listeners for design patterns
        this.setupDesignPatternEvents();
        
        this.logger.info('Design patterns initialized successfully');
    }

    setupDesignPatternEvents() {
        // Subscribe to application events
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
        
        // Subscribe to notification actions
        window.addEventListener('notificationAction', (event) => {
            this.handleNotificationAction(event.detail);
        });
    }

    handleNotificationAction(detail) {
        const { actionType, notification } = detail;
        
        switch (actionType) {
            case 'view_order':
                this.showView('profile');
                break;
            case 'continue_shopping':
                this.showView('catalog');
                break;
            case 'track_order':
                this.showView('profile');
                break;
            case 'restock_product':
                if (this.authService.getCurrentUser()?.isAdmin) {
                    this.showView('admin');
                }
                break;
        }
    }
    init() {
        this.renderNavbar();
        this.renderFilters();
        this.renderProducts();
        this.setupEventListeners();
        this.checkAuthStatus();
        
        // Log application initialization
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

    renderFilters() {
        const filtersContainer = document.getElementById('filters');
        filtersContainer.innerHTML = renderFilters();
        this.setupFilterListeners();
    }

    renderProducts() {
        const products = this.productService.getFilteredProducts();
        const productsGrid = document.getElementById('products-grid');
        productsGrid.className = this.currentProductView === 'grid' ? 'products-grid' : 'products-list';
        productsGrid.innerHTML = renderProducts(products, this.currentProductView);
        this.setupProductListeners();
    }

    renderCart() {
        const cartContent = document.getElementById('cart-content');
        cartContent.innerHTML = renderCart(
            this.cartService.getItems(),
            this.cartService.getTotal(),
            this.cartService.getShipping(),
            this.cartService.getDiscount()
        );
        this.setupCartListeners();
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
        const profileContent = document.getElementById('profile-content');
        profileContent.innerHTML = renderProfile(
            this.authService.getCurrentUser(),
            this.adminService.getUserOrders()
        );
        this.setupProfileListeners();
    }

    setupEventListeners() {
        // Global event delegation
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Navigation
            if (target.matches('[data-view]')) {
                e.preventDefault();
                this.showView(target.dataset.view);
            }
            
            // Authentication
            if (target.matches('[data-auth]')) {
                this.showAuthModal(target.dataset.auth);
            }
            
            // Cart actions
            if (target.matches('[data-cart-action]')) {
                this.handleCartAction(target.dataset.cartAction, target.dataset.productId);
            }
            
            // Product actions
            if (target.matches('[data-product-action]')) {
                this.handleProductAction(target.dataset.productAction, target.dataset.productId);
            }
        });
        
        // Form submissions
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
    }

    setupCartListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const productId = btn.dataset.productId;
                this.updateCartQuantity(productId, action);
            });
        });
        
        // Remove items
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                this.cartService.removeItem(productId);
                this.renderCart();
                this.renderNavbar();
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
        // Profile update form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile(new FormData(profileForm));
            });
        }
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show selected view
        const selectedView = document.getElementById(`${viewName}-view`);
        if (selectedView) {
            selectedView.classList.add('active');
            this.currentView = viewName;
            
            // Render view-specific content
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
            }
        }
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('login-modal');
        const authContent = document.getElementById('auth-content');
        authContent.innerHTML = renderAuth(type);
        modal.classList.add('active');
        
        // Setup auth form listeners
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;
                authContent.innerHTML = renderAuth(tabType);
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
            
            // Publish cart event
            this.eventManager.publish('product_added_to_cart', { product });
            
            // Check for low stock
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

    showProductDetail(productId) {
        const product = this.productService.getProductById(productId);
        if (product) {
            const modal = document.getElementById('product-modal');
            const productDetails = document.getElementById('product-details');
            
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
            `;
            
            modal.classList.add('active');
            
            // Size selection
            document.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            });
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
                
                // Publish registration event
                this.eventManager.publish('user_registered', { user });
            } else {
                this.showNotification('Erro ao criar conta', 'error');
            }
        }
    }

    handleCheckout(form) {
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData.entries());
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'address', 'city', 'zip'];
        const missingFields = requiredFields.filter(field => !orderData[field]);
        
        if (missingFields.length > 0) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Process order
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
        
        // Save order
        this.adminService.addOrder(order);
        
        // Publish order event
        this.eventManager.publish('order_placed', { order });
        
        // Clear cart
        this.cartService.clearCart();
        
        // Show success message
        this.showNotification('Pedido realizado com sucesso!', 'success');
        this.showView('catalog');
        this.renderNavbar();
        
        // Send email notification using Template Method pattern
        this.sendOrderConfirmationEmail(order);
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
        
        // Convert sizes and colors to arrays
        productData.sizes = productData.sizes ? productData.sizes.split(',').map(s => s.trim()) : [];
        productData.colors = productData.colors ? productData.colors.split(',').map(c => c.trim()) : [];
        productData.price = parseFloat(productData.price);
        
        if (productData.id) {
            // Update existing product
            this.productService.updateProduct(productData.id, productData);
            this.showNotification('Produto atualizado com sucesso!', 'success');
        } else {
            // Add new product
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
        }
    }
            
            // Publish login event
            this.eventManager.publish('user_login', { user });
            

    logout() {
        const user = this.authService.getCurrentUser();
        this.authService.logout();
        this.renderNavbar();
        this.showView('catalog');
        
        // Publish logout event
        this.eventManager.publish('user_logout', { user });
    }

    showAdminSection(section) {
        // This would show different admin sections
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
        // Use the new notification center instead of the old system
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
        
        // Keep the old notification system for backward compatibility
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add notification styles
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
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // New methods using design patterns
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
            securityAlerts: this.securityObserver.getSuspiciousActivities(),
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

// Global functions for onclick handlers
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

// New global functions for design patterns
window.generateSalesReport = (options) => {
    const report = app.generateSalesReport(options);
    if (report) {
        console.log('Sales Report Generated:', report);
        // You could display this in a modal or new page
    }
};

window.generateInventoryReport = (options) => {
    const report = app.generateInventoryReport(options);
    if (report) {
        console.log('Inventory Report Generated:', report);
        // You could display this in a modal or new page
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
// Initialize app
const app = new App();
window.app = app;

// Expose design pattern instances for debugging
window.designPatterns = {
    config: app.config,
    logger: app.logger,
    eventManager: app.eventManager,
    activityTracker: app.activityTracker,
    notificationCenter: app.notificationCenter
};
// Add notification animation styles
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