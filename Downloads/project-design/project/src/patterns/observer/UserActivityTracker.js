// UserActivityTracker.js

export class UserActivityTracker {
    constructor() {
        this.observers = new Set();
        this.activities = [];
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            clicks: 0,
            scrolls: 0,
            timeSpent: 0
        };
        this.isTracking = false;
    }

    addObserver(observer) {
        if (observer && typeof observer.onUserActivity === 'function') {
            this.observers.add(observer);
            console.log(`Observer added: ${observer.name || 'Anonymous'}`);
            return true;
        }
        return false;
    }

    notifyObservers(activity) {
        this.observers.forEach(observer => {
            try {
                observer.onUserActivity(activity);
            } catch (error) {
                console.error(`Error notifying observer ${observer.name}:`, error);
            }
        });
    }

    startTracking() {
        if (this.isTracking) return;
        this.isTracking = true;
        this.sessionData.startTime = Date.now();

        this.trackPageView();

        // Escuta clicks em todo o documento
        document.addEventListener('click', (event) => {
            // Se for o carrinho
            const cartButton = event.target.closest('.cart-badge, .cart-icon');
            if (cartButton) {
                console.log('🛒 Cart clicked!');
                // Chamamos a função de abrir o carrinho do app, se existir
                if (typeof window.openCart === 'function') {
                    window.openCart();
                }

                // Registramos no tracker
                this.recordActivity('cart_opened', { timestamp: Date.now() });
            }

            // Outras atividades de clique
            this.handleClick(event);
        });

        document.addEventListener('scroll', this.handleScroll.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('input', this.handleInput.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        this.startSessionTimer();

        console.log('User activity tracking started');
        this.recordActivity('tracking_started', {
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: { width: window.innerWidth, height: window.innerHeight }
        });
    }

    recordActivity(type, data = {}) {
        const activity = {
            id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
            type,
            timestamp: Date.now(),
            data: {
                ...data,
                sessionId: this.getSessionId(),
                url: window.location.href,
                referrer: document.referrer
            }
        };

        this.activities.push(activity);
        if (this.activities.length > 1000) this.activities = this.activities.slice(-1000);

        this.notifyObservers(activity);
        return activity;
    }

    handleClick(event) {
        this.sessionData.clicks++;

        const target = event.target;

        let className = null;
        if (target.className) {
            if (typeof target.className === 'string') className = target.className;
            else if (target.className.baseVal) className = target.className.baseVal;
        }

        const clickData = {
            elementTag: target.tagName,
            id: target.id || null,
            className: className || null,
            text: target.textContent?.substring(0, 50) || null,
            coordinates: { x: event.clientX, y: event.clientY }
        };

        this.recordActivity('click', clickData);
    }

    handleScroll() {
        if (!this.scrollThrottle) {
            this.scrollThrottle = setTimeout(() => {
                this.sessionData.scrolls++;
                const scrollData = {
                    scrollY: window.scrollY,
                    scrollX: window.scrollX,
                    documentHeight: document.documentElement.scrollHeight,
                    viewportHeight: window.innerHeight,
                    scrollPercentage: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
                };
                this.recordActivity('scroll', scrollData);
                this.scrollThrottle = null;
            }, 100);
        }
    }

    handleMouseMove(event) {
        if (!this.mouseMoveThrottle) {
            this.mouseMoveThrottle = setTimeout(() => {
                this.recordActivity('mouse_move', {
                    coordinates: { x: event.clientX, y: event.clientY },
                    elementTag: event.target.tagName
                });
                this.mouseMoveThrottle = null;
            }, 1000);
        }
    }

    handleKeyDown(event) {
        this.recordActivity('keydown', {
            key: event.key,
            code: event.code,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            elementTag: event.target.tagName
        });
    }

    handleInput(event) {
        this.recordActivity('input', {
            elementTag: event.target.tagName,
            type: event.target.type,
            name: event.target.name,
            id: event.target.id,
            valueLength: event.target.value?.length || 0
        });
    }

    handleVisibilityChange() {
        this.recordActivity('visibility_change', {
            hidden: document.hidden,
            visibilityState: document.visibilityState
        });
    }

    trackPageView() {
        this.sessionData.pageViews++;
        this.recordActivity('page_view', {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            viewport: { width: window.innerWidth, height: window.innerHeight }
        });
    }

    startSessionTimer() {
        this.sessionTimer = setInterval(() => {
            this.sessionData.timeSpent = Date.now() - this.sessionData.startTime;
        }, 1000);
    }

    getSessionId() {
        if (!this.sessionId) this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        return this.sessionId;
    }
}

// Observer seguro
export class AnalyticsObserver {
    constructor(name = 'Analytics') {
        this.name = name;
        this.metrics = { pageViews: 0, clicks: 0, scrolls: 0, timeOnPage: 0 };
    }

    onUserActivity(activity) {
        switch (activity.type) {
            case 'page_view':
                this.metrics.pageViews++;
                console.log(`📊 ${this.name}: Page view recorded`);
                break;
            case 'click':
                this.metrics.clicks++;
                console.log(`📊 ${this.name}: Click recorded on ${activity.data.elementTag}#${activity.data.id || ''}.${activity.data.className || ''}`);
                break;
            case 'scroll':
                this.metrics.scrolls++;
                if (activity.data.scrollPercentage > 75)
                    console.log(`📊 ${this.name}: Deep scroll detected (${activity.data.scrollPercentage}%)`);
                break;
            case 'cart_opened':
                console.log(`📊 ${this.name}: Cart opened`);
                break;
        }
    }
}

export const globalActivityTracker = new UserActivityTracker();
