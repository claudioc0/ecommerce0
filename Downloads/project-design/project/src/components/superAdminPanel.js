export function renderSuperAdminPanel(systemStats) {
    return `
        <div class="super-admin-panel">
            <!-- System Overview -->
            <div class="system-overview">
                <h2>🔧 Painel Super Administrador</h2>
                <p>Controle total do sistema e monitoramento avançado</p>
                
                <div class="critical-stats">
                    <div class="critical-stat">
                        <div class="stat-icon critical">🚨</div>
                        <div class="stat-content">
                            <div class="stat-value">${systemStats.criticalAlerts}</div>
                            <div class="stat-label">Alertas Críticos</div>
                        </div>
                    </div>
                    <div class="critical-stat">
                        <div class="stat-icon warning">⚠️</div>
                        <div class="stat-content">
                            <div class="stat-value">${systemStats.systemLoad}%</div>
                            <div class="stat-label">Carga do Sistema</div>
                        </div>
                    </div>
                    <div class="critical-stat">
                        <div class="stat-icon success">✅</div>
                        <div class="stat-content">
                            <div class="stat-value">${systemStats.uptime}</div>
                            <div class="stat-label">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Super Admin Navigation -->
            <div class="super-admin-nav">
                <button class="super-nav-btn active" data-section="system-health">Sistema</button>
                <button class="super-nav-btn" data-section="user-management">Usuários</button>
                <button class="super-nav-btn" data-section="security">Segurança</button>
                <button class="super-nav-btn" data-section="database">Banco de Dados</button>
                <button class="super-nav-btn" data-section="logs">Logs</button>
                <button class="super-nav-btn" data-section="backups">Backups</button>
                <button class="super-nav-btn" data-section="integrations">Integrações</button>
            </div>

            <!-- System Health Section -->
            <div class="super-admin-section active" id="system-health-section">
                <h3>🏥 Saúde do Sistema</h3>
                
                <div class="health-metrics">
                    <div class="metric-card">
                        <h4>Performance</h4>
                        <div class="metric-chart">
                            <div class="chart-placeholder">
                                <div class="performance-indicator good">
                                    <span class="indicator-value">98.5%</span>
                                    <span class="indicator-label">Performance Score</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>Recursos do Servidor</h4>
                        <div class="resource-bars">
                            <div class="resource-item">
                                <span>CPU</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 45%"></div>
                                </div>
                                <span>45%</span>
                            </div>
                            <div class="resource-item">
                                <span>RAM</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 62%"></div>
                                </div>
                                <span>62%</span>
                            </div>
                            <div class="resource-item">
                                <span>Disco</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 78%"></div>
                                </div>
                                <span>78%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>Tráfego de Rede</h4>
                        <div class="network-stats">
                            <div class="network-item">
                                <span class="network-label">Entrada</span>
                                <span class="network-value">1.2 GB/h</span>
                            </div>
                            <div class="network-item">
                                <span class="network-label">Saída</span>
                                <span class="network-value">2.8 GB/h</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="system-services">
                    <h4>Status dos Serviços</h4>
                    <div class="services-grid">
                        <div class="service-item online">
                            <div class="service-status"></div>
                            <span>API Gateway</span>
                            <span class="service-uptime">99.9%</span>
                        </div>
                        <div class="service-item online">
                            <div class="service-status"></div>
                            <span>Database</span>
                            <span class="service-uptime">100%</span>
                        </div>
                        <div class="service-item warning">
                            <div class="service-status"></div>
                            <span>Email Service</span>
                            <span class="service-uptime">97.2%</span>
                        </div>
                        <div class="service-item online">
                            <div class="service-status"></div>
                            <span>Payment Gateway</span>
                            <span class="service-uptime">99.8%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Management Section -->
            <div class="super-admin-section" id="user-management-section">
                <h3>👥 Gestão de Usuários</h3>
                
                <div class="user-stats">
                    <div class="user-stat-card">
                        <h4>Total de Usuários</h4>
                        <div class="stat-number">${systemStats.totalUsers}</div>
                        <div class="stat-breakdown">
                            <span>Clientes: ${systemStats.customers}</span>
                            <span>Premium: ${systemStats.premiumUsers}</span>
                            <span>Lojistas: ${systemStats.vendors}</span>
                            <span>Admins: ${systemStats.admins}</span>
                        </div>
                    </div>
                    
                    <div class="user-stat-card">
                        <h4>Atividade Recente</h4>
                        <div class="activity-summary">
                            <div class="activity-item">
                                <span class="activity-count">23</span>
                                <span>Novos registros hoje</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-count">156</span>
                                <span>Logins nas últimas 24h</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-count">5</span>
                                <span>Contas suspensas</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="user-actions">
                    <button class="btn-primary" onclick="exportUserData()">Exportar Dados</button>
                    <button class="btn-secondary" onclick="sendBulkEmail()">Email em Massa</button>
                    <button class="btn-secondary" onclick="generateUserReport()">Relatório Detalhado</button>
                </div>

                <div class="user-table-container">
                    <table class="user-management-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Último Login</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#001</td>
                                <td>João Silva</td>
                                <td>joao@email.com</td>
                                <td><span class="user-type customer">Cliente</span></td>
                                <td><span class="status-badge active">Ativo</span></td>
                                <td>2 horas atrás</td>
                                <td>
                                    <button class="btn-sm btn-secondary" onclick="viewUserDetails('001')">Ver</button>
                                    <button class="btn-sm btn-warning" onclick="suspendUser('001')">Suspender</button>
                                </td>
                            </tr>
                            <tr>
                                <td>#002</td>
                                <td>Maria Premium</td>
                                <td>maria@email.com</td>
                                <td><span class="user-type premium">Premium</span></td>
                                <td><span class="status-badge active">Ativo</span></td>
                                <td>1 dia atrás</td>
                                <td>
                                    <button class="btn-sm btn-secondary" onclick="viewUserDetails('002')">Ver</button>
                                    <button class="btn-sm btn-warning" onclick="suspendUser('002')">Suspender</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Security Section -->
            <div class="super-admin-section" id="security-section">
                <h3>🔒 Segurança</h3>
                
                <div class="security-overview">
                    <div class="security-card threat-level">
                        <h4>Nível de Ameaça</h4>
                        <div class="threat-indicator low">
                            <span class="threat-level-text">BAIXO</span>
                        </div>
                        <p>Sistema seguro, sem ameaças detectadas</p>
                    </div>
                    
                    <div class="security-card failed-logins">
                        <h4>Tentativas de Login Falhadas</h4>
                        <div class="failed-count">12</div>
                        <p>Nas últimas 24 horas</p>
                    </div>
                    
                    <div class="security-card blocked-ips">
                        <h4>IPs Bloqueados</h4>
                        <div class="blocked-count">3</div>
                        <p>Bloqueios ativos</p>
                    </div>
                </div>

                <div class="security-logs">
                    <h4>Log de Segurança</h4>
                    <div class="log-entries">
                        <div class="log-entry warning">
                            <span class="log-time">14:32:15</span>
                            <span class="log-message">Múltiplas tentativas de login falhadas de IP 192.168.1.100</span>
                            <span class="log-action">IP bloqueado automaticamente</span>
                        </div>
                        <div class="log-entry info">
                            <span class="log-time">13:45:22</span>
                            <span class="log-message">Admin login bem-sucedido</span>
                            <span class="log-action">Acesso concedido</span>
                        </div>
                        <div class="log-entry success">
                            <span class="log-time">12:18:09</span>
                            <span class="log-message">Backup de segurança concluído</span>
                            <span class="log-action">Sistema atualizado</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Database Section -->
            <div class="super-admin-section" id="database-section">
                <h3>🗄️ Banco de Dados</h3>
                
                <div class="database-stats">
                    <div class="db-stat-card">
                        <h4>Tamanho Total</h4>
                        <div class="db-size">2.4 GB</div>
                    </div>
                    <div class="db-stat-card">
                        <h4>Tabelas</h4>
                        <div class="db-tables">47</div>
                    </div>
                    <div class="db-stat-card">
                        <h4>Conexões Ativas</h4>
                        <div class="db-connections">23</div>
                    </div>
                    <div class="db-stat-card">
                        <h4>Queries/min</h4>
                        <div class="db-queries">1,247</div>
                    </div>
                </div>

                <div class="database-actions">
                    <button class="btn-primary" onclick="optimizeDatabase()">Otimizar DB</button>
                    <button class="btn-secondary" onclick="createBackup()">Criar Backup</button>
                    <button class="btn-secondary" onclick="runMaintenance()">Manutenção</button>
                    <button class="btn-danger" onclick="emergencyShutdown()">Shutdown de Emergência</button>
                </div>
            </div>
        </div>

        <style>
            .super-admin-panel {
                max-width: 1400px;
                margin: 0 auto;
                padding: 24px;
            }

            .system-overview {
                background: linear-gradient(135deg, #1e293b, #334155);
                color: white;
                padding: 32px;
                border-radius: 16px;
                margin-bottom: 24px;
            }

            .critical-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 24px;
                margin-top: 24px;
            }

            .critical-stat {
                display: flex;
                align-items: center;
                gap: 16px;
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }

            .stat-icon.critical {
                background: var(--error-500);
                color: white;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .stat-icon.warning {
                background: var(--warning-500);
                color: white;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .stat-icon.success {
                background: var(--success-500);
                color: white;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .super-admin-nav {
                display: flex;
                gap: 8px;
                margin-bottom: 24px;
                background: white;
                padding: 16px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow-x: auto;
            }

            .super-nav-btn {
                padding: 12px 20px;
                background: transparent;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                white-space: nowrap;
                transition: all 0.2s ease;
            }

            .super-nav-btn.active {
                background: var(--error-500);
                color: white;
            }

            .super-admin-section {
                display: none;
                background: white;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .super-admin-section.active {
                display: block;
            }

            .health-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .metric-card {
                background: var(--gray-50);
                padding: 24px;
                border-radius: 12px;
                border-left: 4px solid var(--primary-500);
            }

            .performance-indicator.good {
                text-align: center;
                padding: 24px;
            }

            .indicator-value {
                display: block;
                font-size: 2rem;
                font-weight: 700;
                color: var(--success-500);
            }

            .resource-bars {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .resource-item {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .progress-bar {
                flex: 1;
                height: 8px;
                background: var(--gray-200);
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: var(--primary-500);
                transition: width 0.3s ease;
            }

            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }

            .service-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: var(--gray-50);
                border-radius: 8px;
            }

            .service-status {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .service-item.online .service-status {
                background: var(--success-500);
            }

            .service-item.warning .service-status {
                background: var(--warning-500);
            }

            .service-item.offline .service-status {
                background: var(--error-500);
            }

            .user-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                margin-bottom: 24px;
            }

            .user-stat-card {
                background: var(--gray-50);
                padding: 24px;
                border-radius: 12px;
            }

            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--primary-500);
                margin: 12px 0;
            }

            .stat-breakdown {
                display: flex;
                flex-direction: column;
                gap: 4px;
                font-size: 14px;
                color: var(--gray-600);
            }

            .user-type.customer {
                background: var(--primary-100);
                color: var(--primary-700);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .user-type.premium {
                background: var(--accent-100);
                color: var(--accent-700);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .security-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .security-card {
                background: var(--gray-50);
                padding: 24px;
                border-radius: 12px;
                text-align: center;
            }

            .threat-indicator.low {
                background: var(--success-100);
                color: var(--success-700);
                padding: 12px 24px;
                border-radius: 20px;
                font-weight: 700;
                margin: 16px 0;
            }

            .failed-count,
            .blocked-count {
                font-size: 2rem;
                font-weight: 700;
                color: var(--warning-500);
                margin: 12px 0;
            }

            .log-entries {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .log-entry {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px;
                border-radius: 8px;
                font-size: 14px;
            }

            .log-entry.warning {
                background: var(--warning-50);
                border-left: 4px solid var(--warning-500);
            }

            .log-entry.info {
                background: var(--primary-50);
                border-left: 4px solid var(--primary-500);
            }

            .log-entry.success {
                background: var(--success-50);
                border-left: 4px solid var(--success-500);
            }

            .database-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 24px;
                margin-bottom: 24px;
            }

            .db-stat-card {
                background: var(--gray-50);
                padding: 24px;
                border-radius: 12px;
                text-align: center;
            }

            .db-size,
            .db-tables,
            .db-connections,
            .db-queries {
                font-size: 2rem;
                font-weight: 700;
                color: var(--primary-500);
                margin: 12px 0;
            }

            .database-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .btn-danger {
                background: var(--error-500);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            }
        </style>

        <script>
            // Super admin navigation
            document.querySelectorAll('.super-nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.super-nav-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.super-admin-section').forEach(s => s.classList.remove('active'));
                    
                    btn.classList.add('active');
                    document.getElementById(btn.dataset.section + '-section').classList.add('active');
                });
            });

            // Super admin functions
            window.exportUserData = () => alert('Exportando dados de usuários...');
            window.sendBulkEmail = () => alert('Enviando email em massa...');
            window.generateUserReport = () => alert('Gerando relatório detalhado...');
            window.viewUserDetails = (id) => alert('Ver detalhes do usuário: ' + id);
            window.suspendUser = (id) => alert('Suspender usuário: ' + id);
            window.optimizeDatabase = () => alert('Otimizando banco de dados...');
            window.createBackup = () => alert('Criando backup...');
            window.runMaintenance = () => alert('Executando manutenção...');
            window.emergencyShutdown = () => {
                if (confirm('ATENÇÃO: Isso irá desligar o sistema. Continuar?')) {
                    alert('Shutdown de emergência iniciado...');
                }
            };
        </script>
    `;
}