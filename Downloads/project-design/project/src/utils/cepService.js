/**
 * Serviço de consulta de CEP
 * Simula uma chamada a uma API de CEP e retorna dados fictícios
 */

/**
 * Inicializa o serviço de CEP
 */
export function initCepService() {
    console.log('Serviço de CEP inicializado');
    // Esta função será chamada pelo main.js
}

/**
 * Consulta um CEP e retorna dados fictícios após um delay
 * @param {string} cep - O CEP a ser consultado (apenas números)
 * @returns {Promise} - Promise que resolve com os dados do endereço
 */
export function consultarCep(cep) {
    return new Promise((resolve) => {
        // Simula um delay de 500ms para a chamada da API
        setTimeout(() => {
            // Dados fictícios baseados no CEP
            const enderecosSimulados = {
                '01001000': {
                    logradouro: 'Praça da Sé',
                    bairro: 'Sé',
                    cidade: 'São Paulo',
                    estado: 'SP'
                },
                '20010000': {
                    logradouro: 'Avenida Rio Branco',
                    bairro: 'Centro',
                    cidade: 'Rio de Janeiro',
                    estado: 'RJ'
                },
                '30130110': {
                    logradouro: 'Avenida Afonso Pena',
                    bairro: 'Centro',
                    cidade: 'Belo Horizonte',
                    estado: 'MG'
                },
                '90010000': {
                    logradouro: 'Rua dos Andradas',
                    bairro: 'Centro Histórico',
                    cidade: 'Porto Alegre',
                    estado: 'RS'
                },
                '80010010': {
                    logradouro: 'Rua XV de Novembro',
                    bairro: 'Centro',
                    cidade: 'Curitiba',
                    estado: 'PR'
                }
            };

            // Verifica se o CEP está na lista de endereços simulados
            if (enderecosSimulados[cep]) {
                resolve({
                    success: true,
                    data: enderecosSimulados[cep]
                });
            } else {
                // Gera um endereço aleatório para CEPs não cadastrados
                const estados = ['SP', 'RJ', 'MG', 'RS', 'PR'];
                const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba'];
                const bairros = ['Centro', 'Jardim Paulista', 'Copacabana', 'Savassi', 'Moinhos de Vento'];
                const logradouros = ['Avenida Principal', 'Rua das Flores', 'Alameda Santos', 'Rua da Praia', 'Avenida Brasil'];
                
                const randomIndex = Math.floor(Math.random() * 5);
                
                resolve({
                    success: true,
                    data: {
                        logradouro: logradouros[randomIndex],
                        bairro: bairros[randomIndex],
                        cidade: cidades[randomIndex],
                        estado: estados[randomIndex]
                    }
                });
            }
        }, 500);
    });
}