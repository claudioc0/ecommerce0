/**
 * Observer Pattern - Example 1: Event Management System
 * Allows objects to subscribe and be notified of events
 */
export class EventManager {
    constructor() {
        this.listeners = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 1000;
    }

    subscribe(eventType, callback, options = {}) {
        const { once = false, priority = 0, context = null } = options;
        
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        
        const listener = {
            id: this.generateListenerId(),
            callback,
            once,
            priority,
            context,
            subscribedAt: new Date().toISOString()
        };
        
        const listeners = this.listeners.get(eventType);
        listeners.push(listener);
        
        listeners.sort((a, b) => b.priority - a.priority);
        
        console.log(`Subscribed to event: ${eventType} (ID: ${listener.id})`);
        
        return () => this.unsubscribe(eventType, listener.id);
    }

    unsubscribe(eventType, listenerId) {
        if (!this.listeners.has(eventType)) {
            return false;
        }
        
        const listeners = this.listeners.get(eventType);
        const index = listeners.findIndex(listener => listener.id === listenerId);
        
        if (index !== -1) {
            listeners.splice(index, 1);
            console.log(`Unsubscribed from event: ${eventType} (ID: ${listenerId})`);
            
            if (listeners.length === 0) {
                this.listeners.delete(eventType);
            }
            
            return true;
        }
        
        return false;
    }

    publish(eventType, data = null, options = {}) {
        const { async = false, timeout = 5000 } = options;
        
        const event = {
            type: eventType,
            data,
            timestamp: new Date().toISOString(),
            id: this.generateEventId()
        };
        
        this.addToHistory(event);
        
        if (!this.listeners.has(eventType)) {
            console.log(`No listeners for event: ${eventType}`);
            return Promise.resolve([]);
        }
        
        const listeners = [...this.listeners.get(eventType)];
        console.log(`Publishing event: ${eventType} to ${listeners.length} listeners`);
        
        if (async) {
            return this.publishAsync(event, listeners, timeout);
        } else {
            return this.publishSync(event, listeners);
        }
    }

    publishSync(event, listeners) {
        const results = [];
        const listenersToRemove = [];
        
        listeners.forEach(listener => {
            try {
                const result = listener.context ? 
                    listener.callback.call(listener.context, event) :
                    listener.callback(event);
                
                results.push({
                    listenerId: listener.id,
                    success: true,
                    result
                });
                
                if (listener.once) {
                    listenersToRemove.push(listener.id);
                }
            } catch (error) {
                console.error(`Error in event listener ${listener.id}:`, error);
                results.push({
                    listenerId: listener.id,
                    success: false,
                    error: error.message
                });
            }
        });
        
        listenersToRemove.forEach(id => {
            this.unsubscribe(event.type, id);
        });
        
        return Promise.resolve(results);
    }

    async publishAsync(event, listeners, timeout) {
        const results = [];
        const listenersToRemove = [];
        
        const promises = listeners.map(async (listener) => {
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Listener timeout')), timeout);
                });
                
                const listenerPromise = Promise.resolve(
                    listener.context ? 
                        listener.callback.call(listener.context, event) :
                        listener.callback(event)
                );
                
                const result = await Promise.race([listenerPromise, timeoutPromise]);
                
                if (listener.once) {
                    listenersToRemove.push(listener.id);
                }
                
                return {
                    listenerId: listener.id,
                    success: true,
                    result
                };
            } catch (error) {
                console.error(`Error in async event listener ${listener.id}:`, error);
                return {
                    listenerId: listener.id,
                    success: false,
                    error: error.message
                };
            }
        });
        
        const results_array = await Promise.allSettled(promises);
        results_array.forEach(result => {
            if (result.status === 'fulfilled') {
                results.push(result.value);
            } else {
                results.push({
                    listenerId: 'unknown',
                    success: false,
                    error: result.reason.message
                });
            }
        });
        
        listenersToRemove.forEach(id => {
            this.unsubscribe(event.type, id);
        });
        
        return results;
    }

    getListeners(eventType) {
        return this.listeners.get(eventType) || [];
    }

    getEventTypes() {
        return Array.from(this.listeners.keys());
    }

    clear() {
        this.listeners.clear();
        console.log('All event listeners cleared');
    }

    getEventHistory(eventType = null, limit = 100) {
        let history = [...this.eventHistory];
        
        if (eventType) {
            history = history.filter(event => event.type === eventType);
        }
        
        return history.slice(-limit);
    }

    addToHistory(event) {
        this.eventHistory.push(event);
        
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
        }
    }

    generateListenerId() {
        return 'listener_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    getDebugInfo() {
        const info = {
            totalEventTypes: this.listeners.size,
            totalListeners: 0,
            eventTypes: {},
            historySize: this.eventHistory.length
        };
        
        this.listeners.forEach((listeners, eventType) => {
            info.totalListeners += listeners.length;
            info.eventTypes[eventType] = {
                listenerCount: listeners.length,
                listeners: listeners.map(l => ({
                    id: l.id,
                    priority: l.priority,
                    once: l.once,
                    subscribedAt: l.subscribedAt
                }))
            };
        });
        
        return info;
    }
}

export const globalEventManager = new EventManager();