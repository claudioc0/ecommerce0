import { useState } from 'react';
import { X, Store, Palette, BarChart3, Settings, Package, Users, TrendingUp, ShoppingBag, Eye, Paintbrush, Monitor, Smartphone, Save, Plus, Trash2, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useStoreTheme, StoreTheme } from '../hooks/useStoreTheme';
import { toast } from 'sonner@2.0.3';

interface StoreOwnerInterfaceProps {
  onClose: () => void;
}

export function StoreOwnerInterface({ onClose }: StoreOwnerInterfaceProps) {
  const { currentTheme, getAllThemes, applyTheme, saveCustomTheme, deleteCustomTheme } = useStoreTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    name: 'Minha Loja Fashion',
    description: 'A melhor loja de roupas da região com produtos de qualidade e atendimento excepcional.',
    whatsapp: '(11) 99999-9999',
    email: 'contato@minhaloja.com',
    address: 'Rua das Flores, 123 - Centro',
    instagram: '@minhalojafashion',
    website: 'www.minhaloja.com'
  });

  // Custom theme editor state
  const [customTheme, setCustomTheme] = useState<Partial<StoreTheme>>({
    name: '',
    description: '',
    colors: {
      primary: '#030213',
      secondary: '#f1f5f9',
      accent: '#3b82f6',
      background: '#ffffff',
      card: '#ffffff',
      text: '#1e293b',
      muted: '#64748b'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    borderRadius: 'lg',
    layout: 'modern'
  });

  const mockStats = {
    totalSales: 'R$ 25.480,00',
    totalOrders: 142,
    totalProducts: 89,
    totalCustomers: 67,
    conversionRate: '3.2%',
    avgOrderValue: 'R$ 179,00',
    monthlyGrowth: '+15%',
    topCategory: 'Vestidos'
  };

  const handleStoreInfoChange = (field: string, value: string) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomThemeChange = (section: string, field: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveCustomTheme = () => {
    if (!customTheme.name || !customTheme.description) {
      toast.error('Por favor, preencha o nome e descrição do tema');
      return;
    }

    const newTheme: StoreTheme = {
      id: `custom-${Date.now()}`,
      name: customTheme.name,
      description: customTheme.description,
      colors: customTheme.colors!,
      fonts: customTheme.fonts!,
      borderRadius: customTheme.borderRadius!,
      layout: customTheme.layout!
    };

    saveCustomTheme(newTheme);
    toast.success('Tema personalizado salvo com sucesso!');
    
    // Reset form
    setCustomTheme({
      name: '',
      description: '',
      colors: {
        primary: '#030213',
        secondary: '#f1f5f9',
        accent: '#3b82f6',
        background: '#ffffff',
        card: '#ffffff',
        text: '#1e293b',
        muted: '#64748b'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      borderRadius: 'lg',
      layout: 'modern'
    });
  };

  const exportTheme = (theme: StoreTheme) => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Tema exportado com sucesso!');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Painel do Lojista</h2>
              <p className="text-sm text-muted-foreground">Gerencie sua loja e personalize o design</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {isPreviewMode ? 'Sair da Prévia' : 'Prévia da Loja'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="store-settings" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </TabsTrigger>
                <TabsTrigger value="theme-gallery" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Galeria de Temas
                </TabsTrigger>
                <TabsTrigger value="theme-editor" className="gap-2">
                  <Paintbrush className="w-4 h-4" />
                  Editor de Temas
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Monitor className="w-4 h-4" />
                  Prévia
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">Vendas Totais</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{mockStats.totalSales}</div>
                      <p className="text-xs text-muted-foreground">
                        {mockStats.monthlyGrowth} vs mês passado
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">Pedidos</CardTitle>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        Ticket médio: {mockStats.avgOrderValue}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">Produtos</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
                      <p className="text-xs text-muted-foreground">
                        Categoria top: {mockStats.topCategory}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">Clientes</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockStats.totalCustomers}</div>
                      <p className="text-xs text-muted-foreground">
                        Conversão: {mockStats.conversionRate}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status da Loja</CardTitle>
                      <CardDescription>Informações gerais sobre sua loja</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Loja Online</span>
                        <Badge variant="success">Ativa</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tema Atual</span>
                        <Badge variant="outline">{currentTheme.name}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Produtos Ativos</span>
                        <span className="font-medium">{mockStats.totalProducts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Última Venda</span>
                        <span className="text-sm text-muted-foreground">Há 2 horas</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ações Rápidas</CardTitle>
                      <CardDescription>Tarefas importantes para sua loja</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Palette className="w-4 h-4 mr-2" />
                        Personalizar Tema
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Ver Relatórios
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar Pagamentos
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Store Settings Tab */}
              <TabsContent value="store-settings" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Loja</CardTitle>
                    <CardDescription>Configure as informações básicas da sua loja</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Nome da Loja</Label>
                        <Input
                          id="store-name"
                          value={storeInfo.name}
                          onChange={(e) => handleStoreInfoChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-email">Email</Label>
                        <Input
                          id="store-email"
                          type="email"
                          value={storeInfo.email}
                          onChange={(e) => handleStoreInfoChange('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-whatsapp">WhatsApp</Label>
                        <Input
                          id="store-whatsapp"
                          value={storeInfo.whatsapp}
                          onChange={(e) => handleStoreInfoChange('whatsapp', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-instagram">Instagram</Label>
                        <Input
                          id="store-instagram"
                          value={storeInfo.instagram}
                          onChange={(e) => handleStoreInfoChange('instagram', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Descrição</Label>
                      <Textarea
                        id="store-description"
                        value={storeInfo.description}
                        onChange={(e) => handleStoreInfoChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="store-address">Endereço</Label>
                      <Input
                        id="store-address"
                        value={storeInfo.address}
                        onChange={(e) => handleStoreInfoChange('address', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="store-website">Website</Label>
                      <Input
                        id="store-website"
                        value={storeInfo.website}
                        onChange={(e) => handleStoreInfoChange('website', e.target.value)}
                      />
                    </div>

                    <Button className="w-full md:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                    <CardDescription>Opções avançadas para sua loja</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Loja Online Ativa</Label>
                        <p className="text-sm text-muted-foreground">Permitir que clientes vejam e comprem produtos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo Manutenção</Label>
                        <p className="text-sm text-muted-foreground">Temporariamente desabilitar a loja</p>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Permitir Avaliações</Label>
                        <p className="text-sm text-muted-foreground">Clientes podem avaliar produtos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Permitir inscrição em newsletter</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Theme Gallery Tab */}
              <TabsContent value="theme-gallery" className="mt-0 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Galeria de Temas</h3>
                    <p className="text-sm text-muted-foreground">Escolha um tema pré-definido para sua loja</p>
                  </div>
                  <Badge variant="outline">Tema Atual: {currentTheme.name}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getAllThemes().map((theme) => (
                    <Card 
                      key={theme.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        currentTheme.id === theme.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{theme.name}</CardTitle>
                          {currentTheme.id === theme.id && (
                            <Badge variant="default" className="text-xs">Ativo</Badge>
                          )}
                        </div>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Theme Preview */}
                        <div className="h-24 rounded-lg border overflow-hidden" style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`
                        }}>
                          <div className="h-full flex items-center justify-center">
                            <div 
                              className="w-16 h-12 rounded shadow-sm"
                              style={{ backgroundColor: theme.colors.card }}
                            />
                          </div>
                        </div>

                        {/* Color Palette */}
                        <div className="flex gap-1">
                          {Object.entries(theme.colors).slice(0, 5).map(([key, color]) => (
                            <div
                              key={key}
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: color }}
                              title={key}
                            />
                          ))}
                        </div>

                        {/* Theme Info */}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Layout: {theme.layout}</span>
                          <span>Bordas: {theme.borderRadius}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant={currentTheme.id === theme.id ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => applyTheme(theme)}
                          >
                            {currentTheme.id === theme.id ? 'Ativo' : 'Aplicar'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportTheme(theme)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {theme.id.startsWith('custom-') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCustomTheme(theme.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Theme Editor Tab */}
              <TabsContent value="theme-editor" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Editor de Temas Personalizado</h3>
                  <p className="text-sm text-muted-foreground">Crie seu próprio tema personalizado</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Tema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme-name">Nome do Tema</Label>
                        <Input
                          id="theme-name"
                          value={customTheme.name}
                          onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Meu Tema Personalizado"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="theme-description">Descrição</Label>
                        <Textarea
                          id="theme-description"
                          value={customTheme.description}
                          onChange={(e) => setCustomTheme(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descreva seu tema..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Layout</Label>
                          <Select
                            value={customTheme.layout}
                            onValueChange={(value) => handleCustomThemeChange('layout', '', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="modern">Moderno</SelectItem>
                              <SelectItem value="classic">Clássico</SelectItem>
                              <SelectItem value="minimal">Minimalista</SelectItem>
                              <SelectItem value="bold">Arrojado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Bordas</Label>
                          <Select
                            value={customTheme.borderRadius}
                            onValueChange={(value) => handleCustomThemeChange('borderRadius', '', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem bordas</SelectItem>
                              <SelectItem value="sm">Pequena</SelectItem>
                              <SelectItem value="md">Média</SelectItem>
                              <SelectItem value="lg">Grande</SelectItem>
                              <SelectItem value="xl">Extra Grande</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cores do Tema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(customTheme.colors || {}).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={`color-${key}`} className="capitalize">
                              {key === 'primary' ? 'Principal' :
                               key === 'secondary' ? 'Secundária' :
                               key === 'accent' ? 'Destaque' :
                               key === 'background' ? 'Fundo' :
                               key === 'card' ? 'Cartão' :
                               key === 'text' ? 'Texto' :
                               key === 'muted' ? 'Texto Suave' : key}
                            </Label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                id={`color-${key}`}
                                value={value}
                                onChange={(e) => handleCustomThemeChange('colors', key, e.target.value)}
                                className="w-12 h-10 rounded border cursor-pointer"
                              />
                              <Input
                                value={value}
                                onChange={(e) => handleCustomThemeChange('colors', key, e.target.value)}
                                className="font-mono text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveCustomTheme} className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Tema Personalizado
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Importar Tema
                  </Button>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-0 space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Prévia da Loja</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja como sua loja ficará com o tema atual: <strong>{currentTheme.name}</strong>
                  </p>
                  
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Monitor className="w-4 h-4" />
                      Desktop
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Smartphone className="w-4 h-4" />
                      Mobile
                    </Button>
                  </div>
                </div>

                {/* Store Preview */}
                <Card className="overflow-hidden">
                  <div 
                    className="h-[400px] bg-gradient-to-br from-background to-muted/50 p-6 border-b"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.secondary} 100%)`
                    }}
                  >
                    <div className="max-w-6xl mx-auto">
                      {/* Preview Header */}
                      <div 
                        className="flex items-center justify-between p-4 rounded-lg shadow-sm mb-6"
                        style={{ backgroundColor: currentTheme.colors.card }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          />
                          <span 
                            className="font-bold"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {storeInfo.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: currentTheme.colors.accent }}
                          />
                          <div 
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          />
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className="p-4 rounded-lg shadow-sm"
                            style={{ backgroundColor: currentTheme.colors.card }}
                          >
                            <div 
                              className="w-full h-32 rounded mb-3"
                              style={{ backgroundColor: currentTheme.colors.secondary }}
                            />
                            <div 
                              className="h-4 rounded mb-2"
                              style={{ backgroundColor: currentTheme.colors.text, opacity: 0.8 }}
                            />
                            <div 
                              className="h-3 rounded w-2/3"
                              style={{ backgroundColor: currentTheme.colors.muted }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Tema: {currentTheme.name} • Layout: {currentTheme.layout}
                      </span>
                      <Button size="sm" onClick={() => applyTheme(currentTheme)}>
                        Aplicar Este Tema
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}