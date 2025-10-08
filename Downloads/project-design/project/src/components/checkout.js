<<<<<<< HEAD
import { consultarCep } from '../utils/cepService.js';

// Função para consultar CEP e preencher campos de endereço
function initCepListener() {
    const cepInput = document.getElementById('zip');
    if (cepInput) {
        cepInput.addEventListener('blur', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const response = await consultarCep(cep);
                    if (response.success) {
                        const endereco = response.data;
                        document.getElementById('address').value = endereco.logradouro;
                        document.getElementById('neighborhood').value = endereco.bairro;
                        document.getElementById('city').value = endereco.cidade;
                        document.getElementById('state').value = endereco.estado;
                    }
                } catch (error) {
                    console.error('Erro ao consultar CEP:', error);
                }
            }
        });
    }
}

export function renderCheckout(items, total, shipping) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Função para inicializar o event listener do CEP após renderização
    setTimeout(() => {
        initCepListener();
    }, 100);
=======
export function renderCheckout(items, total, shipping) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
>>>>>>> d80d84e05fdcb5b0cda9374dc3ea0d6d8e7b2e8c

    return `
        <div class="checkout-container">
            <form id="checkout-form" class="checkout-form">
                <div class="form-section">
                    <h3>Dados Pessoais</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="name">Nome Completo *</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Telefone</label>
                            <input type="tel" id="phone" name="phone" placeholder="(11) 99999-9999">
                        </div>
                        <div class="form-group">
                            <label for="cpf">CPF</label>
                            <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Endereço de Entrega</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="zip">CEP *</label>
                            <input type="text" id="zip" name="zip" placeholder="00000-000" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Endereço *</label>
                            <input type="text" id="address" name="address" placeholder="Rua, Avenida..." required>
                        </div>
                        <div class="form-group">
                            <label for="number">Número *</label>
                            <input type="text" id="number" name="number" required>
                        </div>
                        <div class="form-group">
                            <label for="complement">Complemento</label>
                            <input type="text" id="complement" name="complement" placeholder="Apt, Bloco...">
                        </div>
                        <div class="form-group">
                            <label for="neighborhood">Bairro *</label>
                            <input type="text" id="neighborhood" name="neighborhood" required>
                        </div>
                        <div class="form-group">
                            <label for="city">Cidade *</label>
                            <input type="text" id="city" name="city" required>
                        </div>
                        <div class="form-group">
                            <label for="state">Estado *</label>
                            <select id="state" name="state" required>
                                <option value="">Selecionar estado</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="PR">Paraná</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Cupom de Desconto</h3>
                    <div class="coupon-section">
                        <div class="coupon-input">
                            <input type="text" id="coupon-code" placeholder="Digite seu cupom">
                            <button type="button" id="apply-coupon-btn" class="btn-secondary">Aplicar</button>
                        </div>
                        <small style="color: var(--gray-500); margin-top: 8px; display: block;">
                            Cupons disponíveis: WELCOME10, SAVE20, FRETE0
                        </small>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Forma de Pagamento</h3>
                    <div class="payment-methods">
                        <div class="payment-option" data-method="pix">
                            <h4>PIX</h4>
                            <p>Instantâneo e sem taxas</p>
                        </div>
                        <div class="payment-option" data-method="credit">
                            <h4>Cartão de Crédito</h4>
                            <p>Até 12x sem juros</p>
                        </div>
                        <div class="payment-option" data-method="debit">
                            <h4>Cartão de Débito</h4>
                            <p>Débito à vista</p>
                        </div>
                        <div class="payment-option" data-method="boleto">
                            <h4>Boleto</h4>
                            <p>Vencimento em 3 dias</p>
                        </div>
                        <div class="payment-option" data-method="paypal">
                            <h4>PayPal</h4>
                            <p>Pagamento seguro</p>
                        </div>
                    </div>
                </div>

                <div class="cart-summary">
                    <h3>Resumo do Pedido</h3>
                    <div class="summary-row">
                        <span>Subtotal (${items.reduce((sum, item) => sum + item.quantity, 0)} itens):</span>
                        <span>R$ ${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Frete:</span>
                        <span>${shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>R$ ${total.toFixed(2)}</span>
                    </div>
                    
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 24px; padding: 16px;">
                        Finalizar Pedido
                    </button>
                </div>
            </form>

            <div style="margin-top: 32px; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h3>Itens do Pedido</h3>
                ${items.map(item => `
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--gray-200);">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                        <div style="flex: 1;">
                            <h4>${item.name}</h4>
                            <p style="color: var(--gray-600);">Quantidade: ${item.quantity}</p>
                            ${item.selectedSize ? `<p style="color: var(--gray-600);">Tamanho: ${item.selectedSize}</p>` : ''}
                        </div>
                        <div style="text-align: right;">
                            <p style="font-weight: 600;">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}