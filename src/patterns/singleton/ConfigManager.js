/**
 * Singleton Pattern - Example 1: Configuration Manager
 * Ensures only one instance of configuration exists throughout the application
 */
export class ConfigManager {
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }

        this.config = {
            apiUrl: 'https://api.fashionstore.com',
            theme: 'light',
            language: 'pt-BR',
            currency: 'BRL',
            maxCartItems: 50,
            sessionTimeout: 30 * 60 * 1000, 
            enableAnalytics: true,
            paymentMethods: ['pix', 'credit', 'debit', 'boleto', 'paypal'],
            shippingProviders: ['correios', 'jadlog', 'total'],
            supportedLanguages: ['pt-BR', 'en-US', 'es-ES'],
            featureFlags: {
                premiumFeatures: true,
                vendorDashboard: true,
                advancedAnalytics: true,
                multiTenant: true
            }
        };

        ConfigManager.instance = this;
        Object.freeze(this);
    }

    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    getConfig(key) {
        return key ? this.config[key] : this.config;
    }

    updateConfig(key, value) {
        if (this.config.hasOwnProperty(key)) {
            this.config[key] = value;
            this.notifyConfigChange(key, value);
        }
    }

    isFeatureEnabled(feature) {
        return this.config.featureFlags[feature] || false;
    }

    getPaymentMethods() {
        return this.config.paymentMethods;
    }

    getShippingProviders() {
        return this.config.shippingProviders;
    }

    notifyConfigChange(key, value) {
        console.log(`Configuration updated: ${key} = ${value}`);
        window.dispatchEvent(new CustomEvent('configChanged', {
            detail: { key, value }
        }));
    }
}

ConfigManager.prototype.constructor = ConfigManager;