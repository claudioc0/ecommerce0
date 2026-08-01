/**
 * Singleton Pattern - Example 2: Application Logger
 * Centralized logging system with single instance
 */
export class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        this.logs = [];
        this.logLevel = 'INFO';
        this.maxLogs = 1000;
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };

        Logger.instance = this;
        Object.freeze(this);
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLogLevel(level) {
        if (this.logLevels.hasOwnProperty(level)) {
            this.logLevel = level;
        }
    }

    log(level, message, data = null) {
        if (this.logLevels[level] <= this.logLevels[this.logLevel]) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                level,
                message,
                data,
                id: Date.now() + Math.random()
            };

            this.logs.push(logEntry);
            
            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(-this.maxLogs);
            }

            this.outputToConsole(logEntry);
            
            this.persistLogs();
        }
    }

    error(message, data = null) {
        this.log('ERROR', message, data);
    }

    warn(message, data = null) {
        this.log('WARN', message, data);
    }

    info(message, data = null) {
        this.log('INFO', message, data);
    }

    debug(message, data = null) {
        this.log('DEBUG', message, data);
    }

    outputToConsole(logEntry) {
        const styles = {
            ERROR: 'color: #ef4444; font-weight: bold;',
            WARN: 'color: #f59e0b; font-weight: bold;',
            INFO: 'color: #2563eb;',
            DEBUG: 'color: #6b7280;'
        };

        console.log(
            `%c[${logEntry.level}] ${logEntry.timestamp} - ${logEntry.message}`,
            styles[logEntry.level],
            logEntry.data || ''
        );
    }

    getLogs(level = null) {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return [...this.logs];
    }

    clearLogs() {
        this.logs = [];
        localStorage.removeItem('fashionstore_logs');
    }

    persistLogs() {
        try {
            localStorage.setItem('fashionstore_logs', JSON.stringify(this.logs.slice(-100)));
        } catch (e) {
            console.warn('Could not persist logs to localStorage');
        }
    }

    loadPersistedLogs() {
        try {
            const persistedLogs = localStorage.getItem('fashionstore_logs');
            if (persistedLogs) {
                this.logs = JSON.parse(persistedLogs);
            }
        } catch (e) {
            console.warn('Could not load persisted logs');
        }
    }

    exportLogs() {
        const logsData = JSON.stringify(this.logs, null, 2);
        const blob = new Blob([logsData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `fashionstore-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}