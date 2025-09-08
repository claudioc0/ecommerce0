/**
 * Observer Pattern - Example 3: Notification Center
 * Manages application-wide notifications and alerts
 */
export class NotificationCenter {
    constructor() {
        this.subscribers = new Map();
        this.notifications = [];
        this.maxNotifications = 100;
        this.defaultDuration = 5000; // 5 seconds
    }

    // Subscribe to notification types
    subscribe(notificationType, callback, options = {}) {
        const { priority = 0, filter = null, context = null } = options;
        
        if (!this.subscribers.has(notificationType)) {
            this.subscribers.set(notificationType, []);
        }
        
        const subscriber = {
            id: this.generateSubscriberId(),
            callback,
            priority,
            filter,
            context,
            subscribedAt: Date.now()
        };
        
        const subscribers = this.subscribers.get(notificationType);
        subscribers.push(subscriber);
        
        // Sort by priority (higher first)
        subscribers.sort((a, b) => b.priority - a.priority);
        
        console.log(`Subscribed to notifications: ${notificationType}`);
        
        // Return unsubscribe function
        return () => this.unsubscribe(notificationType, subscriber.id);
    }

    // Unsubscribe from notifications
    unsubscribe(notificationType, subscriberId) {
        if (!this.subscribers.has(notificationType)) {
            return false;
        }
        
        const subscribers = this.subscribers.get(notificationType);
        const index = subscribers.findIndex(sub => sub.id === subscriberId);
        
        if (index !== -1) {
            subscribers.splice(index, 1);
            
            if (subscribers.length === 0) {
                this.subscribers.delete(notificationType);
            }
            
            return true;
        }
        
        return false;
    }

    // Post a notification
    post(notificationType, data = {}, options = {}) {
        const {
            title = 'Notification',
            message = '',
            duration = this.defaultDuration,
            persistent = false,
            actions = [],
            icon = null,
            priority = 'normal'
        } = options;
        
        const notification = {
            id: this.generateNotificationId(),
            type: notificationType,
            title,
            message,
            data,
            duration,
            persistent,
            actions,
            icon,
            priority,
            timestamp: Date.now(),
            read: false,
            dismissed: false
        };
        
        // Add to notifications list
        this.addNotification(notification);
        
        // Notify subscribers
        this.notifySubscribers(notification);
        
        // Auto-dismiss if not persistent
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.dismiss(notification.id);
            }, duration);
        }
        
        return notification.id;
    }

    // Add notification to list
    addNotification(notification) {
        this.notifications.unshift(notification);
        
        // Keep only the most recent notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }
    }

    // Notify subscribers
    notifySubscribers(notification) {
        const subscribers = this.subscribers.get(notification.type) || [];
        const allSubscribers = this.subscribers.get('*') || []; // Wildcard subscribers
        
        const allRelevantSubscribers = [...subscribers, ...allSubscribers];
        
        allRelevantSubscribers.forEach(subscriber => {
            try {
                // Apply filter if present
                if (subscriber.filter && !subscriber.filter(notification)) {
                    return;
                }
                
                // Call subscriber callback
                if (subscriber.context) {
                    subscriber.callback.call(subscriber.context, notification);
                } else {
                    subscriber.callback(notification);
                }
            } catch (error) {
                console.error(`Error notifying subscriber ${subscriber.id}:`, error);
            }
        });
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            return true;
        }
        return false;
    }

    // Dismiss notification
    dismiss(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.dismissed = true;
            
            // Notify subscribers about dismissal
            this.notifySubscribers({
                ...notification,
                type: 'notification_dismissed',
                originalType: notification.type
            });
            
            return true;
        }
        return false;
    }

    // Clear all notifications
    clear() {
        this.notifications.forEach(notification => {
            if (!notification.dismissed) {
                notification.dismissed = true;
            }
        });
        
        this.notifications = [];
        
        // Notify about clear action
        this.post('notifications_cleared', {
            clearedAt: Date.now()
        });
    }

    // Get notifications
    getNotifications(options = {}) {
        const {
            type = null,
            unreadOnly = false,
            undismissedOnly = true,
            limit = null
        } = options;
        
        let filtered = [...this.notifications];
        
        if (type) {
            filtered = filtered.filter(n => n.type === type);
        }
        
        if (unreadOnly) {
            filtered = filtered.filter(n => !n.read);
        }
        
        if (undismissedOnly) {
            filtered = filtered.filter(n => !n.dismissed);
        }
        
        if (limit) {
            filtered = filtered.slice(0, limit);
        }
        
        return filtered;
    }

    // Get notification counts
    getCounts() {
        const total = this.notifications.length;
        const unread = this.notifications.filter(n => !n.read && !n.dismissed).length;
        const dismissed = this.notifications.filter(n => n.dismissed).length;
        
        return { total, unread, dismissed };
    }

    // Utility methods
    generateSubscriberId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    // Predefined notification types
    success(title, message, options = {}) {
        return this.post('success', {}, {
            title,
            message,
            icon: '✅',
            priority: 'normal',
            duration: 3000,
            ...options
        });
    }

    error(title, message, options = {}) {
        return this.post('error', {}, {
            title,
            message,
            icon: '❌',
            priority: 'high',
            persistent: true,
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.post('warning', {}, {
            title,
            message,
            icon: '⚠️',
            priority: 'medium',
            duration: 4000,
            ...options
        });
    }

    info(title, message, options = {}) {
        return this.post('info', {}, {
            title,
            message,
            icon: 'ℹ️',
            priority: 'low',
            duration: 3000,
            ...options
        });
    }

    // System notifications
    orderPlaced(orderData) {
        return this.post('order_placed', orderData, {
            title: 'Pedido Realizado',
            message: `Seu pedido #${orderData.id} foi realizado com sucesso!`,
            icon: '🛍️',
            persistent: true,
            actions: [
                { label: 'Ver Pedido', action: 'view_order' },
                { label: 'Continuar Comprando', action: 'continue_shopping' }
            ]
        });
    }

    orderStatusChanged(orderData) {
        const statusMessages = {
            'processing': 'Seu pedido está sendo preparado',
            'shipped': 'Seu pedido foi enviado',
            'delivered': 'Seu pedido foi entregue',
            'cancelled': 'Seu pedido foi cancelado'
        };
        
        return this.post('order_status_changed', orderData, {
            title: 'Status do Pedido Atualizado',
            message: statusMessages[orderData.status] || 'Status do pedido foi atualizado',
            icon: '📦',
            actions: [
                { label: 'Rastrear Pedido', action: 'track_order' }
            ]
        });
    }

    lowStock(productData) {
        return this.post('low_stock', productData, {
            title: 'Estoque Baixo',
            message: `${productData.name} está com estoque baixo (${productData.stock} unidades)`,
            icon: '📉',
            priority: 'medium',
            actions: [
                { label: 'Repor Estoque', action: 'restock_product' }
            ]
        });
    }

    newMessage(messageData) {
        return this.post('new_message', messageData, {
            title: 'Nova Mensagem',
            message: `Mensagem de ${messageData.sender}`,
            icon: '💬',
            actions: [
                { label: 'Ler Mensagem', action: 'read_message' },
                { label: 'Responder', action: 'reply_message' }
            ]
        });
    }
}

// Notification display component
export class NotificationDisplay {
    constructor(notificationCenter, containerId = 'notification-container') {
        this.notificationCenter = notificationCenter;
        this.containerId = containerId;
        this.container = null;
        this.displayedNotifications = new Map();
        
        this.init();
    }

    init() {
        // Create container if it doesn't exist
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.containerId;
            this.container.className = 'notification-display-container';
            document.body.appendChild(this.container);
        }
        
        // Subscribe to all notifications
        this.unsubscribe = this.notificationCenter.subscribe('*', (notification) => {
            this.displayNotification(notification);
        });
        
        // Add styles
        this.addStyles();
    }

    displayNotification(notification) {
        if (notification.type === 'notification_dismissed') {
            this.removeNotificationElement(notification.originalType, notification.id);
            return;
        }
        
        const element = this.createNotificationElement(notification);
        this.container.appendChild(element);
        
        this.displayedNotifications.set(notification.id, element);
        
        // Animate in
        setTimeout(() => {
            element.classList.add('show');
        }, 10);
        
        // Auto-remove if not persistent
        if (!notification.persistent && notification.duration > 0) {
            setTimeout(() => {
                this.removeNotificationElement(notification.type, notification.id);
            }, notification.duration);
        }
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type} priority-${notification.priority}`;
        element.dataset.notificationId = notification.id;
        
        element.innerHTML = `
            <div class="notification-content">
                ${notification.icon ? `<div class="notification-icon">${notification.icon}</div>` : ''}
                <div class="notification-text">
                    <div class="notification-title">${notification.title}</div>
                    ${notification.message ? `<div class="notification-message">${notification.message}</div>` : ''}
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            ${notification.actions.length > 0 ? `
                <div class="notification-actions">
                    ${notification.actions.map(action => `
                        <button class="notification-action" data-action="${action.action}">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        // Add action listeners
        notification.actions.forEach(action => {
            const button = element.querySelector(`[data-action="${action.action}"]`);
            if (button) {
                button.addEventListener('click', () => {
                    this.handleAction(action.action, notification);
                });
            }
        });
        
        // Add close listener
        const closeButton = element.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.notificationCenter.dismiss(notification.id);
        });
        
        return element;
    }

    removeNotificationElement(type, id) {
        const element = this.displayedNotifications.get(id);
        if (element) {
            element.classList.add('hide');
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.displayedNotifications.delete(id);
            }, 300);
        }
    }

    handleAction(actionType, notification) {
        console.log(`Handling action: ${actionType}`, notification);
        
        // Emit custom event for action handling
        window.dispatchEvent(new CustomEvent('notificationAction', {
            detail: { actionType, notification }
        }));
        
        // Dismiss notification after action
        this.notificationCenter.dismiss(notification.id);
    }

    addStyles() {
        if (document.getElementById('notification-display-styles')) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = 'notification-display-styles';
        styles.textContent = `
            .notification-display-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                pointer-events: none;
            }
            
            .notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                margin-bottom: 12px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                pointer-events: auto;
                border-left: 4px solid #2563eb;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification.hide {
                opacity: 0;
                transform: translateX(100%);
            }
            
            .notification-success { border-left-color: #10b981; }
            .notification-error { border-left-color: #ef4444; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-info { border-left-color: #2563eb; }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                margin-bottom: 4px;
                color: #1f2937;
            }
            
            .notification-message {
                font-size: 14px;
                color: #6b7280;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #9ca3af;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                color: #6b7280;
            }
            
            .notification-actions {
                padding: 0 16px 16px;
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }
            
            .notification-action {
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .notification-action:hover {
                background: #e5e7eb;
                border-color: #9ca3af;
            }
            
            .priority-high {
                border-left-width: 6px;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 480px) {
                .notification-display-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Global notification center instance
export const globalNotificationCenter = new NotificationCenter();