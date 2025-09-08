/**
 * Observer Pattern - Example 2: User Activity Tracking System
 * Tracks user activities and notifies interested components
 */
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

    // Add observer
    addObserver(observer) {
        if (this.isValidObserver(observer)) {
            this.observers.add(observer);
            console.log(`Observer added: ${observer.name || 'Anonymous'}`);
            return true;
        }
        return false;
    }

    // Remove observer
    removeObserver(observer) {
        const removed = this.observers.delete(observer);
        if (removed) {
            console.log(`Observer removed: ${observer.name || 'Anonymous'}`);
        }
        return removed;
    }

    // Validate observer has required methods
    isValidObserver(observer) {
        return observer && typeof observer.onUserActivity === 'function';
    }

    // Notify all observers
    notifyObservers(activity) {
        this.observers.forEach(observer => {
            try {
                observer.onUserActivity(activity);
            } catch (error) {
                console.error(`Error notifying observer ${observer.name}:`, error);
            }
        });
    }

    // Start tracking user activities
    startTracking() {
        if (this.isTracking) {
            return;
        }

        this.isTracking = true;
        this.sessionData.startTime = Date.now();
        
        // Track page views
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Track scrolling
        document.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Track mouse movement
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Track keyboard activity
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Track form interactions
        document.addEventListener('input', this.handleInput.bind(this));
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Track session time
        this.startSessionTimer();
        
        console.log('User activity tracking started');
        
        this.recordActivity('tracking_started', {
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }

    // Stop tracking
    stopTracking() {
        if (!this.isTracking) {
            return;
        }

        this.isTracking = false;
        
        // Remove event listeners
        document.removeEventListener('click', this.handleClick.bind(this));
        document.removeEventListener('scroll', this.handleScroll.bind(this));
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('input', this.handleInput.bind(this));
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Stop session timer
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        console.log('User activity tracking stopped');
        
        this.recordActivity('tracking_stopped', {
            sessionDuration: Date.now() - this.sessionData.startTime,
            totalActivities: this.activities.length
        });
    }

    // Record an activity
    recordActivity(type, data = {}) {
        const activity = {
            id: this.generateActivityId(),
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
        
        // Keep only last 1000 activities
        if (this.activities.length > 1000) {
            this.activities = this.activities.slice(-1000);
        }
        
        // Notify observers
        this.notifyObservers(activity);
        
        return activity;
    }

    // Event handlers
    handleClick(event) {
        this.sessionData.clicks++;
        
        const clickData = {
            element: event.target.tagName,
            className: event.target.className,
            id: event.target.id,
            text: event.target.textContent?.substring(0, 50),
            coordinates: {
                x: event.clientX,
                y: event.clientY
            }
        };
        
        this.recordActivity('click', clickData);
    }

    handleScroll(event) {
        // Throttle scroll events
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
        // Throttle mouse move events heavily
        if (!this.mouseMoveThrottle) {
            this.mouseMoveThrottle = setTimeout(() => {
                const mouseMoveData = {
                    coordinates: {
                        x: event.clientX,
                        y: event.clientY
                    },
                    element: event.target.tagName
                };
                
                this.recordActivity('mouse_move', mouseMoveData);
                this.mouseMoveThrottle = null;
            }, 1000); // Only record every second
        }
    }

    handleKeyDown(event) {
        const keyData = {
            key: event.key,
            code: event.code,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            element: event.target.tagName
        };
        
        this.recordActivity('keydown', keyData);
    }

    handleInput(event) {
        const inputData = {
            element: event.target.tagName,
            type: event.target.type,
            name: event.target.name,
            id: event.target.id,
            valueLength: event.target.value?.length || 0
        };
        
        this.recordActivity('input', inputData);
    }

    handleVisibilityChange() {
        const visibilityData = {
            hidden: document.hidden,
            visibilityState: document.visibilityState
        };
        
        this.recordActivity('visibility_change', visibilityData);
    }

    trackPageView() {
        this.sessionData.pageViews++;
        
        const pageViewData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        this.recordActivity('page_view', pageViewData);
    }

    startSessionTimer() {
        this.sessionTimer = setInterval(() => {
            this.sessionData.timeSpent = Date.now() - this.sessionData.startTime;
        }, 1000);
    }

    // Utility methods
    generateActivityId() {
        return 'activity_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        }
        return this.sessionId;
    }

    // Get analytics data
    getSessionData() {
        return {
            ...this.sessionData,
            timeSpent: Date.now() - this.sessionData.startTime
        };
    }

    getActivities(type = null, limit = 100) {
        let activities = [...this.activities];
        
        if (type) {
            activities = activities.filter(activity => activity.type === type);
        }
        
        return activities.slice(-limit);
    }

    getActivitySummary() {
        const summary = {
            totalActivities: this.activities.length,
            activityTypes: {},
            sessionData: this.getSessionData(),
            observerCount: this.observers.size
        };
        
        this.activities.forEach(activity => {
            if (!summary.activityTypes[activity.type]) {
                summary.activityTypes[activity.type] = 0;
            }
            summary.activityTypes[activity.type]++;
        });
        
        return summary;
    }

    // Export activities
    exportActivities() {
        const exportData = {
            sessionData: this.getSessionData(),
            activities: this.activities,
            summary: this.getActivitySummary(),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-activities-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Example observers
export class AnalyticsObserver {
    constructor(name = 'Analytics') {
        this.name = name;
        this.metrics = {
            pageViews: 0,
            clicks: 0,
            scrolls: 0,
            timeOnPage: 0
        };
    }

    onUserActivity(activity) {
        switch (activity.type) {
            case 'page_view':
                this.metrics.pageViews++;
                console.log(`📊 ${this.name}: Page view recorded`);
                break;
            case 'click':
                this.metrics.clicks++;
                console.log(`📊 ${this.name}: Click recorded on ${activity.data.element}`);
                break;
            case 'scroll':
                this.metrics.scrolls++;
                if (activity.data.scrollPercentage > 75) {
                    console.log(`📊 ${this.name}: Deep scroll detected (${activity.data.scrollPercentage}%)`);
                }
                break;
        }
    }

    getMetrics() {
        return { ...this.metrics };
    }
}

export class SecurityObserver {
    constructor(name = 'Security') {
        this.name = name;
        this.suspiciousActivities = [];
        this.clickThreshold = 100; // clicks per minute
        this.keyThreshold = 200; // keys per minute
    }

    onUserActivity(activity) {
        // Monitor for suspicious rapid clicking
        if (activity.type === 'click') {
            this.checkRapidClicking(activity);
        }
        
        // Monitor for suspicious keyboard activity
        if (activity.type === 'keydown') {
            this.checkRapidTyping(activity);
        }
        
        // Monitor for suspicious navigation patterns
        if (activity.type === 'page_view') {
            this.checkNavigationPattern(activity);
        }
    }

    checkRapidClicking(activity) {
        const recentClicks = this.getRecentActivities('click', 60000); // Last minute
        
        if (recentClicks.length > this.clickThreshold) {
            this.recordSuspiciousActivity('rapid_clicking', {
                clickCount: recentClicks.length,
                timeWindow: '1 minute'
            });
        }
    }

    checkRapidTyping(activity) {
        const recentKeys = this.getRecentActivities('keydown', 60000); // Last minute
        
        if (recentKeys.length > this.keyThreshold) {
            this.recordSuspiciousActivity('rapid_typing', {
                keyCount: recentKeys.length,
                timeWindow: '1 minute'
            });
        }
    }

    checkNavigationPattern(activity) {
        const recentPageViews = this.getRecentActivities('page_view', 30000); // Last 30 seconds
        
        if (recentPageViews.length > 10) {
            this.recordSuspiciousActivity('rapid_navigation', {
                pageViewCount: recentPageViews.length,
                timeWindow: '30 seconds'
            });
        }
    }

    recordSuspiciousActivity(type, data) {
        const suspiciousActivity = {
            type,
            data,
            timestamp: Date.now(),
            id: 'suspicious_' + Date.now()
        };
        
        this.suspiciousActivities.push(suspiciousActivity);
        console.warn(`🔒 ${this.name}: Suspicious activity detected - ${type}`, data);
    }

    getRecentActivities(type, timeWindow) {
        const now = Date.now();
        return this.suspiciousActivities.filter(activity => 
            activity.type === type && (now - activity.timestamp) <= timeWindow
        );
    }

    getSuspiciousActivities() {
        return [...this.suspiciousActivities];
    }
}

// Global activity tracker instance
export const globalActivityTracker = new UserActivityTracker();