/**
 * Template Method Pattern - Example 3: Notification System
 * Defines the skeleton of notification sending algorithm
 */
export class NotificationSender {
    // Template method - defines the notification sending flow
    sendNotification(recipient, message, options = {}) {
        console.log('Starting notification sending process...');
        
        try {
            this.validateRecipient(recipient);
            this.validateMessage(message);
            
            const processedMessage = this.preprocessMessage(message, options);
            const formattedMessage = this.formatMessage(processedMessage, recipient, options);
            
            const deliveryResult = this.deliverMessage(recipient, formattedMessage, options);
            const finalResult = this.postProcessDelivery(deliveryResult, recipient, options);
            
            console.log('Notification sent successfully');
            return finalResult;
        } catch (error) {
            console.error('Notification sending failed:', error);
            return this.handleDeliveryError(error, recipient, message);
        }
    }

    // Common validation methods
    validateRecipient(recipient) {
        if (!recipient) {
            throw new Error('Recipient is required');
        }
    }

    validateMessage(message) {
        if (!message || !message.subject || !message.content) {
            throw new Error('Message must have subject and content');
        }
    }

    // Abstract methods to be implemented by subclasses
    preprocessMessage(message, options) {
        throw new Error('preprocessMessage method must be implemented by subclass');
    }

    formatMessage(message, recipient, options) {
        throw new Error('formatMessage method must be implemented by subclass');
    }

    deliverMessage(recipient, message, options) {
        throw new Error('deliverMessage method must be implemented by subclass');
    }

    // Hook methods - can be overridden by subclasses
    postProcessDelivery(deliveryResult, recipient, options) {
        return {
            ...deliveryResult,
            sentAt: new Date().toISOString(),
            sender: this.constructor.name,
            recipient: this.maskRecipientInfo(recipient)
        };
    }

    handleDeliveryError(error, recipient, message) {
        return {
            success: false,
            error: error.message,
            errorCode: this.getErrorCode(error),
            notificationType: this.getNotificationType(),
            timestamp: new Date().toISOString()
        };
    }

    maskRecipientInfo(recipient) {
        // Mask sensitive recipient information
        if (recipient.email) {
            const [local, domain] = recipient.email.split('@');
            return {
                ...recipient,
                email: local.substring(0, 2) + '***@' + domain
            };
        }
        return recipient;
    }

    getErrorCode(error) {
        const errorMap = {
            'Recipient is required': 'MISSING_RECIPIENT',
            'Message must have subject and content': 'INVALID_MESSAGE',
            'Invalid email address': 'INVALID_EMAIL',
            'Phone number is required': 'MISSING_PHONE',
            'Message too long': 'MESSAGE_TOO_LONG'
        };
        
        return errorMap[error.message] || 'UNKNOWN_ERROR';
    }

    getNotificationType() {
        return 'generic';
    }
}

// Concrete implementation 1: Email Notification
export class EmailNotificationSender extends NotificationSender {
    validateRecipient(recipient) {
        super.validateRecipient(recipient);
        
        if (!recipient.email) {
            throw new Error('Email address is required');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipient.email)) {
            throw new Error('Invalid email address');
        }
    }

    preprocessMessage(message, options) {
        const { template = 'default', variables = {} } = options;
        
        let processedContent = message.content;
        
        // Replace template variables
        Object.keys(variables).forEach(key => {
            const placeholder = `{{${key}}}`;
            processedContent = processedContent.replace(new RegExp(placeholder, 'g'), variables[key]);
        });
        
        return {
            ...message,
            content: processedContent,
            template,
            variables
        };
    }

    formatMessage(message, recipient, options) {
        const { priority = 'normal', attachments = [] } = options;
        
        // Create HTML email format
        const htmlContent = this.createHTMLEmail(message, recipient, options);
        
        return {
            to: recipient.email,
            subject: message.subject,
            htmlContent,
            textContent: this.stripHTML(message.content),
            priority,
            attachments,
            headers: {
                'X-Mailer': 'FashionStore-Mailer',
                'X-Priority': this.getPriorityHeader(priority)
            }
        };
    }

    createHTMLEmail(message, recipient, options) {
        const { template = 'default' } = options;
        
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${message.subject}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>FashionStore</h1>
                </div>
                <div class="content">
                    <h2>${message.subject}</h2>
                    <p>Olá ${recipient.name || 'Cliente'},</p>
                    ${message.content}
                </div>
                <div class="footer">
                    <p>© 2024 FashionStore. Todos os direitos reservados.</p>
                    <p>Este é um email automático, não responda.</p>
                </div>
            </div>
        </body>
        </html>`;
        
        return html;
    }

    stripHTML(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    getPriorityHeader(priority) {
        const priorityMap = {
            'high': '1',
            'normal': '3',
            'low': '5'
        };
        return priorityMap[priority] || '3';
    }

    deliverMessage(recipient, message, options) {
        // Simulate email delivery
        console.log(`Sending email to: ${message.to}`);
        console.log(`Subject: ${message.subject}`);
        
        // Simulate delivery delay
        const deliveryTime = Math.random() * 2000 + 500; // 0.5-2.5 seconds
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.05; // 95% success rate
                
                if (success) {
                    resolve({
                        success: true,
                        messageId: this.generateMessageId(),
                        deliveryTime: deliveryTime,
                        status: 'delivered'
                    });
                } else {
                    throw new Error('Email delivery failed');
                }
            }, deliveryTime);
        });
    }

    generateMessageId() {
        return 'EMAIL_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    getNotificationType() {
        return 'email';
    }
}

// Concrete implementation 2: SMS Notification
export class SMSNotificationSender extends NotificationSender {
    validateRecipient(recipient) {
        super.validateRecipient(recipient);
        
        if (!recipient.phone) {
            throw new Error('Phone number is required');
        }
        
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(recipient.phone)) {
            throw new Error('Invalid phone number format');
        }
    }

    validateMessage(message) {
        super.validateMessage(message);
        
        if (message.content.length > 160) {
            throw new Error('SMS message too long (max 160 characters)');
        }
    }

    preprocessMessage(message, options) {
        const { shortUrl = false } = options;
        
        let content = message.content;
        
        // Shorten URLs if requested
        if (shortUrl) {
            content = this.shortenUrls(content);
        }
        
        // Ensure message fits in SMS limit
        if (content.length > 160) {
            content = content.substring(0, 157) + '...';
        }
        
        return {
            ...message,
            content,
            characterCount: content.length
        };
    }

    shortenUrls(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            // Simulate URL shortening
            return 'https://short.ly/' + Math.random().toString(36).substring(2, 8);
        });
    }

    formatMessage(message, recipient, options) {
        const { sender = 'FashionStore' } = options;
        
        return {
            to: this.formatPhoneNumber(recipient.phone),
            from: sender,
            body: message.content,
            characterCount: message.characterCount
        };
    }

    formatPhoneNumber(phone) {
        // Remove all non-digit characters and add country code if missing
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
            return '+55' + cleaned.substring(1);
        } else if (cleaned.length === 10) {
            return '+55' + cleaned;
        } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
            return '+' + cleaned;
        }
        
        return phone; // Return as-is if format is unclear
    }

    deliverMessage(recipient, message, options) {
        // Simulate SMS delivery
        console.log(`Sending SMS to: ${message.to}`);
        console.log(`Message: ${message.body}`);
        
        const deliveryTime = Math.random() * 1000 + 200; // 0.2-1.2 seconds
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.02; // 98% success rate
                
                if (success) {
                    resolve({
                        success: true,
                        messageId: this.generateMessageId(),
                        deliveryTime: deliveryTime,
                        status: 'delivered',
                        cost: this.calculateSMSCost(message.characterCount)
                    });
                } else {
                    throw new Error('SMS delivery failed');
                }
            }, deliveryTime);
        });
    }

    calculateSMSCost(characterCount) {
        // Simulate SMS cost calculation (in cents)
        const baseCost = 5; // 5 cents per SMS
        const segments = Math.ceil(characterCount / 160);
        return baseCost * segments;
    }

    generateMessageId() {
        return 'SMS_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    getNotificationType() {
        return 'sms';
    }
}

// Concrete implementation 3: Push Notification
export class PushNotificationSender extends NotificationSender {
    validateRecipient(recipient) {
        super.validateRecipient(recipient);
        
        if (!recipient.deviceToken) {
            throw new Error('Device token is required for push notifications');
        }
    }

    preprocessMessage(message, options) {
        const { badge = 1, sound = 'default', category = 'general' } = options;
        
        // Truncate title and content for push notifications
        const title = message.subject.length > 50 ? 
            message.subject.substring(0, 47) + '...' : message.subject;
        
        const content = message.content.length > 100 ? 
            message.content.substring(0, 97) + '...' : message.content;
        
        return {
            ...message,
            subject: title,
            content,
            badge,
            sound,
            category
        };
    }

    formatMessage(message, recipient, options) {
        const { deepLink, imageUrl, actions = [] } = options;
        
        return {
            to: recipient.deviceToken,
            notification: {
                title: message.subject,
                body: message.content,
                sound: message.sound,
                badge: message.badge,
                image: imageUrl
            },
            data: {
                category: message.category,
                deepLink: deepLink,
                timestamp: Date.now().toString(),
                customData: options.customData || {}
            },
            actions: actions
        };
    }

    deliverMessage(recipient, message, options) {
        // Simulate push notification delivery
        console.log(`Sending push notification to device: ${message.to.substring(0, 10)}...`);
        console.log(`Title: ${message.notification.title}`);
        console.log(`Body: ${message.notification.body}`);
        
        const deliveryTime = Math.random() * 500 + 100; // 0.1-0.6 seconds
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.03; // 97% success rate
                
                if (success) {
                    resolve({
                        success: true,
                        messageId: this.generateMessageId(),
                        deliveryTime: deliveryTime,
                        status: 'delivered',
                        platform: this.detectPlatform(recipient.deviceToken)
                    });
                } else {
                    throw new Error('Push notification delivery failed');
                }
            }, deliveryTime);
        });
    }

    detectPlatform(deviceToken) {
        // Simple platform detection based on token format
        if (deviceToken.length === 64) {
            return 'iOS';
        } else if (deviceToken.startsWith('f') || deviceToken.startsWith('c')) {
            return 'Android';
        }
        return 'Unknown';
    }

    generateMessageId() {
        return 'PUSH_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    getNotificationType() {
        return 'push';
    }
}