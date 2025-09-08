/**
 * Template Method Pattern - Example 2: Payment Processing
 * Defines the skeleton of payment processing algorithm
 */
export class PaymentProcessor {
    // Template method - defines the payment processing flow
    processPayment(paymentData) {
        console.log('Starting payment processing...');
        
        try {
            this.validatePaymentData(paymentData);
            const processedData = this.preprocessPaymentData(paymentData);
            const authResult = this.authenticatePayment(processedData);
            
            if (authResult.success) {
                const chargeResult = this.chargePayment(processedData, authResult);
                const finalResult = this.postProcessPayment(chargeResult, processedData);
                
                console.log('Payment processing completed successfully');
                return finalResult;
            } else {
                throw new Error(authResult.error || 'Payment authentication failed');
            }
        } catch (error) {
            console.error('Payment processing failed:', error);
            return this.handlePaymentError(error, paymentData);
        }
    }

    // Common validation method
    validatePaymentData(data) {
        if (!data.amount || data.amount <= 0) {
            throw new Error('Invalid payment amount');
        }
        if (!data.currency) {
            throw new Error('Currency is required');
        }
        if (!data.customerId) {
            throw new Error('Customer ID is required');
        }
    }

    // Abstract methods to be implemented by subclasses
    preprocessPaymentData(data) {
        throw new Error('preprocessPaymentData method must be implemented by subclass');
    }

    authenticatePayment(data) {
        throw new Error('authenticatePayment method must be implemented by subclass');
    }

    chargePayment(data, authResult) {
        throw new Error('chargePayment method must be implemented by subclass');
    }

    // Hook methods - can be overridden by subclasses
    postProcessPayment(chargeResult, paymentData) {
        return {
            ...chargeResult,
            processedAt: new Date().toISOString(),
            processor: this.constructor.name
        };
    }

    handlePaymentError(error, paymentData) {
        return {
            success: false,
            error: error.message,
            errorCode: this.getErrorCode(error),
            paymentMethod: this.getPaymentMethod(),
            timestamp: new Date().toISOString()
        };
    }

    getErrorCode(error) {
        // Map common errors to codes
        const errorMap = {
            'Invalid payment amount': 'INVALID_AMOUNT',
            'Currency is required': 'MISSING_CURRENCY',
            'Customer ID is required': 'MISSING_CUSTOMER',
            'Insufficient funds': 'INSUFFICIENT_FUNDS',
            'Card expired': 'CARD_EXPIRED',
            'Invalid card': 'INVALID_CARD'
        };
        
        return errorMap[error.message] || 'UNKNOWN_ERROR';
    }

    getPaymentMethod() {
        return 'generic';
    }
}

// Concrete implementation 1: Credit Card Processor
export class CreditCardProcessor extends PaymentProcessor {
    preprocessPaymentData(data) {
        return {
            ...data,
            cardNumber: this.maskCardNumber(data.cardNumber),
            expiryDate: this.validateExpiryDate(data.expiryDate),
            cvv: data.cvv ? '***' : null, // Mask CVV for security
            amount: Math.round(data.amount * 100), // Convert to cents
            originalCardNumber: data.cardNumber // Keep for processing (in real app, this would be tokenized)
        };
    }

    maskCardNumber(cardNumber) {
        if (!cardNumber) return null;
        const cleaned = cardNumber.replace(/\D/g, '');
        return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4');
    }

    validateExpiryDate(expiryDate) {
        if (!expiryDate) throw new Error('Expiry date is required');
        
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        
        if (expiry < now) {
            throw new Error('Card expired');
        }
        
        return expiryDate;
    }

    authenticatePayment(data) {
        // Simulate credit card authentication
        const cardNumber = data.originalCardNumber.replace(/\D/g, '');
        
        // Basic card validation (Luhn algorithm simulation)
        if (!this.isValidCardNumber(cardNumber)) {
            return { success: false, error: 'Invalid card number' };
        }
        
        // Simulate 3D Secure or other authentication
        return {
            success: true,
            authCode: this.generateAuthCode(),
            transactionId: this.generateTransactionId(),
            cardType: this.getCardType(cardNumber)
        };
    }

    isValidCardNumber(cardNumber) {
        // Simplified Luhn algorithm check
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    getCardType(cardNumber) {
        const firstDigit = cardNumber[0];
        const firstTwoDigits = cardNumber.substring(0, 2);
        
        if (firstDigit === '4') return 'Visa';
        if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
        if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
        
        return 'Unknown';
    }

    chargePayment(data, authResult) {
        // Simulate payment charging
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
            return {
                success: true,
                transactionId: authResult.transactionId,
                authCode: authResult.authCode,
                amount: data.amount,
                currency: data.currency,
                cardType: authResult.cardType,
                last4: data.originalCardNumber.slice(-4)
            };
        } else {
            throw new Error('Payment declined by issuer');
        }
    }

    generateAuthCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    generateTransactionId() {
        return 'CC_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    getPaymentMethod() {
        return 'credit_card';
    }
}

// Concrete implementation 2: PIX Processor
export class PIXProcessor extends PaymentProcessor {
    preprocessPaymentData(data) {
        return {
            ...data,
            pixKey: this.validatePixKey(data.pixKey),
            amount: parseFloat(data.amount),
            description: data.description || 'Pagamento FashionStore'
        };
    }

    validatePixKey(pixKey) {
        if (!pixKey) throw new Error('PIX key is required');
        
        // Validate different PIX key types
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+55\d{10,11}$/;
        const cpfRegex = /^\d{11}$/;
        const cnpjRegex = /^\d{14}$/;
        
        if (emailRegex.test(pixKey) || phoneRegex.test(pixKey) || 
            cpfRegex.test(pixKey) || cnpjRegex.test(pixKey)) {
            return pixKey;
        }
        
        throw new Error('Invalid PIX key format');
    }

    authenticatePayment(data) {
        // PIX authentication is typically instant
        return {
            success: true,
            pixCode: this.generatePixCode(),
            qrCode: this.generateQRCode(data),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        };
    }

    chargePayment(data, authResult) {
        // Simulate PIX payment processing
        // In real implementation, this would wait for payment confirmation
        return {
            success: true,
            pixTransactionId: this.generatePixTransactionId(),
            pixCode: authResult.pixCode,
            qrCode: authResult.qrCode,
            amount: data.amount,
            currency: data.currency,
            status: 'pending', // PIX payments start as pending
            expiresAt: authResult.expiresAt
        };
    }

    generatePixCode() {
        // Generate a PIX payment code
        return '00020126' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    generateQRCode(data) {
        // In real implementation, this would generate actual QR code
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="white"/>
                <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">
                    PIX QR Code
                </text>
                <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="10">
                    R$ ${data.amount.toFixed(2)}
                </text>
            </svg>
        `)}`;
    }

    generatePixTransactionId() {
        return 'PIX_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    postProcessPayment(chargeResult, paymentData) {
        const result = super.postProcessPayment(chargeResult, paymentData);
        
        // Add PIX-specific post-processing
        result.paymentInstructions = {
            message: 'Escaneie o código QR ou copie o código PIX para efetuar o pagamento',
            pixCode: chargeResult.pixCode,
            qrCode: chargeResult.qrCode,
            expiresAt: chargeResult.expiresAt
        };
        
        return result;
    }

    getPaymentMethod() {
        return 'pix';
    }
}