export class StorageService {
    constructor(namespace) {
        this.namespace = namespace;
    }

    set(key, value) {
        const storageKey = `${this.namespace}_${key}`;
        localStorage.setItem(storageKey, JSON.stringify(value));
    }

    get(key) {
        const storageKey = `${this.namespace}_${key}`;
        const item = localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : null;
    }

    remove(key) {
        const storageKey = `${this.namespace}_${key}`;
        localStorage.removeItem(storageKey);
    }

    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`${this.namespace}_`)) {
                localStorage.removeItem(key);
            }
        });
    }

    exists(key) {
        const storageKey = `${this.namespace}_${key}`;
        return localStorage.getItem(storageKey) !== null;
    }

    // Utility methods for data validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    isValidZip(zip) {
        const zipRegex = /^\d{5}-?\d{3}$/;
        return zipRegex.test(zip);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
}