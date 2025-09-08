export function renderProfile(user, orders) {
    if (!user) {
        return `
            <div class="text-center">
                <p>Você precisa estar logado para ver seu perfil.</p>
                <button class="btn-primary mt-4" data-auth="login">Fazer Login</button>
            </div>
        `;
    }

    return `
        <div class="profile-container">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                <!-- Profile Information -->
                <div class="admin-section">
                    <h3>Informações Pessoais</h3>
                    <form id="profile-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="profile-name">Nome</label>
                                <input type="text" id="profile-name" name="name" value="${user.name}">
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" name="email" value="${user.email}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="profile-phone">Telefone</label>
                                <input type="tel" id="profile-phone" name="phone" value="${user.profile?.phone || ''}" placeholder="(11) 99999-9999">
                            </div>
                            <div class="form-group">
                                <label for="profile-address">Endereço</label>
                                <input type="text" id="profile-address" name="address" value="${user.profile?.address || ''}">
                            </div>
                            <div class="form-group">
                                <label for="profile-city">Cidade</label>
                                <input type="text" id="profile-city" name="city" value="${user.profile?.city || ''}">
                            </div>
                            <div class="form-group">
                                <label for="profile-zip">CEP</label>
                                <input type="text" id="profile-zip" name="zip" value="${user.profile?.zip || ''}" placeholder="00000-000">
                            </div>
                        </div>
                        <button type="submit" class="btn-primary mt-4">Atualizar Perfil</button>
                    </form>
                </div>

                <!-- Account Settings -->
                <div class="admin-section">
                    <h3>Configurações da Conta</h3>
                    <div class="form-group mb-4">
                        <label for="theme-select">Tema</label>
                        <select id="theme-select" name="theme">
                            <option value="light" ${user.profile?.preferences?.theme === 'light' ? 'selected' : ''}>Claro</option>
                            <option value="dark" ${user.profile?.preferences?.theme === 'dark' ? 'selected' : ''}>Escuro</option>
                            <option value="auto" ${user.profile?.preferences?.theme === 'auto' ? 'selected' : ''}>Automático</option>
                        </select>
                    </div>
                    
                    <div class="form-group mb-4">
                        <label>
                            <input type="checkbox" ${user.profile?.preferences?.notifications ? 'checked' : ''}>
                            Receber notificações por email
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <button type="button" class="btn-secondary" onclick="showChangePasswordForm()">
                            Alterar Senha
                        </button>
                    </div>
                </div>
            </div>

            <!-- Order History -->
            <div class="admin-section">
                <h3>Histórico de Pedidos</h3>
                ${orders && orders.length > 0 ? `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Pedido</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr>
                                        <td>#${order.id}</td>
                                        <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <span style="color: ${getStatusColor(order.status)}">
                                                ${getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>R$ ${order.total.toFixed(2)}</td>
                                        <td>
                                            <button class="btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div class="empty-state">
                        <h4>Nenhum pedido encontrado</h4>
                        <p>Quando você fizer uma compra, seu histórico aparecerá aqui.</p>
                        <button class="btn-primary mt-4" data-view="catalog">Explorar Produtos</button>
                    </div>
                `}
            </div>
        </div>

        <script>
            function getStatusColor(status) {
                const colors = {
                    'pending': 'var(--warning-500)',
                    'processing': 'var(--primary-500)',
                    'shipped': 'var(--secondary-500)',
                    'delivered': 'var(--success-500)',
                    'cancelled': 'var(--error-500)'
                };
                return colors[status] || 'var(--gray-500)';
            }
            
            function getStatusText(status) {
                const texts = {
                    'pending': 'Pendente',
                    'processing': 'Processando',
                    'shipped': 'Enviado',
                    'delivered': 'Entregue',
                    'cancelled': 'Cancelado'
                };
                return texts[status] || 'Desconhecido';
            }
            
            window.showChangePasswordForm = () => {
                console.log('Show change password form');
                // Implementation for password change
            };
        </script>
    `;
}