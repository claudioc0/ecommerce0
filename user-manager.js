// Gerenciador de usuários e permissões
class UserManager {
  static getUserType() {
    return localStorage.getItem('userType') || 'guest';
  }

  static getUserPermissions() {
    const userType = this.getUserType();
    const permissions = {
      guest: ['view_products', 'add_to_cart'],
      customer: ['view_products', 'add_to_cart', 'place_orders', 'view_profile'],
      seller: ['view_products', 'manage_inventory', 'view_analytics', 'manage_store'],
      brecho: ['view_products', 'manage_inventory', 'quality_control', 'vintage_pricing'],
      grife: ['view_products', 'manage_inventory', 'brand_management', 'exclusive_releases'],
      admin: ['*'], // Acesso total
      premium_customer: ['view_products', 'add_to_cart', 'place_orders', 'view_profile', 'early_access', 'vip_support']
    };
    return permissions[userType] || permissions.guest;
  }

  static hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes('*') || permissions.includes(permission);
  }

  static getActiveModules() {
    const userType = this.getUserType();
    const modules = {
      guest: [],
      customer: ['wishlist', 'order_tracking'],
      seller: ['inventory', 'analytics', 'store_customization'],
      brecho: ['inventory', 'analytics', 'quality_control', 'vintage_catalog'],
      grife: ['inventory', 'analytics', 'brand_studio', 'exclusive_drops'],
      admin: ['user_management', 'system_config', 'analytics_global'],
      premium_customer: ['wishlist', 'order_tracking', 'vip_concierge', 'early_access']
    };
    return modules[userType] || [];
  }

  static setUserType(type) {
    localStorage.setItem('userType', type);
    this.updateInterface();
  }

  static updateInterface() {
    // Atualiza a interface baseada no tipo de usuário
    this.updateNavigation();
    this.updateDashboard();
    this.updateFeatures();
  }

  static updateNavigation() {
    const nav = document.querySelector('.topbar nav');
    if (!nav) return;

    const userType = this.getUserType();
    let navItems = '<a href="shop-grid.html">Loja</a>';

    if (this.hasPermission('manage_inventory')) {
      navItems += '<a href="seller-dashboard.html">Dashboard</a>';
    }

    if (this.hasPermission('quality_control')) {
      navItems += '<a href="brecho-quality.html">Controle de Qualidade</a>';
    }

    if (this.hasPermission('brand_management')) {
      navItems += '<a href="grife-studio.html">Brand Studio</a>';
    }

    if (userType === 'premium_customer') {
      navItems += '<a href="vip-area.html">Área VIP</a>';
    }

    if (userType === 'admin') {
      navItems += '<a href="admin-panel.html">Admin</a>';
    }

    nav.innerHTML = navItems;
  }

  static updateDashboard() {
    // Lógica para atualizar dashboard específico do usuário
  }

  static updateFeatures() {
    // Lógica para mostrar/ocultar features baseado no tipo de usuário
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  UserManager.updateInterface();
});