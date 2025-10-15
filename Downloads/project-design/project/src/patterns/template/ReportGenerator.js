/**
 * Template Method Pattern - Example 1: Report Generator
 * Defines the skeleton of report generation algorithm
 */
export class ReportGenerator {
    generateReport(data, options = {}) {
        console.log('Starting report generation...');
        
        const processedData = this.preprocessData(data);
        const formattedData = this.formatData(processedData, options);
        const reportContent = this.createReportContent(formattedData, options);
        const finalReport = this.postProcessReport(reportContent, options);
        
        console.log('Report generation completed');
        return finalReport;
    }

    preprocessData(data) {
        throw new Error('preprocessData method must be implemented by subclass');
    }

    formatData(data, options) {
        throw new Error('formatData method must be implemented by subclass');
    }

    createReportContent(data, options) {
        throw new Error('createReportContent method must be implemented by subclass');
    }

    postProcessReport(content, options) {
        return {
            content,
            generatedAt: new Date().toISOString(),
            options,
            metadata: this.getReportMetadata()
        };
    }

    getReportMetadata() {
        return {
            generator: this.constructor.name,
            version: '1.0.0',
            format: this.getReportFormat()
        };
    }

    getReportFormat() {
        return 'generic';
    }
}

export class SalesReportGenerator extends ReportGenerator {
    preprocessData(data) {
        return data.filter(item => item.status === 'completed')
                  .map(item => ({
                      ...item,
                      total: parseFloat(item.total),
                      date: new Date(item.date)
                  }))
                  .sort((a, b) => b.date - a.date);
    }

    formatData(data, options) {
        const { groupBy = 'day', includeDetails = true } = options;
        
        if (groupBy === 'day') {
            return this.groupByDay(data, includeDetails);
        } else if (groupBy === 'month') {
            return this.groupByMonth(data, includeDetails);
        }
        
        return data;
    }

    groupByDay(data, includeDetails) {
        const grouped = {};
        
        data.forEach(item => {
            const day = item.date.toISOString().split('T')[0];
            if (!grouped[day]) {
                grouped[day] = {
                    date: day,
                    totalSales: 0,
                    orderCount: 0,
                    items: []
                };
            }
            
            grouped[day].totalSales += item.total;
            grouped[day].orderCount += 1;
            
            if (includeDetails) {
                grouped[day].items.push(item);
            }
        });
        
        return Object.values(grouped);
    }

    groupByMonth(data, includeDetails) {
        const grouped = {};
        
        data.forEach(item => {
            const month = item.date.toISOString().substring(0, 7);
            if (!grouped[month]) {
                grouped[month] = {
                    month,
                    totalSales: 0,
                    orderCount: 0,
                    items: []
                };
            }
            
            grouped[month].totalSales += item.total;
            grouped[month].orderCount += 1;
            
            if (includeDetails) {
                grouped[month].items.push(item);
            }
        });
        
        return Object.values(grouped);
    }

    createReportContent(data, options) {
        const { title = 'Sales Report', includeCharts = false } = options;
        
        let content = `<div class="sales-report">`;
        content += `<h1>${title}</h1>`;
        content += `<div class="report-summary">`;
        
        const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);
        const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);
        
        content += `<div class="summary-card">`;
        content += `<h3>Total Sales</h3>`;
        content += `<p class="amount">R$ ${totalSales.toFixed(2)}</p>`;
        content += `</div>`;
        
        content += `<div class="summary-card">`;
        content += `<h3>Total Orders</h3>`;
        content += `<p class="count">${totalOrders}</p>`;
        content += `</div>`;
        
        content += `</div>`;
        
        content += `<div class="report-data">`;
        data.forEach(item => {
            content += `<div class="data-row">`;
            content += `<span class="date">${item.date || item.month}</span>`;
            content += `<span class="sales">R$ ${item.totalSales.toFixed(2)}</span>`;
            content += `<span class="orders">${item.orderCount} orders</span>`;
            content += `</div>`;
        });
        content += `</div>`;
        
        if (includeCharts) {
            content += this.generateCharts(data);
        }
        
        content += `</div>`;
        
        return content;
    }

    generateCharts(data) {
        return `<div class="charts-section">
            <h3>Sales Trends</h3>
            <div class="chart-placeholder">
                <p>Chart visualization would be rendered here</p>
                <p>Data points: ${data.length}</p>
            </div>
        </div>`;
    }

    getReportFormat() {
        return 'sales-html';
    }
}

export class InventoryReportGenerator extends ReportGenerator {
    preprocessData(data) {
        return data.filter(item => item.active)
                  .map(item => ({
                      ...item,
                      stock: parseInt(item.stock) || 0,
                      price: parseFloat(item.price) || 0
                  }));
    }

    formatData(data, options) {
        const { sortBy = 'stock', order = 'asc' } = options;
        
        return data.sort((a, b) => {
            if (order === 'asc') {
                return a[sortBy] - b[sortBy];
            } else {
                return b[sortBy] - a[sortBy];
            }
        });
    }

    createReportContent(data, options) {
        const { title = 'Inventory Report', showLowStock = true } = options;
        
        let content = `<div class="inventory-report">`;
        content += `<h1>${title}</h1>`;
        
        const lowStockItems = data.filter(item => item.stock < 5);
        const outOfStockItems = data.filter(item => item.stock === 0);
        const totalValue = data.reduce((sum, item) => sum + (item.stock * item.price), 0);
        
        content += `<div class="inventory-summary">`;
        content += `<div class="summary-card">`;
        content += `<h3>Total Products</h3>`;
        content += `<p class="count">${data.length}</p>`;
        content += `</div>`;
        
        content += `<div class="summary-card">`;
        content += `<h3>Total Inventory Value</h3>`;
        content += `<p class="amount">R$ ${totalValue.toFixed(2)}</p>`;
        content += `</div>`;
        
        content += `<div class="summary-card alert">`;
        content += `<h3>Low Stock Items</h3>`;
        content += `<p class="count">${lowStockItems.length}</p>`;
        content += `</div>`;
        content += `</div>`;
        
        if (showLowStock && lowStockItems.length > 0) {
            content += `<div class="low-stock-section">`;
            content += `<h3>⚠️ Low Stock Alert</h3>`;
            lowStockItems.forEach(item => {
                content += `<div class="alert-item">`;
                content += `<span class="product-name">${item.name}</span>`;
                content += `<span class="stock-level">${item.stock} units</span>`;
                content += `</div>`;
            });
            content += `</div>`;
        }
        
        content += `<div class="inventory-table">`;
        content += `<table>`;
        content += `<thead>`;
        content += `<tr><th>Product</th><th>Stock</th><th>Price</th><th>Value</th></tr>`;
        content += `</thead>`;
        content += `<tbody>`;
        
        data.forEach(item => {
            const itemValue = item.stock * item.price;
            content += `<tr>`;
            content += `<td>${item.name}</td>`;
            content += `<td class="${item.stock === 0 ? 'out-of-stock' : item.stock < 5 ? 'low-stock' : ''}">${item.stock}</td>`;
            content += `<td>R$ ${item.price.toFixed(2)}</td>`;
            content += `<td>R$ ${itemValue.toFixed(2)}</td>`;
            content += `</tr>`;
        });
        
        content += `</tbody>`;
        content += `</table>`;
        content += `</div>`;
        content += `</div>`;
        
        return content;
    }

    getReportFormat() {
        return 'inventory-html';
    }
}