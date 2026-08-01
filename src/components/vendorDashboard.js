export function renderVendorDashboard(user, vendorStats) {
    return `
        <div class="vendor-dashboard">
            <!-- Vendor Header -->
            <div class="vendor-header">
                <div class="vendor-info">
                    <h2>Painel do Lojista</h2>
                    <p>Bem-vindo, ${user.name}</p>
                    <div class="business-info">
                        <span class="business-name">${user.profile.businessInfo?.companyName || 'Empresa não informada'}</span>
                        ${user.profile.businessInfo?.verified ? '<span class="verified-badge">✓ Verificado</span>' : '<span class="pending-badge">Pendente Verificação</span>'}
                    </div>
                </div>
                <div class="quick-actions">
                    <button class="btn-primary" onclick="showAddProductModal()">+ Novo Produto</button>
                    <button class="btn-secondary" onclick="exportSalesReport()">Exportar Relatório</button>
                </div>
            </div>

            <!-- Vendor Navigation -->
            <div class="vendor-nav">
                <button class="vendor-nav-btn active" data-section="overview">Visão Geral</button>
                <button class="vendor-nav-btn" data-section="products">Meus Produtos</button>
                <button class="vendor-nav-btn" data-section="orders">Pedidos</button>
                <button class="vendor-nav-btn" data-section="customers">Clientes</button>
                <button class="vendor-nav-btn" data-section="analytics">Analytics</button>
                <button class="vendor-nav-btn" data-section="settings">Configurações</button>
            </div>

            <!-- Overview Section -->
            <div class="vendor-section active" id="overview-section">
                <div class="stats-overview">
                    <div class="stat-card revenue">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">R$ ${vendorStats.totalRevenue.toFixed(2)}</div>
                            <div class="stat-label">Receita Total</div>
                            <div class="stat-change positive">+12.5% este mês</div>
                        </div>
                    </div>
                    <div class="stat-card orders">
                        <div class="stat-icon">📦</div>
                        <div class="stat-content">
                            <div class="stat-value">${vendorStats.totalOrders}</div>
                            <div class="stat-label">Pedidos</div>
                            <div class="stat-change positive">+8 novos hoje</div>
                        </div>
                    </div>
                    <div class="stat-card products">
                        <div class="stat-icon">👕</div>
                        <div class="stat-content">
                            <div class="stat-value">${vendorStats.totalProducts}</div>
                            <div class="stat-label">Produtos Ativos</div>
                            <div class="stat-change neutral">${vendorStats.lowStockCount} com estoque baixo</div>
                        </div>
                    </div>
                    <div class="stat-card customers">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <div class="stat-value">${vendorStats.totalCustomers}</div>
                            <div class="stat-label">Clientes</div>
                            <div class="stat-change positive">+3 novos esta semana</div>
                        </div>
                    </div>
                </div>

                <!-- Sales Chart -->
                <div class="chart-section">
                    <h3>Vendas dos Últimos 30 Dias</h3>
                    <div class="sales-chart">
                        <canvas id="salesChart" width="800" height="300"></canvas>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="recent-activity">
                    <h3>Atividade Recente</h3>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon new-order">📦</div>
                            <div class="activity-content">
                                <p><strong>Novo pedido #1234</strong></p>
                                <p>Cliente: Maria Silva - R$ 159,90</p>
                                <span class="activity-time">2 minutos atrás</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon low-stock">⚠️</div>
                            <div class="activity-content">
                                <p><strong>Estoque baixo</strong></p>
                                <p>Vestido Floral - apenas 2 unidades restantes</p>
                                <span class="activity-time">1 hora atrás</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon review">⭐</div>
                            <div class="activity-content">
                                <p><strong>Nova avaliação</strong></p>
                                <p>5 estrelas para "Blusa Casual Moderna"</p>
                                <span class="activity-time">3 horas atrás</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Products Section -->
            <div class="vendor-section" id="products-section">
                <div class="section-header">
                    <h3>Gerenciar Produtos</h3>
                    <div class="product-filters">
                        <select id="product-status-filter">
                            <option value="">Todos os status</option>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="out-of-stock">Sem estoque</option>
                        </select>
                        <input type="text" placeholder="Buscar produtos..." id="product-search">
                    </div>
                </div>
                
                <div class="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>SKU</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Vendidos</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${vendorStats.products.map(product => `
                                <tr>
                                    <td>
                                        <div class="product-cell">
                                            <img src="${product.image}" alt="${product.name}">
                                            <div>
                                                <strong>${product.name}</strong>
                                                <p>${product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${product.sku || 'N/A'}</td>
                                    <td>R$ ${product.price.toFixed(2)}</td>
                                    <td>
                                        <span class="stock-indicator ${product.stock === 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}">
                                            ${product.stock}
                                        </span>
                                    </td>
                                    <td>${product.sold || 0}</td>
                                    <td>
                                        <span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">
                                            ${product.stock > 0 ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-sm btn-secondary" onclick="editProduct('${product.id}')">Editar</button>
                                            <button class="btn-sm btn-secondary" onclick="duplicateProduct('${product.id}')">Duplicar</button>
                                            <button class="btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Excluir</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Orders Section -->
            <div class="vendor-section" id="orders-section">
                <div class="section-header">
                    <h3>Pedidos</h3>
                    <div class="order-filters">
                        <select id="order-status-filter">
                            <option value="">Todos os status</option>
                            <option value="pending">Pendente</option>
                            <option value="processing">Processando</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregue</option>
                        </select>
                        <input type="date" id="order-date-filter">
                    </div>
                </div>
                
                <div class="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${vendorStats.orders.map(order => `
                                <tr>
                                    <td>#${order.id}</td>
                                    <td>
                                        <div class="customer-cell">
                                            <strong>${order.customerData.name}</strong>
                                            <p>${order.customerData.email}</p>
                                        </div>
                                    </td>
                                    <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                                    <td>${order.items.length} item(s)</td>
                                    <td>R$ ${order.total.toFixed(2)}</td>
                                    <td>
                                        <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendente</option>
                                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processando</option>
                                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregue</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button class="btn-sm btn-secondary" onclick="viewOrderDetails('${order.id}')">Ver Detalhes</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <style>
            .vendor-dashboard {
                max-width: 1400px;
                margin: 0 auto;
                padding: 24px;
            }

            .vendor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                padding: 32px;
                border-radius: 12px;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .business-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-top: 8px;
            }

            .verified-badge {
                background: var(--success-500);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .pending-badge {
                background: var(--warning-500);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .quick-actions {
                display: flex;
                gap: 12px;
            }

            .vendor-nav {
                display: flex;
                gap: 8px;
                margin-bottom: 24px;
                background: white;
                padding: 16px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .vendor-nav-btn {
                padding: 12px 24px;
                background: transparent;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .vendor-nav-btn.active {
                background: var(--primary-500);
                color: white;
            }

            .vendor-section {
                display: none;
                background: white;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .vendor-section.active {
                display: block;
            }

            .stats-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .stat-card {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 24px;
                border-radius: 12px;
                border-left: 4px solid var(--primary-500);
            }

            .stat-card.revenue {
                background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                border-left-color: var(--success-500);
            }

            .stat-card.orders {
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border-left-color: var(--warning-500);
            }

            .stat-card.products {
                background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
                border-left-color: var(--secondary-500);
            }

            .stat-card.customers {
                background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                border-left-color: var(--accent-500);
            }

            .stat-icon {
                font-size: 2rem;
            }

            .stat-value {
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--gray-800);
                margin-bottom: 4px;
            }

            .stat-label {
                color: var(--gray-600);
                font-size: 14px;
                margin-bottom: 4px;
            }

            .stat-change {
                font-size: 12px;
                font-weight: 600;
            }

            .stat-change.positive {
                color: var(--success-500);
            }

            .stat-change.negative {
                color: var(--error-500);
            }

            .stat-change.neutral {
                color: var(--warning-500);
            }

            .chart-section {
                margin-bottom: 32px;
            }

            .sales-chart {
                background: var(--gray-50);
                padding: 24px;
                border-radius: 8px;
                text-align: center;
                color: var(--gray-500);
            }

            .recent-activity {
                margin-bottom: 32px;
            }

            .activity-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .activity-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: var(--gray-50);
                border-radius: 8px;
            }

            .activity-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .activity-icon.new-order {
                background: var(--primary-100);
            }

            .activity-icon.low-stock {
                background: var(--warning-100);
            }

            .activity-icon.review {
                background: var(--accent-100);
            }

            .activity-time {
                font-size: 12px;
                color: var(--gray-500);
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }

            .product-filters,
            .order-filters {
                display: flex;
                gap: 12px;
            }

            .product-cell {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .product-cell img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 4px;
            }

            .stock-indicator.out-of-stock {
                color: var(--error-500);
                font-weight: 600;
            }

            .stock-indicator.low-stock {
                color: var(--warning-500);
                font-weight: 600;
            }

            .stock-indicator.in-stock {
                color: var(--success-500);
                font-weight: 600;
            }

            .status-badge.active {
                background: var(--success-100);
                color: var(--success-700);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .status-badge.inactive {
                background: var(--gray-100);
                color: var(--gray-700);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .action-buttons {
                display: flex;
                gap: 8px;
            }

            .btn-danger {
                background: var(--error-500);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }

            .customer-cell strong {
                display: block;
            }

            .customer-cell p {
                font-size: 12px;
                color: var(--gray-500);
                margin: 0;
            }
        </style>

        <script>
            // Vendor dashboard functionality
            document.querySelectorAll('.vendor-nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.vendor-nav-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.vendor-section').forEach(s => s.classList.remove('active'));
                    
                    btn.classList.add('active');
                    document.getElementById(btn.dataset.section + '-section').classList.add('active');
                });
            });

            window.showAddProductModal = () => {
                alert('Abrir modal de adicionar produto');
            };

            window.exportSalesReport = () => {
                alert('Exportando relatório de vendas...');
            };

            window.editProduct = (id) => {
                alert('Editar produto: ' + id);
            };

            window.duplicateProduct = (id) => {
                alert('Duplicar produto: ' + id);
            };

            window.deleteProduct = (id) => {
                if (confirm('Tem certeza que deseja excluir este produto?')) {
                    alert('Produto excluído: ' + id);
                }
            };

            window.updateOrderStatus = (orderId, status) => {
                alert(\`Status do pedido \${orderId} atualizado para: \${status}\`);
            };

            window.viewOrderDetails = (id) => {
                alert('Ver detalhes do pedido: ' + id);
            };
        </script>
    `;
}