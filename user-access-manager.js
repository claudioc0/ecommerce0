// Sistema avançado de gerenciamento de acesso e variabilidade de interface
class UserAccessManager {
  static userProfiles = {
    // Usuários básicos
    guest: {
      name: 'Visitante',
      level: 0,
      permissions: ['view_products', 'view_public_content'],
      modules: [],
      interface: 'minimal',
      color: '#6b7280',
      dashboard: null,
      features: ['basic_catalog']
    },
    
    customer: {
      name: 'Cliente',
      level: 1,
      permissions: ['view_products', 'add_to_cart', 'place_orders', 'view_profile'],
      modules: ['wishlist', 'order_tracking', 'reviews'],
      interface: 'standard',
      color: '#3b82f6',
      dashboard: 'customer-dashboard.html',
      features: ['basic_catalog', 'shopping_cart', 'order_history']
    },

    // Usuários premium com funcionalidades exclusivas
    premium_customer: {
      name: 'Cliente VIP',
      level: 2,
      permissions: ['view_products', 'add_to_cart', 'place_orders', 'view_profile', 'early_access', 'vip_support'],
      modules: ['wishlist', 'order_tracking', 'reviews', 'vip_concierge', 'early_access', 'exclusive_discounts'],
      interface: 'premium',
      color: '#fbbf24',
      dashboard: 'vip-area.html',
      features: ['basic_catalog', 'shopping_cart', 'order_history', 'early_access', 'vip_chat', 'exclusive_products']
    },

    // Vendedores com diferentes especializações
    seller: {
      name: 'Lojista Geral',
      level: 3,
      permissions: ['view_products', 'manage_inventory', 'view_analytics', 'manage_store'],
      modules: ['inventory', 'analytics', 'store_customization', 'order_management'],
      interface: 'business',
      color: '#10b981',
      dashboard: 'seller-dashboard.html',
      features: ['inventory_management', 'sales_analytics', 'store_customization']
    },

    brecho: {
      name: 'Brechó Especializado',
      level: 4,
      permissions: ['view_products', 'manage_inventory', 'quality_control', 'vintage_pricing', 'authentication'],
      modules: ['inventory', 'analytics', 'quality_control', 'vintage_catalog', 'authentication_system', 'vintage_pricing'],
      interface: 'vintage',
      color: '#8b5cf6',
      dashboard: 'brecho-dashboard.html',
      features: ['inventory_management', 'quality_control', 'vintage_authentication', 'historical_pricing']
    },

    grife: {
      name: 'Grife de Luxo',
      level: 5,
      permissions: ['view_products', 'manage_inventory', 'brand_management', 'exclusive_releases', 'influencer_network'],
      modules: ['inventory', 'analytics', 'brand_studio', 'exclusive_drops', 'influencer_network', 'luxury_packaging'],
      interface: 'luxury',
      color: '#ec4899',
      dashboard: 'grife-studio.html',
      features: ['brand_studio', 'exclusive_collections', 'influencer_management', 'luxury_analytics']
    },

    // Usuários corporativos
    distributor: {
      name: 'Distribuidor',
      level: 6,
      permissions: ['bulk_orders', 'wholesale_pricing', 'logistics_management', 'multi_store_analytics'],
      modules: ['bulk_management', 'logistics', 'wholesale_pricing', 'multi_store_dashboard', 'supply_chain'],
      interface: 'enterprise',
      color: '#f59e0b',
      dashboard: 'distributor-dashboard.html',
      features: ['bulk_operations', 'logistics_control', 'wholesale_management', 'supply_chain_analytics']
    },

    // Usuários especiais com acesso híbrido
    fashion_consultant: {
      name: 'Consultor de Moda',
      level: 4,
      permissions: ['view_products', 'style_recommendations', 'client_management', 'trend_analysis'],
      modules: ['style_engine', 'client_portfolio', 'trend_analytics', 'personal_shopping'],
      interface: 'consultant',
      color: '#06b6d4',
      dashboard: 'consultant-dashboard.html',
      features: ['style_recommendations', 'client_management', 'trend_analysis', 'personal_shopping']
    },

    sustainability_auditor: {
      name: 'Auditor de Sustentabilidade',
      level: 5,
      permissions: ['audit_products', 'sustainability_reports', 'certification_management', 'impact_analysis'],
      modules: ['sustainability_audit', 'impact_calculator', 'certification_tracker', 'eco_reports'],
      interface: 'auditor',
      color: '#22c55e',
      dashboard: 'sustainability-dashboard.html',
      features: ['sustainability_audit', 'impact_tracking', 'certification_management', 'eco_analytics']
    },

    // Administração
    admin: {
      name: 'Administrador',
      level: 10,
      permissions: ['*'],
      modules: ['user_management', 'system_config', 'analytics_global', 'module_activation', 'security_center'],
      interface: 'admin',
      color: '#ef4444',
      dashboard: 'admin-panel.html',
      features: ['user_management', 'system_configuration', 'global_analytics', 'security_management']
    }
  };

  static getCurrentUser() {
    const userType = localStorage.getItem('currentUserType') || 'guest';
    const customConfig = JSON.parse(localStorage.getItem('userCustomConfig') || '{}');
    return { ...this.userProfiles[userType], ...customConfig };
  }

  static setUserType(type, customConfig = {}) {
    if (this.userProfiles[type]) {
      localStorage.setItem('currentUserType', type);
      localStorage.setItem('userCustomConfig', JSON.stringify(customConfig));
      this.updateInterface();
      return true;
    }
    return false;
  }

  static hasPermission(permission) {
    const user = this.getCurrentUser();
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  static hasModule(module) {
    const user = this.getCurrentUser();
    return user.modules.includes(module);
  }

  static hasFeature(feature) {
    const user = this.getCurrentUser();
    return user.features.includes(feature);
  }

  static getInterfaceVariant() {
    return this.getCurrentUser().interface;
  }

  static updateInterface() {
    this.updateNavigation();
    this.updateTheme();
    this.updateDashboardAccess();
    this.updateModuleVisibility();
  }

  static updateNavigation() {
    const nav = document.querySelector('.topbar nav');
    if (!nav) return;

    const user = this.getCurrentUser();
    let navItems = '<a href="shop-grid.html">Loja</a>';

    // Navegação baseada em permissões específicas
    if (this.hasPermission('manage_inventory')) {
      navItems += '<a href="seller-dashboard.html">Dashboard</a>';
    }

    if (this.hasModule('quality_control')) {
      navItems += '<a href="brecho-quality.html">Controle de Qualidade</a>';
    }

    if (this.hasModule('brand_studio')) {
      navItems += '<a href="grife-studio.html">Brand Studio</a>';
    }

    if (this.hasModule('vip_concierge')) {
      navItems += '<a href="vip-area.html">Área VIP</a>';
    }

    if (this.hasModule('style_engine')) {
      navItems += '<a href="consultant-dashboard.html">Consultoria</a>';
    }

    if (this.hasModule('sustainability_audit')) {
      navItems += '<a href="sustainability-dashboard.html">Sustentabilidade</a>';
    }

    if (this.hasPermission('bulk_orders')) {
      navItems += '<a href="distributor-dashboard.html">Distribuição</a>';
    }

    if (user.level >= 10) {
      navItems += '<a href="admin-panel.html">Admin</a>';
    }

    nav.innerHTML = navItems;
  }

  static updateTheme() {
    const user = this.getCurrentUser();
    document.documentElement.style.setProperty('--user-color', user.color);
    document.body.setAttribute('data-user-type', localStorage.getItem('currentUserType'));
    document.body.setAttribute('data-interface', user.interface);
  }

  static updateModuleVisibility() {
    // Esconde/mostra elementos baseado nos módulos do usuário
    document.querySelectorAll('[data-module]').forEach(element => {
      const requiredModule = element.getAttribute('data-module');
      element.style.display = this.hasModule(requiredModule) ? 'block' : 'none';
    });

    // Esconde/mostra elementos baseado em permissões
    document.querySelectorAll('[data-permission]').forEach(element => {
      const requiredPermission = element.getAttribute('data-permission');
      element.style.display = this.hasPermission(requiredPermission) ? 'block' : 'none';
    });

    // Esconde/mostra elementos baseado em features
    document.querySelectorAll('[data-feature]').forEach(element => {
      const requiredFeature = element.getAttribute('data-feature');
      element.style.display = this.hasFeature(requiredFeature) ? 'block' : 'none';
    });
  }

  static updateDashboardAccess() {
    const user = this.getCurrentUser();
    const dashboardLinks = document.querySelectorAll('a[href*="dashboard"]');
    
    dashboardLinks.forEach(link => {
      if (user.dashboard && link.getAttribute('href') !== user.dashboard) {
        link.style.display = 'none';
      }
    });
  }

  // Sistema de personalização avançada
  static enableCustomization(userId, customizations) {
    const currentConfig = JSON.parse(localStorage.getItem('userCustomConfig') || '{}');
    const newConfig = { ...currentConfig, ...customizations };
    localStorage.setItem('userCustomConfig', JSON.stringify(newConfig));
    this.updateInterface();
  }

  static getAvailableCustomizations() {
    const user = this.getCurrentUser();
    const customizations = {
      theme: ['light', 'dark', 'auto'],
      layout: ['grid', 'list', 'cards'],
      density: ['compact', 'comfortable', 'spacious']
    };

    // Customizações específicas por tipo de usuário
    if (user.level >= 4) {
      customizations.advanced_filters = true;
      customizations.custom_categories = true;
    }

    if (user.level >= 6) {
      customizations.white_label = true;
      customizations.custom_branding = true;
    }

    return customizations;
  }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  UserAccessManager.updateInterface();
});