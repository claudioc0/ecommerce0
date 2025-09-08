export function renderAdmin(stats, products, orders) {
    return `
        <div class="admin-nav">
            <button class="admin-nav-btn active" data-section="dashboard">Dashboard</button>
            <button class="admin-nav-btn" data-section="products">Produtos</button>
            <button class="admin-nav-btn" data-section="orders">Pedidos</button>
            <button class="admin-nav-btn" data-section="customers">Clientes</button>
            <button class="admin-nav-btn" data-section="settings">Configurações</button>
        </div>

        <div class="admin-dashboard">
            <!-- Stats Overview -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">R$ ${stats.totalSales.toFixed(2)}</div>
                    <div class="stat-label">Vendas Totais</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalOrders}</div>
                    <div class="stat-label">Pedidos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalProducts}</div>
                    <div class="stat-label">Produtos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalCustomers}</div>
                    <div class="stat-label">Clientes</div>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="admin-section">
                <h3>Pedidos Recentes</h3>
                ${stats.recentOrders.length > 0 ? `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID do Pedido</th>
                                    <th>Cliente</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.recentOrders.map(order => `
                                    <tr>
                                        <td>#${order.id}</td>
                                        <td>${order.customerData.name}</td>
                                        <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <select class="status-select" data-order-id="${order.id}">
                                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendente</option>
                                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processando</option>
                                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregue</option>
                                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                                            </select>
                                        </td>
                                        <td>R$ ${order.total.toFixed(2)}</td>
                                        <td>
                                            <button class="btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">Ver</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <p style="text-align: center; color: var(--gray-500); padding: 32px;">
                        Nenhum pedido encontrado
                    </p>
                `}
            </div>

            <!-- Product Management -->
            <div class="admin-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h3>Gerenciar Produtos</h3>
                    <button class="btn-primary" onclick="showAddProductForm()">Adicionar Produto</button>
                </div>
                
                <!-- Add Product Form (Initially Hidden) -->
                <div id="add-product-form" style="display: none; background: var(--gray-50); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                    <form id="product-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="product-name">Nome do Produto *</label>
                                <input type="text" id="product-name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="product-category">Categoria *</label>
                                <select id="product-category" name="category" required>
                                    <option value="">Selecionar categoria</option>
                                    <option value="Vestidos">Vestidos</option>
                                    <option value="Blusas">Blusas</option>
                                    <option value="Calças">Calças</option>
                                    <option value="Jaquetas">Jaquetas</option>
                                    <option value="Saias">Saias</option>
                                    <option value="Camisas">Camisas</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="product-price">Preço *</label>
                                <input type="number" id="product-price" name="price" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="product-stock">Estoque *</label>
                                <input type="number" id="product-stock" name="stock" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="product-condition">Condição *</label>
                                <select id="product-condition" name="condition" required>
                                    <option value="Novo">Novo</option>
                                    <option value="Seminovo">Seminovo</option>
                                    <option value="Usado">Usado</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="product-image">URL da Imagem *</label>
                                <input type="url" id="product-image" name="image" required>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="product-description">Descrição *</label>
                                <textarea id="product-description" name="description" rows="3" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="product-sizes">Tamanhos (separados por vírgula)</label>
                                <input type="text" id="product-sizes" name="sizes" placeholder="P, M, G">
                            </div>
                            <div class="form-group">
                                <label for="product-colors">Cores (separadas por vírgula)</label>
                                <input type="text" id="product-colors" name="colors" placeholder="Preto, Branco, Azul">
                            </div>
                        </div>
                        <div style="display: flex; gap: 16px; margin-top: 24px;">
                            <button type="submit" class="btn-primary">Salvar Produto</button>
                            <button type="button" class="btn-secondary" onclick="hideAddProductForm()">Cancelar</button>
                        </div>
                    </form>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Vendidos</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(product => `
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                                            <span>${product.name}</span>
                                        </div>
                                    </td>
                                    <td>${product.category}</td>
                                    <td>R$ ${product.price.toFixed(2)}</td>
                                    <td>
                                        <span style="color: ${product.stock === 0 ? 'var(--error-500)' : product.stock < 5 ? 'var(--warning-500)' : 'var(--success-500)'}">
                                            ${product.stock}
                                        </span>
                                    </td>
                                    <td>${product.sold || 0}</td>
                                    <td>
                                        <span style="color: ${product.stock > 0 ? 'var(--success-500)' : 'var(--error-500)'}">
                                            ${product.stock > 0 ? 'Disponível' : 'Esgotado'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px;">
                                            <button class="btn-secondary btn-sm" onclick="editProduct('${product.id}')">Editar</button>
                                            <button class="btn-secondary btn-sm" onclick="deleteProduct('${product.id}')" style="color: var(--error-500);">Excluir</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Low Stock Alerts -->
            ${stats.lowStock.length > 0 ? `
                <div class="admin-section">
                    <h3 style="color: var(--warning-500);">⚠️ Produtos com Estoque Baixo</h3>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Estoque Atual</th>
                                    <th>Ação Recomendada</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.lowStock.map(product => `
                                    <tr>
                                        <td>${product.name}</td>
                                        <td>${product.category}</td>
                                        <td style="color: var(--warning-500); font-weight: 600;">${product.stock}</td>
                                        <td>
                                            <button class="btn-secondary btn-sm" onclick="restockProduct('${product.id}')">Repor Estoque</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}

            <!-- Best Sellers -->
            <div class="admin-section">
                <h3>Produtos Mais Vendidos</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade Vendida</th>
                                <th>Receita Gerada</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.bestSellers.map(item => `
                                <tr>
                                    <td>${item.product.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>R$ ${(item.product.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <script>
            window.showAddProductForm = () => {
                document.getElementById('add-product-form').style.display = 'block';
            };
            
            window.hideAddProductForm = () => {
                document.getElementById('add-product-form').style.display = 'none';
                document.getElementById('product-form').reset();
            };
            
            window.editProduct = (id) => {
                console.log('Edit product:', id);
                // Implementation for editing products
            };
            
            window.deleteProduct = (id) => {
                if (confirm('Tem certeza que deseja excluir este produto?')) {
                    console.log('Delete product:', id);
                    // Implementation for deleting products
                }
            };
            
            window.viewOrderDetails = (id) => {
                console.log('View order details:', id);
                // Implementation for viewing order details
            };
            
            window.restockProduct = (id) => {
                const quantity = prompt('Quantidade para adicionar ao estoque:');
                if (quantity && !isNaN(quantity)) {
                    console.log('Restock product:', id, 'quantity:', quantity);
                    // Implementation for restocking
                }
            };
        </script>
    `;
}