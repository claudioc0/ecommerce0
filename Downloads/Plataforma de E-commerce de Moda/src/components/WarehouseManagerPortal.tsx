import { useState } from 'react';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Archive,
  AlertCircle,
  Target,
  Boxes
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WarehouseManagerPortalProps {
  onClose: () => void;
}

export function WarehouseManagerPortal({ onClose }: WarehouseManagerPortalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWarehouse, setSelectedWarehouse] = useState('central');

  const inventoryData = [
    { month: 'Jan', entradas: 2400, saidas: 2000, estoque: 8500 },
    { month: 'Fev', entradas: 3200, saidas: 2800, estoque: 8900 },
    { month: 'Mar', entradas: 2800, saidas: 2400, estoque: 9300 },
    { month: 'Abr', entradas: 4100, saidas: 3200, estoque: 10200 },
    { month: 'Mai', entradas: 3500, saidas: 3800, estoque: 9900 },
    { month: 'Jun', entradas: 4200, saidas: 3600, estoque: 10500 }
  ];

  const categoryStock = [
    { category: 'Vestidos', current: 245, minimum: 100, maximum: 500, status: 'optimal' },
    { category: 'Camisetas', current: 89, minimum: 150, maximum: 400, status: 'low' },
    { category: 'Calças', current: 456, minimum: 200, maximum: 600, status: 'optimal' },
    { category: 'Acessórios', current: 23, minimum: 50, maximum: 200, status: 'critical' },
    { category: 'Blazers', current: 167, minimum: 80, maximum: 300, status: 'optimal' },
    { category: 'Sapatos', current: 78, minimum: 100, maximum: 250, status: 'low' }
  ];

  const recentMovements = [
    { id: 'MOV001', type: 'entrada', product: 'Vestido Midi Floral', quantity: 50, date: '2025-01-19 14:30', supplier: 'Fornecedor A' },
    { id: 'MOV002', type: 'saida', product: 'Camiseta Basic', quantity: 25, date: '2025-01-19 13:45', destination: 'Loja Centro' },
    { id: 'MOV003', type: 'transferencia', product: 'Blazer Premium', quantity: 15, date: '2025-01-19 11:20', destination: 'CD Norte' },
    { id: 'MOV004', type: 'entrada', product: 'Calça Jeans', quantity: 30, date: '2025-01-19 09:15', supplier: 'Fornecedor B' },
    { id: 'MOV005', type: 'ajuste', product: 'Bolsa Couro', quantity: -3, date: '2025-01-18 16:50', reason: 'Avaria' }
  ];

  const lowStockItems = [
    { id: '1', name: 'Camiseta Oversized', category: 'Camisetas', current: 8, minimum: 20, location: 'A1-B2' },
    { id: '2', name: 'Saia Plissada', category: 'Saias', current: 5, minimum: 15, location: 'B2-C1' },
    { id: '3', name: 'Blazer Estruturado', category: 'Blazers', current: 12, minimum: 25, location: 'C1-A3' },
    { id: '4', name: 'Bolsa Tiracolo', category: 'Acessórios', current: 3, minimum: 10, location: 'D1-B1' }
  ];

  const pendingOrders = [
    { id: 'PO001', supplier: 'Fornecedor A', items: 15, expected: '2025-01-25', status: 'confirmed' },
    { id: 'PO002', supplier: 'Fornecedor B', items: 8, expected: '2025-01-28', status: 'pending' },
    { id: 'PO003', supplier: 'Fornecedor C', items: 22, expected: '2025-02-02', status: 'shipped' }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      optimal: { variant: 'default' as const, text: 'Ideal', color: 'text-green-600' },
      low: { variant: 'secondary' as const, text: 'Baixo', color: 'text-yellow-600' },
      critical: { variant: 'destructive' as const, text: 'Crítico', color: 'text-red-600' }
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const getMovementIcon = (type: string) => {
    const iconMap = {
      entrada: <TrendingUp className="w-4 h-4 text-green-600" />,
      saida: <Package className="w-4 h-4 text-blue-600" />,
      transferencia: <Truck className="w-4 h-4 text-purple-600" />,
      ajuste: <RefreshCw className="w-4 h-4 text-orange-600" />
    };
    return iconMap[type as keyof typeof iconMap];
  };

  const metrics = {
    totalItems: 12450,
    totalValue: 'R$ 2.850.000',
    lowStockAlerts: 23,
    pendingReceiving: 8,
    turnoverRate: 4.2,
    accuracy: 98.5,
    availabilityRate: 95.8,
    warehouseUtilization: 76.5
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl border">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Portal do Gerente de Estoque</h1>
                <p className="text-green-200">Centro de Distribuição - Ana Costa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">CD Central</SelectItem>
                  <SelectItem value="norte">CD Norte</SelectItem>
                  <SelectItem value="sul">CD Sul</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
                ✕
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-sm opacity-90">Itens Totais</p>
                  <p className="text-lg font-bold">{metrics.totalItems.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-300" />
                <div>
                  <p className="text-sm opacity-90">Alertas Baixo Estoque</p>
                  <p className="text-lg font-bold">{metrics.lowStockAlerts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-300" />
                <div>
                  <p className="text-sm opacity-90">Precisão</p>
                  <p className="text-lg font-bold">{metrics.accuracy}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-sm opacity-90">Giro de Estoque</p>
                  <p className="text-lg font-bold">{metrics.turnoverRate}x</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="inventory">Inventário</TabsTrigger>
              <TabsTrigger value="movements">Movimentações</TabsTrigger>
              <TabsTrigger value="receiving">Recebimento</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inventory Trend */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Movimentação de Estoque (6 meses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={2} name="Entradas" />
                        <Line type="monotone" dataKey="saidas" stroke="#ef4444" strokeWidth={2} name="Saídas" />
                        <Line type="monotone" dataKey="estoque" stroke="#3b82f6" strokeWidth={2} name="Estoque Atual" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Critical Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Alertas Críticos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lowStockItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.current} un. (mín: {item.minimum})
                          </p>
                          <p className="text-xs text-muted-foreground">{item.location}</p>
                        </div>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="w-full">
                      Ver Todos os Alertas
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Stock Status by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Status do Estoque por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryStock.map((category, index) => {
                      const statusInfo = getStatusBadge(category.status);
                      const fillPercentage = (category.current / category.maximum) * 100;
                      return (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{category.category}</h4>
                            <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>{category.current} unidades</span>
                              <span>{Math.round(fillPercentage)}%</span>
                            </div>
                            <Progress value={fillPercentage} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Min: {category.minimum}</span>
                              <span>Max: {category.maximum}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Controle de Inventário</h3>
                  <p className="text-muted-foreground">Gerencie produtos e níveis de estoque</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sincronizar
                  </Button>
                  <Button>
                    <Archive className="w-4 h-4 mr-2" />
                    Inventário Físico
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Input placeholder="Buscar por produto ou SKU..." className="max-w-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    <SelectItem value="low">Estoque baixo</SelectItem>
                    <SelectItem value="critical">Estoque crítico</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>SKU{item.id.padStart(6, '0')}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{item.current}</span>
                            {item.current < item.minimum && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.minimum}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {item.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.current < item.minimum ? 'destructive' : 'default'}>
                            {item.current < item.minimum ? 'Baixo' : 'OK'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            Ajustar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Movements Tab */}
            <TabsContent value="movements" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Movimentações Recentes</h3>
                  <p className="text-muted-foreground">Histórico de entradas, saídas e transferências</p>
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Origem/Destino</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.type)}
                            <span className="capitalize">{movement.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{movement.product}</TableCell>
                        <TableCell>
                          <span className={movement.quantity < 0 ? 'text-red-600' : 'text-green-600'}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {movement.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          {movement.supplier || movement.destination || movement.reason || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Processado</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Receiving Tab */}
            <TabsContent value="receiving" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Pedidos de Compra Pendentes</h3>
                  <p className="text-muted-foreground">{metrics.pendingReceiving} pedidos aguardando recebimento</p>
                </div>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Recebimento
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pendingOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge variant={
                          order.status === 'confirmed' ? 'default' :
                          order.status === 'shipped' ? 'secondary' : 'outline'
                        }>
                          {order.status === 'confirmed' ? 'Confirmado' :
                           order.status === 'shipped' ? 'Enviado' : 'Pendente'}
                        </Badge>
                      </div>
                      <CardDescription>{order.supplier}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Itens:</span>
                        <span className="font-medium">{order.items} produtos</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Previsão:</span>
                        <span className="font-medium">{new Date(order.expected).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Receber
                        </Button>
                        <Button size="sm" variant="outline">
                          Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Relatórios e Métricas</h3>
                <p className="text-muted-foreground">Análises detalhadas do desempenho do estoque</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Valor Total do Estoque</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-green-600">{metrics.totalValue}</p>
                    <p className="text-sm text-muted-foreground mt-2">+5,2% vs mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Taxa de Disponibilidade</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{metrics.availabilityRate}%</p>
                    <Progress value={metrics.availabilityRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Utilização do Armazém</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{metrics.warehouseUtilization}%</p>
                    <Progress value={metrics.warehouseUtilization} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Giro de Estoque</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-orange-600">{metrics.turnoverRate}x</p>
                    <p className="text-sm text-muted-foreground mt-2">por ano</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Análise de Giro por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryStock}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="#3b82f6" name="Estoque Atual" />
                      <Bar dataKey="minimum" fill="#ef4444" name="Estoque Mínimo" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}