// Sistema de tipos de usuário e permissões com alta variabilidade
class UserTypeManager {
  static userTypes = {
    guest: {
      name: 'Visitante',
      permissions: ['view_products', 'view_public_content'],
      modules: [],
      interface: 'minimal',
      color: '#6b7280'
    },
    customer: {
      name: 'Cliente',
      permissions: ['view_products', 'add_to_cart', 'place_orders', 'view_profile'],
      modules: ['wishlist', 'order_tracking', 'reviews'],
      interface: 'standard',
      color: '#3b82f6'
    },
    premium_customer: {
      name: 'Cliente VIP',
      permissions: ['view_products', 'add_to_cart', 'place_orders', 'view_profile', 'early_access', 'vip_support'],
      modules: ['wishlist', 'order_tracking', 'reviews', 'vip_concierge', 'early_access', 'exclusive_discounts'],
      interface: 'premium',
      color: '#fbbf24'
    },
    seller: {
      name: 'Lojista',
      permissions: ['view_products', 'manage_inventory', 'view_analytics', 'manage_store'],
      modules: ['inventory', 'analytics', 'store_customization', 'order_management'],
      interface: 'business',
      color: '#10b981'
    },
    brecho: {
      name: 'Brechó',
      permissions: ['view_products', 'manage_inventory', 'quality_control', 'vintage_pricing'],
      modules: ['inventory', 'analytics', 'quality_control', 'vintage_catalog', 'authentication_system'],
      interface: 'vintage',
      color: '#8b5cf6'
    },
    grife: {
      name: 'Grife',
      permissions: ['view_products', 'manage_inventory', 'brand_management', 'exclusive_releases'],
      modules: ['inventory', 'analytics', 'brand_studio', 'exclusive_drops', 'influencer_network'],
      interface: 'luxury',
      color: '#ec4899'
    },
    distributor: {
      name: 'Distribuidor',
      permissions: ['bulk_orders', 'wholesale_pricing', 'logistics_management', 'multi_store_analytics'],
      modules: ['bulk_management', 'logistics', 'wholesale_pricing', 'multi_store_dashboard'],
      interface: 'enterprise',
      color: '#f59e0b'
    },
    admin: {
      name: 'Administrador',
      permissions: ['*'],
      modules: ['user_management', 'system_config', 'analytics_global', 'module_activation'],
      interface: 'admin',
      color: '#ef4444'
    }
  };

  static getCurrentUserType() {
    return localStorage.getItem('currentUserType') || 'guest';
  }

  static setUserType(type) {
    if (this.userTypes[type]) {
      localStorage.setItem('currentUserType', type);
      this.updateInterface();
      return true;
    }
    return false;
  }

  static getUserConfig() {
    const type = this.getCurrentUserType();
    return this.userTypes[type] || this.userTypes.guest;
  }

  static hasPermission(permission) {
    const config = this.getUserConfig();
    return config.permissions.includes('*') || config.permissions.includes(permission);
  }

  static getActiveModules() {
    return this.getUserConfig().modules;
  }

  static updateInterface() {
    this.updateNavigation();
    this.updateTheme();
    this.updateDashboard();
  }

  static updateNavigation() {
    const nav = document.querySelector('.topbar nav');
    if (!nav) return;

    const userType = this.getCurrentUserType();
    const config = this.getUserConfig();
    
    let navItems = '<a href="shop-grid.html">Loja</a>';

    // Navegação específica por tipo de usuário
    switch(userType) {
      case 'premium_customer':
        navItems += '<a href="vip-area.html">Área VIP</a>';
        navItems += '<a href="early-access.html">Pré-Lançamentos</a>';
        break;
      case 'seller':
        navItems += '<a href="seller-dashboard.html">Dashboard</a>';
        navItems += '<a href="store-customization.html">Personalizar Loja</a>';
        break;
      case 'brecho':
        navItems += '<a href="seller-dashboard.html">Dashboard</a>';
        navItems += '<a href="brecho-quality.html">Controle de Qualidade</a>';
        navItems += '<a href="vintage-authentication.html">Autenticação Vintage</a>';
        break;
      case 'grife':
        navItems += '<a href="seller-dashboard.html">Dashboard</a>';
        navItems += '<a href="grife-studio.html">Brand Studio</a>';
        navItems += '<a href="influencer-network.html">Rede de Influencers</a>';
        break;
      case 'distributor':
        navItems += '<a href="distributor-dashboard.html">Dashboard Distribuidor</a>';
        navItems += '<a href="bulk-orders.html">Pedidos em Massa</a>';
        navItems += '<a href="logistics-center.html">Centro Logístico</a>';
        break;
      case 'admin':
        navItems += '<a href="admin-panel.html">Painel Admin</a>';
        navItems += '<a href="system-config.html">Configurações</a>';
        navItems += '<a href="analytics-global.html">Analytics Global</a>';
        break;
    }

    nav.innerHTML = navItems;
  }

  static updateTheme() {
    const config = this.getUserConfig();
    document.documentElement.style.setProperty('--user-color', config.color);
    document.body.setAttribute('data-user-type', this.getCurrentUserType());
  }

  static updateDashboard() {
    // Atualiza elementos específicos do dashboard baseado no tipo de usuário
    const dashboardElements = document.querySelectorAll('[data-user-specific]');
    dashboardElements.forEach(element => {
      const requiredType = element.getAttribute('data-user-specific');
      element.style.display = this.getCurrentUserType() === requiredType ? 'block' : 'none';
    });
  }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  UserTypeManager.updateInterface();
});