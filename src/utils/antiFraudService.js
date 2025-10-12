/**
 * Serviço Anti-Fraude
 * Simula uma análise de risco para transações
 */

export const antiFraudService = {
    /**
     * Analisa os dados do pedido e retorna um score de risco
     * @param {Object} orderData - Dados do pedido a ser analisado
     * @returns {Promise<number>} - Score de risco (0-100)
     */
    analyze(orderData) {
        return new Promise((resolve) => {
            // Simula um tempo de processamento de 1 segundo
            setTimeout(() => {
                // Gera um score de risco aleatório entre 0 e 100
                const riskScore = Math.floor(Math.random() * 101);
                
                console.log(`Anti-Fraude: Pedido ${orderData.id} analisado. Score de risco: ${riskScore}`);
                
                resolve(riskScore);
            }, 1000);
        });
    },
    
    /**
     * Verifica se o score de risco é aceitável
     * @param {number} riskScore - Score de risco
     * @returns {boolean} - true se o risco for aceitável, false caso contrário
     */
    isAcceptable(riskScore) {
        // Define o limite de risco aceitável (scores acima de 80 são considerados de alto risco)
        const RISK_THRESHOLD = 80;
        return riskScore < RISK_THRESHOLD;
    }
};