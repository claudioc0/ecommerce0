import { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  BarChart3, 
  Plus,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Filter,
  Download,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SellerDashboardProps {
  onClose: () => void;
}

export function SellerDashboard({ onClose }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data para o dashboard
  const salesData = [
    { day: 'Seg', vendas: 2400, pedidos: 24 },
    { day: 'Ter', vendas: 3200, pedidos: 32 },
    { day: 'Qua', vendas: 2800, pedidos: 28 },
    { day: 'Qui', vendas: 4100, pedidos: 41 },
    { day: 'Sex', vendas: 5200, pedidos: 52 },
    { day: 'Sáb', vendas: 6800, pedidos: 68 },
    { day: 'Dom', vendas: 4500, pedidos: 45 }
  ];

  const categoryData = [
    { name: 'Vestidos', value: 35, color: '#8884d8' },
    { name: 'Camisetas', value: 25, color: '#82ca9d' },
    { name: 'Calças', value: 20, color: '#ffc658' },
    { name: 'Acessórios', value: 20, color: '#ff7c7c' }
  ];

  const recentOrders = [
    { id: '#12345', customer: 'Maria Silva', product: 'Vestido Floral', value: 'R$ 120,00', status: 'confirmed', date: '2025-01-19' },
    { id: '#12346', customer: 'João Santos', product: 'Camiseta Basic', value: 'R$ 45,00', status: 'processing', date: '2025-01-19' },
    { id: '#12347', customer: 'Ana Costa', product: 'Blazer Premium', value: 'R$ 280,00', status: 'shipped', date: '2025-01-18' },
    { id: '#12348', customer: 'Carlos Lima', product: 'Calça Jeans', value: 'R$ 89,00', status: 'delivered', date: '2025-01-18' },
    { id: '#12349', customer: 'Lucia Pereira', product: 'Bolsa Couro', value: 'R$ 150,00', status: 'cancelled', date: '2025-01-17' }
  ];

  const topProducts = [
    { name: 'Vestido Midi Floral', sales: 145, revenue: 'R$ 17.400', trend: '+12%', stock: 23 },
    { name: 'Blazer Estruturado', sales: 89, revenue: 'R$ 24.920', trend: '+8%', stock: 12 },
    { name: 'Calça Wide Leg', sales: 76, revenue: 'R$ 6.840', trend: '+5%', stock: 45 },
    { name: 'Camiseta Oversized', sales: 234, revenue: 'R$ 10.530', trend: '+18%', stock: 67 },
    { name: 'Saia Plissada', sales: 56, revenue: 'R$ 6.720', trend: '-3%', stock: 8 }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      confirmed: { variant: 'default' as const, text: 'Confirmado' },
      processing: { variant: 'secondary' as const, text: 'Processando' },
      shipped: { variant: 'outline' as const, text: 'Enviado' },
      delivered: { variant: 'default' as const, text: 'Entregue' },
      cancelled: { variant: 'destructive' as const, text: 'Cancelado' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const metrics = {
    totalRevenue: 45280,
    totalOrders: 289,
    averageOrder: 156.68,
    conversionRate: 3.2,
    monthlyGrowth: 12.5,
    productsSold: 1240,
    lowStockItems: 15,
    pendingOrders: 23
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl border">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard do Vendedor</h1>
                <p className="text-blue-200">Loja: Moda & Estilo - João Santos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
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
                <DollarSign className="w-5 h-5 text-green-300" />
                <div>
                  <p className="text-sm opacity-90">Receita Total</p>
                  <p className="text-lg font-bold">R$ {metrics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-sm opacity-90">Pedidos</p>
                  <p className="text-lg font-bold">{metrics.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-sm opacity-90">Crescimento</p>
                  <p className="text-lg font-bold">+{metrics.monthlyGrowth}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-300" />
                <div>
                  <p className="text-sm opacity-90">Estoque Baixo</p>
                  <p className="text-lg font-bold">{metrics.lowStockItems}</p>
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
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="goals">Metas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Vendas dos Últimos 7 Dias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value: any, name: any) => [
                          name === 'vendas' ? `R$ ${value}` : value,
                          name === 'vendas' ? 'Vendas' : 'Pedidos'
                        ]} />
                        <Line type="monotone" dataKey="vendas" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="pedidos" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Novo pedido #12350</p>
                          <p className="text-xs text-muted-foreground">há 5 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Produto enviado</p>
                          <p className="text-xs text-muted-foreground">há 1 hora</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Estoque baixo</p>
                          <p className="text-xs text-muted-foreground">há 2 horas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Produtos Mais Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{product.sales} vendas</span>
                            <span>Estoque: {product.stock}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{product.revenue}</p>
                          <Badge variant={product.trend.startsWith('+') ? 'default' : 'destructive'}>
                            {product.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Produtos</h3>
                  <p className="text-muted-foreground">Visualize e gerencie seu inventário</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Input placeholder="Buscar produtos..." className="max-w-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    <SelectItem value="vestidos">Vestidos</SelectItem>
                    <SelectItem value="camisetas">Camisetas</SelectItem>
                    <SelectItem value="calcas">Calças</SelectItem>
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
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>Roupas</TableCell>
                        <TableCell>R$ 120,00</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.stock}</span>
                            {product.stock < 10 && (
                              <Badge variant="destructive" className="text-xs">Baixo</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
                  <p className="text-muted-foreground">{metrics.pendingOrders} pedidos pendentes</p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Pedidos
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.value}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {categoryData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Taxa de Conversão</span>
                        <span>{metrics.conversionRate}%</span>
                      </div>
                      <Progress value={metrics.conversionRate * 10} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Ticket Médio</span>
                        <span>R$ {metrics.averageOrder.toFixed(2)}</span>
                      </div>
                      <Progress value={metrics.averageOrder / 3} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Crescimento Mensal</span>
                        <span>+{metrics.monthlyGrowth}%</span>
                      </div>
                      <Progress value={metrics.monthlyGrowth * 4} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Metas e Objetivos</h3>
                <p className="text-muted-foreground">Acompanhe o progresso das suas metas mensais</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Meta de Vendas
                    </CardTitle>
                    <CardDescription>Janeiro 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>R$ {metrics.totalRevenue.toLocaleString()} / R$ 60.000</span>
                          <span>{Math.round((metrics.totalRevenue / 60000) * 100)}%</span>
                        </div>
                        <Progress value={(metrics.totalRevenue / 60000) * 100} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Faltam R$ {(60000 - metrics.totalRevenue).toLocaleString()} para atingir a meta
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Novos Clientes
                    </CardTitle>
                    <CardDescription>Janeiro 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>47 / 60 clientes</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        13 novos clientes para atingir a meta
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      Taxa de Conversão
                    </CardTitle>
                    <CardDescription>Janeiro 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{metrics.conversionRate}% / 5%</span>
                          <span>64%</span>
                        </div>
                        <Progress value={64} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        +{(5 - metrics.conversionRate).toFixed(1)}% para atingir a meta
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}