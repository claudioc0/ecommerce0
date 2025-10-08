import { StorageService } from '../utils/storage.js';

export class AdminService {
    constructor() {
        this.storage = new StorageService('admin');
    }

    getStats() {
        const products = new StorageService('products').get('products') || [];
        const orders = this.getOrders();
        const users = new StorageService('auth').get('users') || [];
        
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalCustomers = users.filter(u => !u.isAdmin).length;
        
        // Monthly stats
        const currentMonth = new Date().getMonth();
        const monthlyOrders = orders.filter(order => 
            new Date(order.date).getMonth() === currentMonth
        );
        const monthlySales = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
        
        // Best selling products
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
            });
        });
        
        const bestSellers = Object.entries(productSales)
            .map(([id, quantity]) => {
                const product = products.find(p => p.id === id);
                return { product, quantity };
            })
            .filter(item => item.product)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
        
        return {
            totalSales,
            totalOrders,
            totalProducts,
            totalCustomers,
            monthlySales,
            monthlyOrders: monthlyOrders.length,
            bestSellers,
            lowStock: products.filter(p => p.stock < 5),
            recentOrders: orders.slice(0, 10).sort((a, b) => new Date(b.date) - new Date(a.date))
        };
    }

    getOrders() {
        return this.storage.get('orders') || [];
    }

    getUserOrders(userId = null) {
        const orders = this.getOrders();
        if (userId) {
            return orders.filter(order => order.customerId === userId);
        }
        return orders;
    }

    addOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: orderData.id || Date.now().toString(),
            customerId: orderData.customerId || 'guest',
            items: orderData.items,
            total: orderData.total,
            shipping: orderData.shipping,
            discount: orderData.discount,
            customerData: orderData.customerData,
            status: orderData.status || 'pending',
            date: orderData.date || new Date().toISOString(),
            trackingCode: this.generateTrackingCode(),
            estimatedDelivery: this.calculateEstimatedDelivery()
        };
        
        orders.push(newOrder);
        this.storage.set('orders', orders);
        
        return newOrder;
    }

    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            
            // Add status history
            if (!order.statusHistory) {
                order.statusHistory = [];
            }
            order.statusHistory.push({
                status,
                date: new Date().toISOString(),
                description: this.getStatusDescription(status)
            });
            
            this.storage.set('orders', orders);
            
            // Simulate email notification
            this.sendStatusNotification(order);
            
            return order;
        }
        
        return null;
    }

    getStatusDescription(status) {
        const descriptions = {
            'pending': 'Pedido recebido e aguardando processamento',
            'processing': 'Pedido em preparação',
            'shipped': 'Pedido enviado para entrega',
            'delivered': 'Pedido entregue com sucesso',
            'cancelled': 'Pedido cancelado'
        };
        
        return descriptions[status] || 'Status atualizado';
    }

    sendStatusNotification(order) {
        console.log(`📧 Email enviado para ${order.customerData.email}: Pedido #${order.id} - ${this.getStatusDescription(order.status)}`);
    }

    generateTrackingCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        
        let code = '';
        for (let i = 0; i < 2; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
        for (let i = 0; i < 9; i++) {
            code += numbers[Math.floor(Math.random() * numbers.length)];
        }
        code += 'BR';
        
        return code;
    }

    calculateEstimatedDelivery() {
        const today = new Date();
        const deliveryDays = Math.floor(Math.random() * 7) + 3; // 3-10 business days
        const estimatedDate = new Date(today);
        estimatedDate.setDate(today.getDate() + deliveryDays);
        
        return estimatedDate.toISOString();
    }

    getOrderById(orderId) {
        const orders = this.getOrders();
        return orders.find(o => o.id === orderId);
    }

    deleteOrder(orderId) {
        const orders = this.getOrders();
        const filteredOrders = orders.filter(o => o.id !== orderId);
        this.storage.set('orders', filteredOrders);
        return true;
    }

    getSalesData(period = 'month') {
        const orders = this.getOrders();
        const now = new Date();
        
        let startDate;
        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(0);
        }
        
        const filteredOrders = orders.filter(order => 
            new Date(order.date) >= startDate
        );
        
        return {
            totalSales: filteredOrders.reduce((sum, order) => sum + order.total, 0),
            orderCount: filteredOrders.length,
            averageOrderValue: filteredOrders.length > 0 
                ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length 
                : 0
        };
    }

    getInventoryAlerts() {
        const products = new StorageService('products').get('products') || [];
        
        return {
            outOfStock: products.filter(p => p.stock === 0),
            lowStock: products.filter(p => p.stock > 0 && p.stock < 5),
            excessStock: products.filter(p => p.stock > 100)
        };
    }

    exportData(type) {
        let data;
        let filename;
        
        switch (type) {
            case 'orders':
                data = this.getOrders();
                filename = 'orders-export.json';
                break;
            case 'products':
                data = new StorageService('products').get('products') || [];
                filename = 'products-export.json';
                break;
            case 'customers':
                data = new StorageService('auth').get('users')?.filter(u => !u.isAdmin) || [];
                filename = 'customers-export.json';
                break;
            default:
                return;
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    saveCart() {
        this.storage.set('items', this.items);
    }
}