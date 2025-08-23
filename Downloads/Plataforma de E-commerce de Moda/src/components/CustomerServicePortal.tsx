import { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  Phone,
  Mail,
  User,
  Package,
  CreditCard,
  Search,
  Filter,
  Send,
  FileText,
  Award,
  TrendingUp,
  Users,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface CustomerServicePortalProps {
  onClose: () => void;
}

export function CustomerServicePortal({ onClose }: CustomerServicePortalProps) {
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const tickets = [
    {
      id: 'T001',
      customer: 'Maria Silva',
      subject: 'Problema com entrega',
      status: 'open',
      priority: 'high',
      created: '2025-01-19T14:30:00',
      updated: '2025-01-19T16:45:00',
      channel: 'email',
      category: 'shipping',
      messages: 3
    },
    {
      id: 'T002',
      customer: 'João Santos',
      subject: 'Solicitação de troca',
      status: 'in_progress',
      priority: 'medium',
      created: '2025-01-19T10:15:00',
      updated: '2025-01-19T15:20:00',
      channel: 'chat',
      category: 'returns',
      messages: 5
    },
    {
      id: 'T003',
      customer: 'Ana Costa',
      subject: 'Dúvida sobre produto',
      status: 'resolved',
      priority: 'low',
      created: '2025-01-18T16:45:00',
      updated: '2025-01-19T09:30:00',
      channel: 'phone',
      category: 'product',
      messages: 2
    }
  ];

  const customers = [
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      phone: '(11) 99999-9999',
      totalOrders: 12,
      totalSpent: 2340.50,
      lastOrder: '2025-01-15',
      status: 'vip',
      tickets: 2
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@exemplo.com',
      phone: '(11) 88888-8888',
      totalOrders: 5,
      totalSpent: 890.00,
      lastOrder: '2025-01-10',
      status: 'regular',
      tickets: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      open: { variant: 'destructive' as const, text: 'Aberto' },
      in_progress: { variant: 'secondary' as const, text: 'Em Andamento' },
      resolved: { variant: 'default' as const, text: 'Resolvido' },
      closed: { variant: 'outline' as const, text: 'Fechado' }
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { variant: 'destructive' as const, text: 'Alta' },
      medium: { variant: 'secondary' as const, text: 'Média' },
      low: { variant: 'outline' as const, text: 'Baixa' }
    };
    return priorityMap[priority as keyof typeof priorityMap];
  };

  const getChannelIcon = (channel: string) => {
    const iconMap = {
      email: <Mail className="w-4 h-4" />,
      chat: <MessageSquare className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      whatsapp: <MessageSquare className="w-4 h-4" />
    };
    return iconMap[channel as keyof typeof iconMap];
  };

  const metrics = {
    totalTickets: 45,
    openTickets: 12,
    avgResponseTime: '2h 15min',
    satisfactionRate: 4.7,
    resolvedToday: 8,
    activeChats: 3,
    pendingReviews: 5,
    escalatedTickets: 2
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl border">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Portal de Atendimento</h1>
                <p className="text-orange-200">Customer Service - Lucia Oliveira</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.activeChats}</div>
                <div className="text-xs opacity-75">Chats Ativos</div>
              </div>
              <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
                ✕
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-sm opacity-90">Tickets Abertos</p>
                  <p className="text-lg font-bold">{metrics.openTickets}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-green-300" />
                <div>
                  <p className="text-sm opacity-90">Tempo Médio</p>
                  <p className="text-lg font-bold">{metrics.avgResponseTime}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <div>
                  <p className="text-sm opacity-90">Satisfação</p>
                  <p className="text-lg font-bold">{metrics.satisfactionRate}/5</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-sm opacity-90">Resolvidos Hoje</p>
                  <p className="text-lg font-bold">{metrics.resolvedToday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="customers">Clientes</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Tickets</h3>
                  <p className="text-muted-foreground">{metrics.openTickets} tickets aguardando resposta</p>
                </div>
                <div className="flex gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos status</SelectItem>
                      <SelectItem value="open">Abertos</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="resolved">Resolvidos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`cursor-pointer transition-shadow hover:shadow-md ${
                      selectedTicket === ticket.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(ticket.channel)}
                            <span className="font-medium">#{ticket.id}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">{ticket.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityBadge(ticket.priority).variant}>
                            {getPriorityBadge(ticket.priority).text}
                          </Badge>
                          <Badge variant={getStatusBadge(ticket.status).variant}>
                            {getStatusBadge(ticket.status).text}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>Categoria: {ticket.category}</span>
                          <span>{ticket.messages} mensagens</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          Atualizado: {new Date(ticket.updated).toLocaleString()}
                        </div>
                      </div>
                      
                      {selectedTicket === ticket.id && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h5 className="font-medium mb-2">Última Mensagem:</h5>
                            <p className="text-sm">Olá, preciso de ajuda com minha entrega que está atrasada. Poderia verificar o status do pedido #12345?</p>
                          </div>
                          <div className="space-y-3">
                            <Textarea placeholder="Digite sua resposta..." />
                            <div className="flex items-center gap-3">
                              <Select>
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Alterar status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                                  <SelectItem value="resolved">Resolvido</SelectItem>
                                  <SelectItem value="closed">Fechado</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button>
                                <Send className="w-4 h-4 mr-2" />
                                Enviar Resposta
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Base de Clientes</h3>
                  <p className="text-muted-foreground">Informações e histórico dos clientes</p>
                </div>
                <div className="flex gap-3">
                  <Input placeholder="Buscar cliente..." className="w-64" />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {customers.map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{customer.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{customer.email}</span>
                              <span>{customer.phone}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={customer.status === 'vip' ? 'default' : 'secondary'}>
                          {customer.status === 'vip' ? 'VIP' : 'Regular'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-bold">{customer.totalOrders}</p>
                          <p className="text-xs text-muted-foreground">Pedidos</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-bold">R$ {customer.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Gasto Total</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-bold">{new Date(customer.lastOrder).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">Último Pedido</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-bold">{customer.tickets}</p>
                          <p className="text-xs text-muted-foreground">Tickets</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" size="sm">
                          <User className="w-4 h-4 mr-2" />
                          Ver Perfil
                        </Button>
                        <Button variant="outline" size="sm">
                          <Package className="w-4 h-4 mr-2" />
                          Histórico
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contatar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Chat em Tempo Real</h3>
                <p className="text-muted-foreground">{metrics.activeChats} conversas ativas</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                {/* Chat List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversas Ativas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Maria Silva</p>
                          <p className="text-sm text-muted-foreground">Sobre meu pedido...</p>
                        </div>
                        <span className="text-xs text-muted-foreground">2min</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">João Santos</p>
                          <p className="text-sm text-muted-foreground">Preciso de ajuda com...</p>
                        </div>
                        <span className="text-xs text-muted-foreground">5min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Maria Silva</p>
                          <p className="text-sm text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-3 mb-4 max-h-48 overflow-y-auto">
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Olá, preciso de ajuda com meu pedido #12345</p>
                          <span className="text-xs text-muted-foreground">14:30</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Olá Maria! Claro, vou verificar seu pedido agora mesmo.</p>
                          <span className="text-xs opacity-75">14:32</span>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Obrigada! O pedido estava previsto para chegar hoje.</p>
                          <span className="text-xs text-muted-foreground">14:35</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Digite sua mensagem..." className="flex-1" />
                      <Button size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Relatórios de Atendimento</h3>
                <p className="text-muted-foreground">Métricas e performance da equipe</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Tickets Resolvidos</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-green-600">{metrics.resolvedToday}</p>
                    <p className="text-sm text-muted-foreground mt-2">Hoje</p>
                    <div className="mt-4">
                      <Progress value={80} />
                      <p className="text-xs text-muted-foreground mt-1">80% da meta diária</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Tempo de Resposta</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{metrics.avgResponseTime}</p>
                    <p className="text-sm text-muted-foreground mt-2">Média</p>
                    <div className="mt-4">
                      <Badge variant="default">↓ 15min vs ontem</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Satisfação Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <p className="text-3xl font-bold text-yellow-600">{metrics.satisfactionRate}</p>
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">Avaliação média</p>
                    <div className="mt-4">
                      <Badge variant="default">↑ 0.2 vs mês anterior</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Escalações</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-orange-600">{metrics.escalatedTickets}</p>
                    <p className="text-sm text-muted-foreground mt-2">Este mês</p>
                    <div className="mt-4">
                      <Progress value={15} />
                      <p className="text-xs text-muted-foreground mt-1">15% do total</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance da Equipe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>LO</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Lucia Oliveira</p>
                            <p className="text-sm text-muted-foreground">Você</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">15 tickets</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.9</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>CS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Carlos Silva</p>
                            <p className="text-sm text-muted-foreground">Atendente</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">12 tickets</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categorias Mais Comuns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Problemas de Entrega</span>
                        <div className="flex items-center gap-2">
                          <Progress value={45} className="w-24" />
                          <span className="text-sm font-medium">45%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dúvidas sobre Produto</span>
                        <div className="flex items-center gap-2">
                          <Progress value={30} className="w-24" />
                          <span className="text-sm font-medium">30%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Trocas e Devoluções</span>
                        <div className="flex items-center gap-2">
                          <Progress value={25} className="w-24" />
                          <span className="text-sm font-medium">25%</span>
                        </div>
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