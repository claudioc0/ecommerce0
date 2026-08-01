import { StorageService } from '../utils/storage.js';

export class AuthService {
    constructor() {
        this.storage = new StorageService('auth');
        this.currentUser = this.storage.get('currentUser');
    }

    register(userData) {
        // Get existing users
        const users = this.storage.get('users') || [];
        
        // Check if user already exists
        if (users.find(user => user.email === userData.email)) {
            return null;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            name: userData.name,
            role: userData.role || 'customer', // customer, premium, vendor, admin, super_admin
            isAdmin: userData.role === 'admin' || userData.role === 'super_admin',
            isPremium: userData.role === 'premium',
            isVendor: userData.role === 'vendor',
            createdAt: new Date().toISOString(),
            subscription: {
                type: userData.role === 'premium' ? 'premium' : 'basic',
                expiresAt: userData.role === 'premium' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
                features: this.getSubscriptionFeatures(userData.role)
            },
            profile: {
                phone: '',
                address: '',
                city: '',
                zip: '',
                businessInfo: userData.role === 'vendor' ? {
                    companyName: '',
                    cnpj: '',
                    businessType: '',
                    verified: false
                } : null,
                preferences: {
                    theme: 'light',
                    notifications: true,
                    language: 'pt-BR',
                    currency: 'BRL'
                }
            }
        };
        
        // Save user
        users.push(newUser);
        this.storage.set('users', users);
        
        // Auto login
        this.currentUser = newUser;
        this.storage.set('currentUser', newUser);
        
        return newUser;
    }

    login(email, password) {
        const users = this.storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.storage.set('currentUser', user);
            
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.storage.set('users', users);
            
            return user;
        }
        
        return null;
    }

    logout() {
        this.currentUser = null;
        this.storage.remove('currentUser');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateProfile(profileData) {
        if (!this.currentUser) return false;
        
        // Update current user
        Object.assign(this.currentUser.profile, profileData);
        this.storage.set('currentUser', this.currentUser);
        
        // Update in users array
        const users = this.storage.get('users') || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            this.storage.set('users', users);
        }
        
        return true;
    }

    getSubscriptionFeatures(role) {
        const features = {
            customer: ['basic_catalog', 'cart', 'orders'],
            premium: ['basic_catalog', 'cart', 'orders', 'wishlist', 'priority_support', 'exclusive_products', 'advanced_filters'],
            vendor: ['product_management', 'inventory', 'sales_analytics', 'customer_management'],
            admin: ['user_management', 'system_settings', 'reports', 'content_management'],
            super_admin: ['all_features', 'system_administration', 'security_management']
        };
        return features[role] || features.customer;
    }

    hasFeature(feature) {
        if (!this.currentUser) return false;
        return this.currentUser.subscription.features.includes(feature) || 
               this.currentUser.subscription.features.includes('all_features');
    }

    getUserRole() {
        return this.currentUser?.role || 'guest';
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    isAdmin() {
        return this.currentUser?.isAdmin || false;
    }

    changePassword(currentPassword, newPassword) {
        if (!this.currentUser || this.currentUser.password !== currentPassword) {
            return false;
        }
        
        this.currentUser.password = newPassword;
        this.storage.set('currentUser', this.currentUser);
        
        // Update in users array
        const users = this.storage.get('users') || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            this.storage.set('users', users);
        }
        
        return true;
    }

    // Initialize demo users
    initializeDemoData() {
        const existingUsers = this.storage.get('users');
        if (!existingUsers || existingUsers.length === 0) {
            const demoUsers = [
                {
                    id: 'admin-1',
                    email: 'admin@fashionstore.com',
                    password: 'admin123',
                    name: 'Administrador',
                    role: 'super_admin',
                    isAdmin: true,
                    subscription: {
                        type: 'admin',
                        features: ['all_features']
                    },
                    createdAt: new Date().toISOString(),
                    profile: {
                        phone: '(11) 99999-9999',
                        address: 'Rua das Flores, 123',
                        city: 'São Paulo',
                        zip: '01234-567',
                        preferences: {
                            theme: 'light',
                            notifications: true
                        }
                    }
                },
                {
                    id: 'customer-1',
                    email: 'cliente@email.com',
                    password: 'cliente123',
                    name: 'João Silva',
                    role: 'customer',
                    isAdmin: false,
                    subscription: {
                        type: 'basic',
                        features: ['basic_catalog', 'cart', 'orders']
                    },
                    createdAt: new Date().toISOString(),
                    profile: {
                        phone: '(11) 88888-8888',
                        address: 'Av. Principal, 456',
                        city: 'Rio de Janeiro',
                        zip: '20000-000',
                        preferences: {
                            theme: 'light',
                            notifications: true
                        }
                    }
                },
                {
                    id: 'premium-1',
                    email: 'premium@email.com',
                    password: 'premium123',
                    name: 'Maria Premium',
                    role: 'premium',
                    isAdmin: false,
                    isPremium: true,
                    subscription: {
                        type: 'premium',
                        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                        features: ['basic_catalog', 'cart', 'orders', 'wishlist', 'priority_support', 'exclusive_products', 'advanced_filters']
                    },
                    createdAt: new Date().toISOString(),
                    profile: {
                        phone: '(11) 77777-7777',
                        address: 'Rua Premium, 789',
                        city: 'São Paulo',
                        zip: '01234-567',
                        preferences: {
                            theme: 'dark',
                            notifications: true,
                            language: 'pt-BR'
                        }
                    }
                },
                {
                    id: 'vendor-1',
                    email: 'lojista@email.com',
                    password: 'lojista123',
                    name: 'Carlos Vendedor',
                    role: 'vendor',
                    isAdmin: false,
                    isVendor: true,
                    subscription: {
                        type: 'vendor',
                        features: ['product_management', 'inventory', 'sales_analytics', 'customer_management']
                    },
                    createdAt: new Date().toISOString(),
                    profile: {
                        phone: '(11) 66666-6666',
                        address: 'Av. Comercial, 456',
                        city: 'Rio de Janeiro',
                        zip: '20000-000',
                        businessInfo: {
                            companyName: 'Moda & Estilo Ltda',
                            cnpj: '12.345.678/0001-90',
                            businessType: 'Varejo de Moda',
                            verified: true
                        },
                        preferences: {
                            theme: 'light',
                            notifications: true,
                            language: 'pt-BR'
                        }
                    }
                }
            ];
            
            this.storage.set('users', demoUsers);
        }
    }
}