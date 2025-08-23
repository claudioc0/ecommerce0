import { useState } from 'react';
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  Instagram,
  Facebook,
  Globe,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Play,
  Pause,
  Edit,
  Copy,
  BarChart3,
  PieChart,
  Zap,
  Gift,
  Star,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface MarketingManagerDashboardProps {
  onClose: () => void;
}

export function MarketingManagerDashboard({ onClose }: MarketingManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const campaignPerformance = [
    { day: 'Seg', impressions: 12400, clicks: 340, conversions: 24 },
    { day: 'Ter', impressions: 15200, clicks: 420, conversions: 32 },
    { day: 'Qua', impressions: 11800, clicks: 380, conversions: 28 },
    { day: 'Qui', impressions: 18100, clicks: 520, conversions: 41 },
    { day: 'Sex', impressions: 22200, clicks: 680, conversions: 52 },
    { day: 'Sáb', impressions: 28800, clicks: 890, conversions: 68 },
    { day: 'Dom', impressions: 24500, clicks: 750, conversions: 45 }
  ];

  const channelData = [
    { name: 'Instagram', value: 35, color: '#E4405F', conversions: 150 },
    { name: 'Facebook', value: 28, color: '#1877F2', conversions: 120 },
    { name: 'Google Ads', value: 22, color: '#4285F4', conversions: 95 },
    { name: 'Email', value: 10, color: '#34A853', conversions: 45 },
    { name: 'Orgânico', value: 5, color: '#FF6B35', conversions: 20 }
  ];

  const activeCampaigns = [
    {
      id: 'CAMP001',
      name: 'Coleção Primavera 2025',
      type: 'social',
      status: 'active',
      budget: 5000,
      spent: 3200,
      impressions: 145000,
      clicks: 4200,
      conversions: 89,
      ctr: 2.9,
      cpc: 0.76,
      roas: 4.2,
      endDate: '2025-02-15'
    },
    {
      id: 'CAMP002',
      name: 'Liquidação Verão',
      type: 'google',
      status: 'active',
      budget: 3000,
      spent: 2800,
      impressions: 89000,
      clicks: 2100,
      conversions: 67,
      ctr: 2.4,
      cpc: 1.33,
      roas: 3.8,
      endDate: '2025-01-31'
    },
    {
      id: 'CAMP003',
      name: 'Email Newsletter',
      type: 'email',
      status: 'scheduled',
      budget: 500,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      roas: 0,
      endDate: '2025-02-01'
    }
  ];

  const customerSegments = [
    { name: 'Premium VIP', count: 1250, value: 'R$ 185.000', growth: '+12%' },
    { name: 'Compradores Frequentes', count: 3400, value: 'R$ 420.000', growth: '+8%' },
    { name: 'Novos Clientes', count: 890, value: 'R$ 45.000', growth: '+25%' },
    { name: 'Reativação', count: 560, value: 'R$ 28.000', growth: '+15%' }
  ];

  const upcomingCampaigns = [
    { name: 'Dia dos Namorados', date: '2025-02-10', type: 'Promocional', status: 'planning' },
    { name: 'Moda Sustentável', date: '2025-02-20', type: 'Awareness', status: 'design' },
    { name: 'Influencer Collab', date: '2025-03-01', type: 'Partnership', status: 'negotiating' }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: 'default' as const, text: 'Ativa', color: 'bg-green-500' },
      paused: { variant: 'secondary' as const, text: 'Pausada', color: 'bg-yellow-500' },
      scheduled: { variant: 'outline' as const, text: 'Agendada', color: 'bg-blue-500' },
      completed: { variant: 'secondary' as const, text: 'Finalizada', color: 'bg-gray-500' }
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const getCampaignIcon = (type: string) => {
    const iconMap = {
      social: <Instagram className="w-4 h-4" />,
      google: <Globe className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      influencer: <Users className="w-4 h-4" />
    };
    return iconMap[type as keyof typeof iconMap];
  };

  const metrics = {
    totalImpressions: 2890000,
    totalClicks: 89400,
    totalConversions: 2340,
    averageCTR: 3.1,
    averageCPC: 0.89,
    totalROAS: 4.5,
    activeCampaigns: 8,
    totalBudget: 25000,
    totalSpent: 18450
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl border">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard de Marketing</h1>
                <p className="text-pink-200">Marketing Manager - Carlos Oliveira</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas campanhas</SelectItem>
                  <SelectItem value="active">Campanhas ativas</SelectItem>
                  <SelectItem value="social">Redes sociais</SelectItem>
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
                <Eye className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-sm opacity-90">Impressões</p>
                  <p className="text-lg font-bold">{(metrics.totalImpressions / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-green-300" />
                <div>
                  <p className="text-sm opacity-90">CTR Médio</p>
                  <p className="text-lg font-bold">{metrics.averageCTR}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-300" />
                <div>
                  <p className="text-sm opacity-90">ROAS</p>
                  <p className="text-lg font-bold">{metrics.totalROAS}x</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-sm opacity-90">Conversões</p>
                  <p className="text-lg font-bold">{metrics.totalConversions.toLocaleString()}</p>
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
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              <TabsTrigger value="audience">Audiência</TabsTrigger>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="automation">Automação</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance das Campanhas (7 dias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={campaignPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} name="Impressões" />
                        <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Clicks" />
                        <Line type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} name="Conversões" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Channel Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Canais de Marketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {channelData.map((channel, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: channel.color }} />
                            <span className="font-medium">{channel.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{channel.value}%</p>
                            <p className="text-sm text-muted-foreground">{channel.conversions} conv</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Campaigns Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Campanhas Ativas - Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeCampaigns.filter(c => c.status === 'active').map((campaign) => (
                      <div key={campaign.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCampaignIcon(campaign.type)}
                            <h4 className="font-medium">{campaign.name}</h4>
                          </div>
                          <Badge variant={getStatusBadge(campaign.status).variant}>
                            {getStatusBadge(campaign.status).text}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget utilizado:</span>
                            <span>R$ {campaign.spent.toLocaleString()} / R$ {campaign.budget.toLocaleString()}</span>
                          </div>
                          <Progress value={(campaign.spent / campaign.budget) * 100} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-green-600">{campaign.ctr}%</p>
                            <p className="text-xs text-muted-foreground">CTR</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-blue-600">{campaign.roas}x</p>
                            <p className="text-xs text-muted-foreground">ROAS</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Campanhas</h3>
                  <p className="text-muted-foreground">{metrics.activeCampaigns} campanhas ativas</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button>
                    <Megaphone className="w-4 h-4 mr-2" />
                    Nova Campanha
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {activeCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getCampaignIcon(campaign.type)}
                          </div>
                          <div>
                            <h4 className="font-bold">{campaign.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {campaign.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusBadge(campaign.status).variant}>
                            {getStatusBadge(campaign.status).text}
                          </Badge>
                          <div className="flex gap-2">
                            {campaign.status === 'active' ? (
                              <Button size="sm" variant="outline">
                                <Pause className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{(campaign.impressions / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">Impressões</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{campaign.clicks.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{campaign.conversions}</p>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{campaign.ctr}%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">R$ {campaign.cpc.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">CPC</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{campaign.roas}x</p>
                          <p className="text-xs text-muted-foreground">ROAS</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Orçamento:</span>
                            <span>R$ {campaign.spent.toLocaleString()} / R$ {campaign.budget.toLocaleString()}</span>
                          </div>
                          <Progress value={(campaign.spent / campaign.budget) * 100} />
                        </div>
                        <div className="ml-6 text-right">
                          <p className="text-sm text-muted-foreground">Termina em:</p>
                          <p className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Análise de Audiência</h3>
                <p className="text-muted-foreground">Segmentação e comportamento dos clientes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {customerSegments.map((segment, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                      <CardDescription>{segment.count.toLocaleString()} clientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Valor total:</span>
                          <span className="font-bold">{segment.value}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Crescimento:</span>
                          <Badge variant="default" className="text-green-600">
                            {segment.growth}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          Criar Campanha
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jornada do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>Awareness</span>
                        </div>
                        <span className="font-bold">125,000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <MousePointer className="w-4 h-4 text-green-600" />
                          </div>
                          <span>Interesse</span>
                        </div>
                        <span className="font-bold">45,200</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span>Consideração</span>
                        </div>
                        <span className="font-bold">12,800</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4 text-purple-600" />
                          </div>
                          <span>Conversão</span>
                        </div>
                        <span className="font-bold">2,340</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Campanhas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingCampaigns.map((campaign, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{campaign.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(campaign.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{campaign.type}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{campaign.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Criação de Conteúdo</h3>
                <p className="text-muted-foreground">Ferramentas para criar posts e campanhas</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Novo Post para Redes Sociais</CardTitle>
                    <CardDescription>Crie conteúdo para Instagram e Facebook</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Texto do post</label>
                      <Textarea placeholder="Escreva sua mensagem..." className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hashtags sugeridas</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['#moda', '#estilo', '#roupas', '#fashion', '#lookdodia'].map((tag) => (
                          <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch id="schedule" />
                        <label htmlFor="schedule" className="text-sm">Agendar publicação</label>
                      </div>
                      <Input type="datetime-local" className="w-auto" />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Instagram className="w-4 h-4 mr-2" />
                        Publicar no Instagram
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Facebook className="w-4 h-4 mr-2" />
                        Publicar no Facebook
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Campanha de E-mail</CardTitle>
                    <CardDescription>Crie newsletters e campanhas de e-mail</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Assunto do e-mail</label>
                      <Input placeholder="Ex: Nova Coleção Primavera 2025!" className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Segmento de clientes</label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione o público-alvo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os clientes</SelectItem>
                          <SelectItem value="premium">Clientes Premium</SelectItem>
                          <SelectItem value="new">Novos clientes</SelectItem>
                          <SelectItem value="inactive">Clientes inativos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Template</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" size="sm">Newsletter</Button>
                        <Button variant="outline" size="sm">Promoção</Button>
                        <Button variant="outline" size="sm">Abandono</Button>
                        <Button variant="outline" size="sm">Bem-vindo</Button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        Salvar Rascunho
                      </Button>
                      <Button className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Automação de Marketing</h3>
                <p className="text-muted-foreground">Configure fluxos automáticos para seus clientes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      Boas-vindas
                    </CardTitle>
                    <CardDescription>Sequência para novos cadastros</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant="default">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Taxa abertura:</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conversões:</span>
                        <span className="font-medium">156</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Editar Fluxo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      Carrinho Abandonado
                    </CardTitle>
                    <CardDescription>Recuperação de vendas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant="default">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Taxa recuperação:</span>
                        <span className="font-medium">24%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Receita recuperada:</span>
                        <span className="font-medium">R$ 18.400</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Editar Fluxo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      Pós-compra
                    </CardTitle>
                    <CardDescription>Follow-up e avaliações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant="secondary">Pausado</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avaliações:</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Recompras:</span>
                        <span className="font-medium">32%</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Ativar Fluxo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Automação</CardTitle>
                  <CardDescription>Configure um novo fluxo de automação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="w-6 h-6 mb-2" />
                      Segmentação
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Calendar className="w-6 h-6 mb-2" />
                      Aniversário
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <TrendingUp className="w-6 h-6 mb-2" />
                      Reativação
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Gift className="w-6 h-6 mb-2" />
                      Cross-sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}