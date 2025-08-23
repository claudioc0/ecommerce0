import { useState } from 'react';
import { Crown, Star, Gift, Calendar, Users, ShoppingBag, CreditCard, Award, Heart, MessageCircle, Truck, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './image/ImageWithFallback';
import { Product } from '../types/product';
import { User } from '../types/user';

interface PremiumClientInterfaceProps {
  user: User;
  onClose: () => void;
}

export function PremiumClientInterface({ user, onClose }: PremiumClientInterfaceProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const exclusiveProducts = [
    {
      id: 'exc1',
      name: 'Vestido de Gala Limited Edition',
      price: 890.00,
      originalPrice: 1200.00,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTU2MDk5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      exclusiveDiscount: 25,
      stock: 3
    },
    {
      id: 'exc2',
      name: 'Blazer Premium Collection',
      price: 650.00,
      originalPrice: 850.00,
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW50cyUyMGZhc2hpb258ZW58MXx8fHwxNzU1NjA5OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      exclusiveDiscount: 23,
      stock: 5
    }
  ];

  const personalStylist = {
    name: 'Isabella Rodrigues',
    title: 'Personal Stylist Exclusiva',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b287?w=150&h=150&fit=crop&crop=face'
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Fashion Show Exclusivo',
      date: '2025-02-15',
      description: 'Preview da nova coleção primavera/verão',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Styling Session Pessoal',
      date: '2025-02-20',
      description: 'Consultoria personalizada com sua stylist',
      status: 'pending'
    }
  ];

  const loyaltyProgress = (user.metrics?.loyaltyPoints || 0) / 5000 * 100;
  const nextTierPoints = 5000 - (user.metrics?.loyaltyPoints || 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl border border-purple-200/50">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-6 text-white rounded-t-2xl">
          <div className="absolute inset-0 bg-black/20 rounded-t-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Crown className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Premium Member Dashboard</h1>
                  <p className="text-purple-200">Bem-vinda, {user.name}</p>
                </div>
              </div>
              <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
                ✕
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <div>
                      <p className="text-sm opacity-90">Loyalty Points</p>
                      <p className="text-xl font-bold">{user.metrics?.loyaltyPoints?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-300" />
                    <div>
                      <p className="text-sm opacity-90">Total Compras</p>
                      <p className="text-xl font-bold">{user.metrics?.totalPurchases}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-300" />
                    <div>
                      <p className="text-sm opacity-90">Total Gasto</p>
                      <p className="text-xl font-bold">R$ {user.metrics?.totalSpent?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-300" />
                    <div>
                      <p className="text-sm opacity-90">Referências</p>
                      <p className="text-xl font-bold">{user.metrics?.referralCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Premium Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/70 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-100">Dashboard</TabsTrigger>
              <TabsTrigger value="exclusive" className="data-[state=active]:bg-purple-100">Exclusivos</TabsTrigger>
              <TabsTrigger value="stylist" className="data-[state=active]:bg-purple-100">Stylist</TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-purple-100">Eventos</TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-100">Recompensas</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loyalty Progress */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-600" />
                      Status Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progresso para Elite</span>
                        <span>{nextTierPoints} pontos restantes</span>
                      </div>
                      <Progress value={loyaltyProgress} className="h-3" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <Star className="w-3 h-3 mr-1" />
                        Premium Member
                      </Badge>
                      <span className="text-sm text-muted-foreground">desde {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Benefits */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <CardTitle>Benefícios Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Truck className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Frete Grátis Premium</p>
                          <p className="text-sm text-muted-foreground">Em qualquer compra</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Gift className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Descontos Exclusivos</p>
                          <p className="text-sm text-muted-foreground">Até 30% em peças selecionadas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium">Atendimento Prioritário</p>
                          <p className="text-sm text-muted-foreground">Suporte 24/7 dedicado</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Exclusive Products Tab */}
            <TabsContent value="exclusive" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Coleção Exclusiva Premium
                </h3>
                <p className="text-muted-foreground">Peças únicas disponíveis apenas para membros Premium</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exclusiveProducts.map((product) => (
                  <Card key={product.id} className="bg-white/80 backdrop-blur-sm border-purple-200 overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Exclusivo
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                        -{product.exclusiveDiscount}%
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-purple-600">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          Apenas {product.stock} unidades restantes
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Comprar Agora
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Personal Stylist Tab */}
            <TabsContent value="stylist" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={personalStylist.avatar} alt={personalStylist.name} />
                      <AvatarFallback>IS</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{personalStylist.name}</CardTitle>
                      <CardDescription>{personalStylist.title}</CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">(4.9/5)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Sua stylist pessoal está disponível para criar looks exclusivos baseados no seu estilo e preferências.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Conversar Agora
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Agendar Sessão
                    </Button>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Última Recomendação</h4>
                    <p className="text-sm text-muted-foreground">
                      "Baseado no seu perfil, recomendo investir em blazers estruturados para combinar com suas peças atuais. 
                      A coleção premium tem opções perfeitas!"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Eventos Exclusivos</h3>
                <p className="text-muted-foreground">Eventos e experiências reservadas para membros Premium</p>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="bg-white/80 backdrop-blur-sm border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-bold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-sm text-purple-600 font-medium">
                              {new Date(event.date).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                          {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Central de Recompensas</h3>
                <p className="text-muted-foreground">Troque seus pontos por benefícios exclusivos</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Gift className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bold mb-2">Desconto 50%</h4>
                    <p className="text-sm text-muted-foreground mb-4">Em qualquer produto da loja</p>
                    <Badge className="mb-4">1000 pontos</Badge>
                    <Button size="sm" className="w-full">Resgatar</Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold mb-2">Look Completo</h4>
                    <p className="text-sm text-muted-foreground mb-4">Styling session + outfit completo</p>
                    <Badge className="mb-4">2500 pontos</Badge>
                    <Button size="sm" className="w-full">Resgatar</Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-bold mb-2">Upgrade Elite</h4>
                    <p className="text-sm text-muted-foreground mb-4">Acesso ao tier mais alto</p>
                    <Badge className="mb-4">5000 pontos</Badge>
                    <Button size="sm" className="w-full">Resgatar</Button>
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