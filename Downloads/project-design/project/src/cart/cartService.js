import { StorageService } from '../utils/storage.js';

export class CartService {
    constructor() {
        this.storage = new StorageService('cart');
        this.items = this.storage.get('items') || [];
        
        // Ensure cart starts empty on first visit
        if (!this.storage.exists('initialized')) {
            this.items = [];
            this.storage.set('items', []);
            this.storage.set('initialized', true);
        }
        
        this.appliedCoupon = this.storage.get('appliedCoupon') || null;
    }

    addItem(product, quantity = 1, selectedSize = null) {
        const existingItem = this.items.find(item => 
            item.id === product.id && item.selectedSize === selectedSize
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: parseInt(product.id, 10),
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                selectedSize: selectedSize || product.sizes[0],
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
    }

    removeItem(productId, selectedSize = null) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.selectedSize === selectedSize)
        );
        this.saveCart();
    }

    updateQuantity(productId, quantity, selectedSize = null) {
        const item = this.items.find(item => 
            item.id === productId && item.selectedSize === selectedSize
        );
        
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId, selectedSize);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    increaseQuantity(productId, selectedSize = null) {
        const item = this.items.find(item => 
            item.id === productId && item.selectedSize === selectedSize
        );
        
        if (item) {
            item.quantity += 1;
            this.saveCart();
        }
    }

    decreaseQuantity(productId, selectedSize = null) {
        const item = this.items.find(item => 
            item.id === productId && item.selectedSize === selectedSize
        );
        
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                this.saveCart();
            } else {
                this.removeItem(productId, selectedSize);
            }
        }
    }

    getItems() {
        return this.items;
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 200) return 0; // Free shipping
        return 15.90;
    }

    getDiscount() {
        if (!this.appliedCoupon) return 0;
        
        const subtotal = this.getSubtotal();
        const coupon = this.getCouponByCode(this.appliedCoupon);
        
        if (coupon && this.isCouponValid(coupon)) {
            if (coupon.type === 'percentage') {
                return subtotal * (coupon.value / 100);
            } else {
                return coupon.value;
            }
        }
        
        return 0;
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        const shipping = this.getShipping();
        const discount = this.getDiscount();
        
        return Math.max(0, subtotal + shipping - discount);
    }

    applyCoupon(couponCode) {
        const coupon = this.getCouponByCode(couponCode);
        
        if (coupon && this.isCouponValid(coupon)) {
            this.appliedCoupon = couponCode;
            this.storage.set('appliedCoupon', couponCode);
            return this.getDiscount();
        }
        
        return 0;
    }

    removeCoupon() {
        this.appliedCoupon = null;
        this.storage.remove('appliedCoupon');
    }

    getCouponByCode(code) {
        const coupons = this.getAvailableCoupons();
        return coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    }

    isCouponValid(coupon) {
        const now = new Date();
        const expiryDate = new Date(coupon.expiryDate);
        return now <= expiryDate && coupon.usageCount < coupon.maxUsage;
    }

    getAvailableCoupons() {
        return [
            {
                code: 'WELCOME10',
                type: 'percentage',
                value: 10,
                expiryDate: '2025-12-31',
                maxUsage: 1000,
                usageCount: 0,
                description: '10% de desconto para novos clientes'
            },
            {
                code: 'SAVE20',
                type: 'fixed',
                value: 20,
                expiryDate: '2025-06-30',
                maxUsage: 500,
                usageCount: 0,
                description: 'R$ 20 de desconto'
            },
            {
                code: 'FRETE0',
                type: 'shipping',
                value: 0,
                expiryDate: '2025-03-31',
                maxUsage: 200,
                usageCount: 0,
                description: 'Frete grátis'
            }
        ];
    }

    calculateShipping(zipCode = '', weight = 1) {
        // Simulate shipping calculation with Correios API
        const basePrice = 15.90;
        const weightMultiplier = Math.ceil(weight);
        
        // Simple shipping calculation based on ZIP
        if (zipCode.startsWith('01') || zipCode.startsWith('04')) {
            return basePrice * 0.8; // São Paulo region - discount
        } else if (zipCode.startsWith('2')) {
            return basePrice * 1.2; // Rio de Janeiro
        } else if (zipCode.startsWith('3')) {
            return basePrice * 1.5; // Minas Gerais
        }
        
        return basePrice * weightMultiplier;
    }

    getTotalWeight() {
        // Assume each item weighs 0.5kg on average
        return this.items.reduce((total, item) => total + (item.quantity * 0.5), 0);
    }

    clearCart() {
        this.items = [];
        this.appliedCoupon = null;
        this.storage.clear();
    }

    saveCart() {
        this.storage.set('items', this.items);
    }

    isEmpty() {
        return this.items.length === 0;
    }

    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    }

    getCartValue() {
        return {
            subtotal: this.getSubtotal(),
            shipping: this.getShipping(),
            discount: this.getDiscount(),
            total: this.getTotal(),
            itemCount: this.getItemCount()
        };
    }
}