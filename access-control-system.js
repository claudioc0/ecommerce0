// Sistema Avançado de Controle de Acesso e Variabilidade
class AccessControlSystem {
  static userHierarchy = {
    // Nível 0 - Acesso público
    guest: {
      name: 'Visitante',
      level: 0,
      permissions: ['view_products', 'view_public_content'],
      modules: [],
      interface: 'public',
      color: '#6b7280',
      dashboard: null,
      features: ['basic_catalog'],
      restrictions: ['no_purchase', 'no_profile']
    },

    // Nível 1 - Clientes básicos
    customer: {
      name: 'Cliente',
      level: 1,
      permissions: ['view_products', 'add_to_cart', 'place_orders', 'view_profile'],
      modules: ['wishlist', 'order_tracking', 'reviews'],
      interface: 'customer',
      color: '#3b82f6',
      dashboard: 'customer-dashboard.html',
      features: ['shopping_cart', 'order_history', 'basic_recommendations'],
      restrictions: ['limited_support']
    },

    // Nível 2 - Clientes premium
    premium_customer: {
      name: 'Cliente VIP',
      level: 2,
      permissions: ['view_products', 'add_to_cart', 'place_orders', 'view_profile', 'early_access', 'vip_support'],
      modules: ['wishlist', 'order_tracking', 'reviews', 'vip_concierge', 'early_access', 'exclusive_discounts'],
      interface: 'vip',
      color: '#fbbf24',
      dashboard: 'vip-area.html',
      features: ['shopping_cart', 'order_history', 'early_access', 'vip_chat', 'exclusive_products', 'free_shipping'],
      restrictions: []
    },

    // Nível 3 - Vendedores básicos
    seller: {
      name: 'Lojista',
      level: 3,
      permissions: ['view_products', 'manage_inventory', 'view_analytics', 'manage_store'],
      modules: ['inventory', 'analytics', 'store_customization', 'order_management'],
      interface: 'business',
      color: '#10b981',
      dashboard: 'seller-dashboard.html',
      features: ['inventory_management', 'sales_analytics', 'store_customization', 'basic_marketing'],
      restrictions: ['basic_analytics_only']
    },

    // Nível 4 - Especialistas (Brechós, Consultores)
    brecho: {
      name: 'Brechó Especializado',
      level: 4,
      permissions: ['view_products', 'manage_inventory', 'quality_control', 'vintage_pricing', 'authentication'],
      modules: ['inventory', 'analytics', 'quality_control', 'vintage_catalog', 'authentication_system', 'vintage_pricing'],
      interface: 'vintage_specialist',
      color: '#8b5cf6',
      dashboard: 'brecho-dashboard.html',
      features: ['inventory_management', 'quality_control', 'vintage_authentication', 'historical_pricing', 'rarity_assessment'],
      restrictions: [],
      exclusiveFeatures: ['vintage_authentication', 'historical_market_analysis', 'authenticity_certificates']
    },

    fashion_consultant: {
      name: 'Consultor de Moda',
      level: 4,
      permissions: ['view_products', 'style_recommendations', 'client_management', 'trend_analysis'],
      modules: ['style_engine', 'client_portfolio', 'trend_analytics', 'personal_shopping'],
      interface: 'consultant',
      color: '#06b6d4',
      dashboard: 'consultant-dashboard.html',
      features: ['style_recommendations', 'client_management', 'trend_analysis', 'personal_shopping', 'color_analysis'],
      restrictions: [],
      exclusiveFeatures: ['ai_style_engine', 'body_type_analysis', 'seasonal_color_analysis']
    },

    // Nível 5 - Especialistas avançados
    grife: {
      name: 'Grife de Luxo',
      level: 5,
      permissions: ['view_products', 'manage_inventory', 'brand_management', 'exclusive_releases', 'influencer_network'],
      modules: ['inventory', 'analytics', 'brand_studio', 'exclusive_drops', 'influencer_network', 'luxury_packaging'],
      interface: 'luxury_brand',
      color: '#ec4899',
      dashboard: 'grife-studio.html',
      features: ['brand_studio', 'exclusive_collections', 'influencer_management', 'luxury_analytics', 'vip_client_management'],
      restrictions: [],
      exclusiveFeatures: ['brand_design_studio', 'influencer_collaboration_tools', 'exclusive_launch_system']
    },

    sustainability_auditor: {
      name: 'Auditor de Sustentabilidade',
      level: 5,
      permissions: ['audit_products', 'sustainability_reports', 'certification_management', 'impact_analysis'],
      modules: ['sustainability_audit', 'impact_calculator', 'certification_tracker', 'eco_reports'],
      interface: 'auditor',
      color: '#22c55e',
      dashboard: 'sustainability-dashboard.html',
      features: ['sustainability_audit', 'impact_tracking', 'certification_management', 'eco_analytics', 'carbon_calculator'],
      restrictions: [],
      exclusiveFeatures: ['carbon_footprint_calculator', 'sustainability_certification_system', 'environmental_impact_reports']
    },

    // Nível 6 - Corporativo
    distributor: {
      name: 'Distribuidor',
      level: 6,
      permissions: ['bulk_orders', 'wholesale_pricing', 'logistics_management', 'multi_store_analytics'],
      modules: ['bulk_management', 'logistics', 'wholesale_pricing', 'multi_store_dashboard', 'supply_chain'],
      interface: 'enterprise',
      color: '#f59e0b',
      dashboard: 'distributor-dashboard.html',
      features: ['bulk_operations', 'logistics_control', 'wholesale_management', 'supply_chain_analytics', 'multi_store_oversight'],
      restrictions: [],
      exclusiveFeatures: ['bulk_order_system', 'logistics_optimization', 'multi_store_analytics']
    },

    // Nível 10 - Administração
    admin: {
      name: 'Administrador',
      level: 10,
      permissions: ['*'],
      modules: ['user_management', 'system_config', 'analytics_global', 'module_activation', 'security_center'],
      interface: 'admin',
      color: '#ef4444',
      dashboard: 'admin-panel.html',
      features: ['user_management', 'system_configuration', 'global_analytics', 'security_management', 'module_control'],
      restrictions: [],
      exclusiveFeatures: ['system_administration', 'user_type_management', 'global_system_control']
    }
  };

  static moduleDefinitions = {
    // Módulos básicos (disponíveis para múltiplos tipos)
    wishlist: {
      name: 'Lista de Desejos',
      description: 'Salvar produtos favoritos',
      requiredLevel: 1,
      compatibleTypes: ['customer', 'premium_customer']
    },
    
    inventory: {
      name: 'Gestão de Estoque',
      description: 'Controle de produtos e quantidades',
      requiredLevel: 3,
      compatibleTypes: ['seller', 'brecho', 'grife', 'distributor']
    },

    // Módulos exclusivos
    vintage_authentication: {
      name: 'Autenticação Vintage',
      description: 'Sistema de verificação de autenticidade para peças vintage',
      requiredLevel: 4,
      compatibleTypes: ['brecho'],
      exclusive: true,
      aiPowered: true
    },

    style_engine: {
      name: 'Engine de Estilo IA',
      description: 'Recomendações personalizadas baseadas em IA',
      requiredLevel: 4,
      compatibleTypes: ['fashion_consultant'],
      exclusive: true,
      aiPowered: true
    },

    brand_studio: {
      name: 'Brand Studio',
      description: 'Ferramentas de design e gestão de marca',
      requiredLevel: 5,
      compatibleTypes: ['grife'],
      exclusive: true
    },

    carbon_calculator: {
      name: 'Calculadora de Carbono',
      description: 'Análise de pegada de carbono de produtos',
      requiredLevel: 5,
      compatibleTypes: ['sustainability_auditor'],
      exclusive: true,
      aiPowered: true
    },

    bulk_operations: {
      name: 'Operações em Massa',
      description: 'Gestão de pedidos e logística em grande escala',
      requiredLevel: 6,
      compatibleTypes: ['distributor'],
      exclusive: true
    }
  };

  static getCurrentUserType() {
    return localStorage.getItem('currentUserType') || 'guest';
  }

  static getCurrentUser() {
    const userType = this.getCurrentUserType();
    const customConfig = JSON.parse(localStorage.getItem('userCustomConfig') || '{}');
    const baseConfig = this.userHierarchy[userType] || this.userHierarchy.guest;
    return { ...baseConfig, ...customConfig, type: userType };
  }

  static setUserType(type, customModules = []) {
    if (this.userHierarchy[type]) {
      localStorage.setItem('currentUserType', type);
      
      // Ativar módulos customizados se permitido
      const allowedModules = this.getAvailableModules(type);
      const validCustomModules = customModules.filter(module => 
        allowedModules.includes(module)
      );
      
      if (validCustomModules.length > 0) {
        const customConfig = { additionalModules: validCustomModules };
        localStorage.setItem('userCustomConfig', JSON.stringify(customConfig));
      }
      
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
    const baseModules = user.modules || [];
    const additionalModules = user.additionalModules || [];
    return baseModules.includes(module) || additionalModules.includes(module);
  }

  static hasFeature(feature) {
    const user = this.getCurrentUser();
    return (user.features || []).includes(feature);
  }

  static hasExclusiveFeature(feature) {
    const user = this.getCurrentUser();
    return (user.exclusiveFeatures || []).includes(feature);
  }

  static getAvailableModules(userType = null) {
    const type = userType || this.getCurrentUserType();
    const user = this.userHierarchy[type];
    if (!user) return [];

    return Object.keys(this.moduleDefinitions).filter(moduleKey => {
      const module = this.moduleDefinitions[moduleKey];
      return module.compatibleTypes.includes(type) && user.level >= module.requiredLevel;
    });
  }

  static updateInterface() {
    this.updateNavigation();
    this.updateTheme();
    this.updateModuleVisibility();
    this.updateDashboardAccess();
    this.enforceRestrictions();
  }

  static updateNavigation() {
    const nav = document.querySelector('.topbar nav');
    if (!nav) return;

    const user = this.getCurrentUser();
    let navItems = '<a href="shop-grid.html">Loja</a>';

    // Navegação dinâmica baseada em permissões e módulos
    if (this.hasPermission('manage_inventory')) {
      navItems += '<a href="seller-dashboard.html">Dashboard</a>';
    }

    if (this.hasModule('quality_control')) {
      navItems += '<a href="brecho-quality.html">Controle de Qualidade</a>';
    }

    if (this.hasExclusiveFeature('vintage_authentication')) {
      navItems += '<a href="vintage-authentication.html">Autenticação Vintage</a>';
    }

    if (this.hasExclusiveFeature('brand_design_studio')) {
      navItems += '<a href="grife-studio.html">Brand Studio</a>';
    }

    if (this.hasModule('vip_concierge')) {
      navItems += '<a href="vip-area.html">Área VIP</a>';
    }

    if (this.hasExclusiveFeature('ai_style_engine')) {
      navItems += '<a href="consultant-dashboard.html">Consultoria</a>';
    }

    if (this.hasExclusiveFeature('carbon_footprint_calculator')) {
      navItems += '<a href="sustainability-dashboard.html">Sustentabilidade</a>';
    }

    if (this.hasExclusiveFeature('bulk_order_system')) {
      navItems += '<a href="distributor-dashboard.html">Distribuição</a>';
    }

    if (user.level >= 3) {
      navItems += '<a href="interface-customizer.html">Personalizar</a>';
    }

    if (user.level >= 10) {
      navItems += '<a href="admin-panel.html">Admin</a>';
    }

    nav.innerHTML = navItems;
  }

  static updateTheme() {
    const user = this.getCurrentUser();
    document.documentElement.style.setProperty('--user-color', user.color);
    document.documentElement.style.setProperty('--user-interface', user.interface);
    document.body.setAttribute('data-user-type', user.type);
    document.body.setAttribute('data-interface', user.interface);
    document.body.setAttribute('data-level', user.level);
  }

  static updateModuleVisibility() {
    // Controle granular de visibilidade
    document.querySelectorAll('[data-module]').forEach(element => {
      const requiredModule = element.getAttribute('data-module');
      element.style.display = this.hasModule(requiredModule) ? 'block' : 'none';
    });

    document.querySelectorAll('[data-permission]').forEach(element => {
      const requiredPermission = element.getAttribute('data-permission');
      element.style.display = this.hasPermission(requiredPermission) ? 'block' : 'none';
    });

    document.querySelectorAll('[data-feature]').forEach(element => {
      const requiredFeature = element.getAttribute('data-feature');
      element.style.display = this.hasFeature(requiredFeature) ? 'block' : 'none';
    });

    document.querySelectorAll('[data-exclusive]').forEach(element => {
      const exclusiveFeature = element.getAttribute('data-exclusive');
      element.style.display = this.hasExclusiveFeature(exclusiveFeature) ? 'block' : 'none';
    });

    document.querySelectorAll('[data-min-level]').forEach(element => {
      const minLevel = parseInt(element.getAttribute('data-min-level'));
      const user = this.getCurrentUser();
      element.style.display = user.level >= minLevel ? 'block' : 'none';
    });
  }

  static updateDashboardAccess() {
    const user = this.getCurrentUser();
    
    // Redirecionar para dashboard apropriado se necessário
    if (user.dashboard && window.location.pathname.endsWith('index.html')) {
      const dashboardLink = document.querySelector(`a[href="${user.dashboard}"]`);
      if (dashboardLink && user.level >= 3) {
        // Adicionar link rápido para dashboard
        const quickAccess = document.createElement('div');
        quickAccess.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000;';
        quickAccess.innerHTML = `
          <a href="${user.dashboard}" class="btn" style="box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
            Ir para ${user.name} Dashboard
          </a>
        `;
        document.body.appendChild(quickAccess);
      }
    }
  }

  static enforceRestrictions() {
    const user = this.getCurrentUser();
    const restrictions = user.restrictions || [];

    restrictions.forEach(restriction => {
      switch(restriction) {
        case 'no_purchase':
          document.querySelectorAll('.btn[onclick*="addToCart"]').forEach(btn => {
            btn.style.display = 'none';
          });
          break;
        case 'no_profile':
          document.querySelectorAll('#userProfile').forEach(profile => {
            profile.style.display = 'none';
          });
          break;
        case 'limited_support':
          document.querySelectorAll('[data-feature="vip_chat"]').forEach(chat => {
            chat.style.display = 'none';
          });
          break;
        case 'basic_analytics_only':
          document.querySelectorAll('[data-feature="advanced_analytics"]').forEach(analytics => {
            analytics.style.display = 'none';
          });
          break;
      }
    });
  }

  // Sistema de personalização avançada
  static enableCustomization(customizations) {
    const currentConfig = JSON.parse(localStorage.getItem('userCustomConfig') || '{}');
    const newConfig = { ...currentConfig, ...customizations };
    localStorage.setItem('userCustomConfig', JSON.stringify(newConfig));
    this.updateInterface();
  }

  static getCustomizationOptions() {
    const user = this.getCurrentUser();
    const options = {
      themes: ['light', 'dark'],
      layouts: ['grid', 'list'],
      density: ['compact', 'comfortable', 'spacious']
    };

    // Opções avançadas baseadas no nível
    if (user.level >= 4) {
      options.themes.push('vintage', 'luxury', 'eco');
      options.layouts.push('cards', 'masonry');
      options.advanced_filters = true;
      options.custom_categories = true;
    }

    if (user.level >= 6) {
      options.white_label = true;
      options.custom_branding = true;
      options.api_access = true;
    }

    return options;
  }

  // Sistema de demonstração de funcionalidade exclusiva
  static demonstrateExclusiveAccess(feature, userType) {
    const hasAccess = this.userHierarchy[userType]?.exclusiveFeatures?.includes(feature);
    
    if (!hasAccess) {
      return {
        access: false,
        message: `Funcionalidade "${feature}" é exclusiva para usuários do tipo "${userType}".`,
        redirectTo: 'access-denied.html'
      };
    }

    return {
      access: true,
      message: `Acesso liberado para "${feature}".`,
      additionalFeatures: this.userHierarchy[userType].exclusiveFeatures
    };
  }

  // Análise de variabilidade do sistema
  static getSystemVariabilityReport() {
    const totalUserTypes = Object.keys(this.userHierarchy).length;
    const totalModules = Object.keys(this.moduleDefinitions).length;
    const exclusiveModules = Object.values(this.moduleDefinitions).filter(m => m.exclusive).length;
    
    return {
      userTypes: totalUserTypes,
      totalModules: totalModules,
      exclusiveModules: exclusiveModules,
      variabilityScore: ((exclusiveModules / totalModules) * 100).toFixed(1) + '%',
      interfaceVariants: [...new Set(Object.values(this.userHierarchy).map(u => u.interface))].length
    };
  }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  AccessControlSystem.updateInterface();
  
  // Debug: mostrar relatório de variabilidade no console
  console.log('Sistema de Alta Variabilidade:', AccessControlSystem.getSystemVariabilityReport());
});