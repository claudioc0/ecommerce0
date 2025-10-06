export function renderPremiumArea(user) {
    if (!user?.isPremium) {
        return `
            <div class="premium-upgrade">
                <div class="upgrade-card">
                    <div class="upgrade-header">
                        <h2>⭐ Torne-se Premium</h2>
                        <p>Desbloqueie recursos exclusivos e tenha uma experiência única</p>
                    </div>
                    
                    <div class="premium-features">
                        <div class="feature-grid">
                            <div class="feature-item">
                                <div class="feature-icon">🎯</div>
                                <h4>Produtos Exclusivos</h4>
                                <p>Acesso a coleções limitadas e lançamentos antecipados</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🔍</div>
                                <h4>Filtros Avançados</h4>
                                <p>Busca por marca, material, ocasião e muito mais</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">❤️</div>
                                <h4>Lista de Desejos</h4>
                                <p>Salve produtos favoritos e receba alertas de promoção</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🚚</div>
                                <h4>Frete Grátis</h4>
                                <p>Frete gratuito em compras acima de R$ 100</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🎧</div>
                                <h4>Suporte VIP</h4>
                                <p>Atendimento prioritário via WhatsApp</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">💎</div>
                                <h4>Cashback</h4>
                                <p>5% de cashback em todas as compras</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pricing-section">
                        <div class="price-card">
                            <h3>Premium Mensal</h3>
                            <div class="price">R$ 29,90<span>/mês</span></div>
                            <button class="btn-primary upgrade-btn" onclick="upgradeToPremium('monthly')">
                                Assinar Agora
                            </button>
                        </div>
                        <div class="price-card featured">
                            <div class="popular-badge">Mais Popular</div>
                            <h3>Premium Anual</h3>
                            <div class="price">R$ 299,90<span>/ano</span></div>
                            <div class="savings">Economize R$ 58,90</div>
                            <button class="btn-primary upgrade-btn" onclick="upgradeToPremium('yearly')">
                                Assinar Agora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="premium-dashboard">
            <div class="welcome-section">
                <h2>Bem-vindo, ${user.name}! ⭐</h2>
                <p>Aproveite todos os benefícios da sua assinatura Premium</p>
                <div class="subscription-status">
                    <span class="status-badge active">Premium Ativo</span>
                    <span class="expiry-date">Válido até: ${new Date(user.subscription.expiresAt).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>

            <!-- Exclusive Products -->
            <div class="premium-section">
                <h3>🎯 Produtos Exclusivos</h3>
                <div class="exclusive-products">
                    <div class="product-card exclusive">
                        <div class="exclusive-badge">Exclusivo</div>
                        <img src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Produto Exclusivo">
                        <div class="product-info">
                            <h4>Coleção Limitada - Vestido Gala</h4>
                            <p class="price">R$ 399,90</p>
                            <button class="btn-primary">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                    <div class="product-card exclusive">
                        <div class="exclusive-badge">Pré-lançamento</div>
                        <img src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Pré-lançamento">
                        <div class="product-info">
                            <h4>Jaqueta Designer - Edição Especial</h4>
                            <p class="price">R$ 599,90</p>
                            <button class="btn-primary">Pré-reservar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Advanced Filters -->
            <div class="premium-section">
                <h3>🔍 Filtros Avançados</h3>
                <div class="advanced-filters">
                    <div class="filter-row">
                        <div class="filter-group">
                            <label>Marca</label>
                            <select>
                                <option>Todas as marcas</option>
                                <option>Zara</option>
                                <option>H&M</option>
                                <option>Forever 21</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Material</label>
                            <select>
                                <option>Todos os materiais</option>
                                <option>Algodão</option>
                                <option>Seda</option>
                                <option>Linho</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Ocasião</label>
                            <select>
                                <option>Todas as ocasiões</option>
                                <option>Casual</option>
                                <option>Formal</option>
                                <option>Festa</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wishlist -->
            <div class="premium-section">
                <h3>❤️ Minha Lista de Desejos</h3>
                <div class="wishlist-items">
                    <div class="wishlist-item">
                        <img src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Item desejado">
                        <div class="item-info">
                            <h4>Vestido Floral Elegante</h4>
                            <p class="price">R$ 159,90</p>
                            <div class="price-alert">
                                <span class="alert-badge">Promoção!</span>
                                <span>Era R$ 199,90</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-primary btn-sm">Comprar</button>
                            <button class="btn-secondary btn-sm">Remover</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Premium Stats -->
            <div class="premium-section">
                <h3>📊 Suas Estatísticas Premium</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">R$ 127,50</div>
                        <div class="stat-label">Cashback Acumulado</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🚚</div>
                        <div class="stat-value">R$ 89,70</div>
                        <div class="stat-label">Economizado em Frete</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">15</div>
                        <div class="stat-label">Produtos Exclusivos Comprados</div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .premium-upgrade {
                max-width: 1000px;
                margin: 0 auto;
                padding: 32px;
            }

            .upgrade-card {
                background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
                color: white;
                border-radius: 16px;
                padding: 48px;
                text-align: center;
            }

            .upgrade-header h2 {
                font-size: 2.5rem;
                margin-bottom: 16px;
            }

            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
                margin: 48px 0;
            }

            .feature-item {
                background: rgba(255, 255, 255, 0.1);
                padding: 24px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }

            .feature-icon {
                font-size: 2rem;
                margin-bottom: 16px;
            }

            .pricing-section {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                margin-top: 48px;
            }

            .price-card {
                background: white;
                color: var(--gray-800);
                padding: 32px;
                border-radius: 12px;
                position: relative;
            }

            .price-card.featured {
                transform: scale(1.05);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }

            .popular-badge {
                position: absolute;
                top: -12px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--accent-500);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .price {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--primary-500);
                margin: 16px 0;
            }

            .price span {
                font-size: 1rem;
                color: var(--gray-500);
            }

            .savings {
                color: var(--success-500);
                font-weight: 600;
                margin-bottom: 24px;
            }

            .premium-dashboard {
                max-width: 1200px;
                margin: 0 auto;
                padding: 32px;
            }

            .welcome-section {
                background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
                color: white;
                padding: 32px;
                border-radius: 16px;
                margin-bottom: 32px;
            }

            .subscription-status {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-top: 16px;
            }

            .status-badge {
                background: var(--success-500);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
            }

            .premium-section {
                background: white;
                padding: 32px;
                border-radius: 12px;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .exclusive-products {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
            }

            .product-card.exclusive {
                position: relative;
                border: 2px solid var(--accent-500);
            }

            .exclusive-badge {
                position: absolute;
                top: 12px;
                right: 12px;
                background: var(--accent-500);
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                z-index: 1;
            }

            .advanced-filters .filter-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }

            .wishlist-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                border: 1px solid var(--gray-200);
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .wishlist-item img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
            }

            .item-info {
                flex: 1;
            }

            .price-alert {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
            }

            .alert-badge {
                background: var(--success-500);
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 24px;
            }

            .stat-card {
                text-align: center;
                padding: 24px;
                background: var(--gray-50);
                border-radius: 12px;
            }

            .stat-icon {
                font-size: 2rem;
                margin-bottom: 12px;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-500);
                margin-bottom: 8px;
            }
        </style>

        <script>
            window.upgradeToPremium = (plan) => {
                alert(\`Redirecionando para pagamento do plano \${plan}...\`);
                // Implementation for premium upgrade
            };
        </script>
    `;
}