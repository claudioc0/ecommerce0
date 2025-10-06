export function renderAuth(type = 'login') {
    return `
        <div class="auth-container">
            <div class="auth-tabs">
                <div class="auth-tab ${type === 'login' ? 'active' : ''}" data-tab="login">Entrar</div>
                <div class="auth-tab ${type === 'register' ? 'active' : ''}" data-tab="register">Cadastrar</div>
            </div>

            <!-- Login Form -->
            <form id="auth-form" class="auth-form ${type === 'login' ? 'active' : ''}" data-type="login">
                <div class="form-group mb-4">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" name="email" required>
                </div>
                
                <div class="form-group mb-4">
                    <label for="login-password">Senha</label>
                    <input type="password" id="login-password" name="password" required>
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%;">Entrar</button>
                
                <div class="auth-social" style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="text-align: center; color: var(--gray-600); font-size: 0.9rem;">Ou continue com</div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button type="button" class="btn-social" data-social-login="google" aria-label="Entrar com Google"
                            style="display: flex; align-items: center; justify-content: center; gap: 8px; background: white; border: 1px solid var(--gray-300); border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600;">
                            <span style="color: #4285F4;">G</span>
                            <span style="color: var(--gray-900);">Entrar com Google</span>
                        </button>
                        <button type="button" class="btn-social" data-social-login="facebook" aria-label="Entrar com Facebook"
                            style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #1877F2; border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; color: white; font-weight: 600;">
                            <span>Entrar com Facebook</span>
                        </button>
                    </div>
                </div>
                
                <div style="margin-top: 16px; padding: 16px; background: var(--gray-50); border-radius: 8px;">
                    <h4 style="margin-bottom: 12px;">Contas de Teste:</h4>
                    <p><strong>Admin:</strong> admin@fashionstore.com / admin123</p>
                    <p><strong>Cliente:</strong> cliente@email.com / cliente123</p>
                </div>
            </form>

            <!-- Register Form -->
            <form id="auth-form" class="auth-form ${type === 'register' ? 'active' : ''}" data-type="register">
                <div class="form-group mb-4">
                    <label for="register-name">Nome Completo</label>
                    <input type="text" id="register-name" name="name" required>
                </div>
                
                <div class="form-group mb-4">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" name="email" required>
                </div>
                
                <div class="form-group mb-4">
                    <label for="register-password">Senha</label>
                    <input type="password" id="register-password" name="password" required minlength="6">
                </div>
                
                <div class="form-group mb-4">
                    <label for="register-user-type">Tipo de Conta</label>
                    <select id="register-user-type" name="userType" required>
                        <option value="customer">Cliente</option>
                        <option value="premium">Cliente Premium</option>
                        <option value="vendor">Lojista</option>
                    </select>
                </div>
                
                <div id="premium-info" class="form-group mb-4" style="display: none; background: var(--primary-50); padding: 16px; border-radius: 8px;">
                    <h4>Benefícios Premium:</h4>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li>Acesso a produtos exclusivos</li>
                        <li>Filtros avançados de busca</li>
                        <li>Lista de desejos ilimitada</li>
                        <li>Suporte prioritário</li>
                        <li>Frete grátis em compras acima de R$ 100</li>
                    </ul>
                    <p><strong>Valor: R$ 29,90/mês</strong></p>
                </div>
                
                <div id="vendor-info" class="form-group mb-4" style="display: none; background: var(--secondary-50); padding: 16px; border-radius: 8px;">
                    <h4>Recursos para Lojistas:</h4>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li>Painel de vendas completo</li>
                        <li>Gestão de estoque avançada</li>
                        <li>Relatórios de vendas</li>
                        <li>Gestão de clientes</li>
                        <li>Comissão de 5% por venda</li>
                    </ul>
                </div>
                
                <div class="form-group mb-4">
                    <label>
                        <input type="checkbox" required>
                        Aceito os <a href="#" style="color: var(--primary-500);">termos de uso</a> e <a href="#" style="color: var(--primary-500);">política de privacidade</a>
                    </label>
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%;">Criar Conta</button>
            </form>
        </div>`;
}