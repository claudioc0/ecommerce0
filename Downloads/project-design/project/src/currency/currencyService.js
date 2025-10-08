/**
 * Serviço de Taxas de Câmbio
 * Simula a busca de taxas de câmbio para diferentes moedas
 */

import { StorageService } from '../utils/storage.js';
import { globalEventManager } from '../patterns/observer/EventManager.js';

class CurrencyService {
    constructor() {
        this.storage = new StorageService('currency');
        this.currentCurrency = this.storage.get('currentCurrency') || 'BRL';
        this.rates = {
            'BRL': 1.0,
            'USD': 5.2,
            'EUR': 5.5
        };
    }

    /**
     * Obtém a lista de moedas disponíveis
     * @returns {Array} - Lista de códigos de moedas disponíveis
     */
    getAvailableCurrencies() {
        return Object.keys(this.rates);
    }

    /**
     * Obtém a moeda atual selecionada
     * @returns {string} - Código da moeda atual
     */
    getCurrentCurrency() {
        return this.currentCurrency;
    }

    /**
     * Define a moeda atual
     * @param {string} currencyCode - Código da moeda (BRL, USD, EUR)
     */
    setCurrentCurrency(currencyCode) {
        if (this.rates[currencyCode]) {
            this.currentCurrency = currencyCode;
            this.storage.set('currentCurrency', currencyCode);
            globalEventManager.publish('currency_changed', { currency: currencyCode });
            return true;
        }
        return false;
    }

    /**
     * Obtém a taxa de câmbio para uma moeda específica
     * @param {string} currencyCode - Código da moeda
     * @returns {number} - Taxa de câmbio em relação ao BRL
     */
    getExchangeRate(currencyCode = null) {
        const currency = currencyCode || this.currentCurrency;
        return this.rates[currency] || 1.0;
    }

    /**
     * Converte um valor de BRL para a moeda atual ou especificada
     * @param {number} valueInBRL - Valor em BRL
     * @param {string} toCurrency - Moeda de destino (opcional)
     * @returns {number} - Valor convertido
     */
    convertFromBRL(valueInBRL, toCurrency = null) {
        const currency = toCurrency || this.currentCurrency;
        if (currency === 'BRL') return valueInBRL;
        
        return valueInBRL / this.rates[currency];
    }

    /**
     * Formata um valor para exibição de acordo com a moeda
     * @param {number} value - Valor a ser formatado
     * @param {string} currencyCode - Código da moeda (opcional)
     * @returns {string} - Valor formatado com símbolo da moeda
     */
    formatCurrency(value, currencyCode = null) {
        const currency = currencyCode || this.currentCurrency;
        
        const symbols = {
            'BRL': 'R$',
            'USD': '$',
            'EUR': '€'
        };
        
        const formatter = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return `${symbols[currency]} ${formatter.format(value)}`;
    }
}

// Exporta uma instância única do serviço
export const currencyService = new CurrencyService();