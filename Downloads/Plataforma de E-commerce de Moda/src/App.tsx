import { useState, useMemo } from 'react';
import { Product } from './types/product';
import { User, UserRole } from './types/user';
import { mockProducts } from './data/mockProducts';
import { mockUsers } from './data/mockUsers';
import { useCart } from './hooks/useCart';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductGrid } from './components/ProductGrid';
import { ProductFilters, FilterState } from './components/ProductFilters';
import { CartSheet } from './components/CartSheet';
import { ProductDialog } from './components/ProductDialog';
import { CheckoutDialog } from './components/CheckoutDialog';
import { AdminPanel } from './components/AdminPanel';
import { PremiumClientInterface } from './components/PremiumClientInterface';
import { SellerDashboard } from './components/SellerDashboard';
import { StoreOwnerInterface } from './components/StoreOwnerInterface';
import { WarehouseManagerPortal } from './components/WarehouseManagerPortal';
import { MarketingManagerDashboard } from './components/MarketingManagerDashboard';
import { CustomerServicePortal } from './components/CustomerServicePortal';
import { Button } from './components/ui/button';
import { Settings, ArrowLeft, Crown, Store, Palette, Package, Megaphone, Users, BarChart3, Heart, Briefcase, UserCheck, Headphones } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Toaster } from 'sonner';

export default function App() {
  const { itemCount } = useCart();
  
  // State management
  const [currentPage, setCurrentPage] = useState<'home' | 'products'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers.length > 0 ? mockUsers[0] : null); // Default to premium customer
  const [activeInterface, setActiveInterface] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 500],
    condition: [],
    inStock: false
  });

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(product.brand?.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.some(size => product.sizes.includes(size))) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.some(color => product.colors.includes(color))) {
        return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Condition filter
      if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  // Complete interface permissions based on user role
  const getAvailableInterfaces = (role: UserRole) => {
    const interfaces = [
      {
        id: 'premium_client',
        name: 'Premium Interface',
        description: 'Acesso VIP e benefícios exclusivos',
        icon: Crown,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        roles: ['premium_customer']
      },
      {
        id: 'seller_dashboard',
        name: 'Dashboard Vendedor',
        description: 'Gerencie produtos e vendas',
        icon: Store,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        roles: ['seller']
      },
      {
        id: 'store_owner_interface',
        name: 'Painel do Lojista',
        description: 'Gerencie sua loja e personalize o design',
        icon: Palette,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        roles: ['store_owner']
      },
      {
        id: 'warehouse_portal',
        name: 'Portal Estoque',
        description: 'Controle de inventário e movimentações',
        icon: Package,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        roles: ['warehouse_manager']
      },
      {
        id: 'marketing_dashboard',
        name: 'Dashboard Marketing',
        description: 'Campanhas e análise de audiência',
        icon: Megaphone,
        color: 'text-pink-600',
        bgColor: 'bg-pink-100',
        roles: ['marketing_manager']
      },
      {
        id: 'customer_service',
        name: 'Portal Atendimento',
        description: 'Suporte e gestão de clientes',
        icon: Headphones,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        roles: ['customer_service']
      },
      {
        id: 'analytics_dashboard',
        name: 'Dashboard Analytics',
        description: 'Relatórios e métricas detalhadas',
        icon: BarChart3,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        roles: ['analyst']
      },
      {
        id: 'brand_partner',
        name: 'Portal Parceiros',
        description: 'Colaboração com marcas',
        icon: Briefcase,
        color: 'text-teal-600',
        bgColor: 'bg-teal-100',
        roles: ['brand_partner']
      },
      {
        id: 'influencer_hub',
        name: 'Hub Influenciadores',
        description: 'Ferramentas para influencers',
        icon: Heart,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        roles: ['influencer']
      },
      {
        id: 'franchise_dashboard',
        name: 'Dashboard Franquia',
        description: 'Gestão de franqueados',
        icon: UserCheck,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-100',
        roles: ['franchise_owner']
      }
    ];

    return interfaces.filter(interfaceConfig => interfaceConfig.roles.includes(role));
  };

  // Navigation handlers
  const handleNavigateToHome = () => {
    setCurrentPage('home');
    setSearchQuery('');
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 500],
      condition: [],
      inStock: false
    });
  };

  const handleNavigateToProducts = (category?: string) => {
    setCurrentPage('products');
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  };

  // Event handlers
  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 500],
      condition: [],
      inStock: false
    });
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOpenCartFromProduct = () => {
    setIsCartOpen(true);
  };

  const handleUserChange = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setActiveInterface(null);
    }
  };

  const handleInterfaceOpen = (interfaceId: string) => {
    setActiveInterface(interfaceId);
  };

  const handleInterfaceClose = () => {
    setActiveInterface(null);
  };

  const renderInterface = () => {
    if (!currentUser) return null;

    switch (activeInterface) {
      case 'premium_client':
        return <PremiumClientInterface user={currentUser} onClose={handleInterfaceClose} />;
      case 'seller_dashboard':
        return <SellerDashboard onClose={handleInterfaceClose} />;
      case 'store_owner_interface':
        return <StoreOwnerInterface onClose={handleInterfaceClose} />;
      case 'warehouse_portal':
        return <WarehouseManagerPortal onClose={handleInterfaceClose} />;
      case 'marketing_dashboard':
        return <MarketingManagerDashboard onClose={handleInterfaceClose} />;
      case 'customer_service':
        return <CustomerServicePortal onClose={handleInterfaceClose} />;
      case 'analytics_dashboard':
        // Placeholder - would implement similar to others
        return (
          <Dialog open={true} onOpenChange={() => handleInterfaceClose()}>
            <DialogContent className="max-w-md text-center">
              <DialogHeader>
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <DialogTitle>Dashboard Analytics</DialogTitle>
                <DialogDescription>Interface em desenvolvimento</DialogDescription>
              </DialogHeader>
              <Button onClick={handleInterfaceClose}>Voltar</Button>
            </DialogContent>
          </Dialog>
        );
      case 'brand_partner':
        return (
          <Dialog open={true} onOpenChange={() => handleInterfaceClose()}>
            <DialogContent className="max-w-md text-center">
              <DialogHeader>
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <DialogTitle>Portal de Parceiros</DialogTitle>
                <DialogDescription>Interface em desenvolvimento</DialogDescription>
              </DialogHeader>
              <Button onClick={handleInterfaceClose}>Voltar</Button>
            </DialogContent>
          </Dialog>
        );
      case 'influencer_hub':
        return (
          <Dialog open={true} onOpenChange={() => handleInterfaceClose()}>
            <DialogContent className="max-w-md text-center">
              <DialogHeader>
                <Heart className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <DialogTitle>Hub de Influenciadores</DialogTitle>
                <DialogDescription>Interface em desenvolvimento</DialogDescription>
              </DialogHeader>
              <Button onClick={handleInterfaceClose}>Voltar</Button>
            </DialogContent>
          </Dialog>
        );
      case 'franchise_dashboard':
        return (
          <Dialog open={true} onOpenChange={() => handleInterfaceClose()}>
            <DialogContent className="max-w-md text-center">
              <DialogHeader>
                <UserCheck className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
                <DialogTitle>Dashboard de Franquia</DialogTitle>
                <DialogDescription>Interface em desenvolvimento</DialogDescription>
              </DialogHeader>
              <Button onClick={handleInterfaceClose}>Voltar</Button>
            </DialogContent>
          </Dialog>
        );
      default:
        return null;
    }
  };

  const availableInterfaces = currentUser ? getAvailableInterfaces(currentUser.role) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        cartItemCount={itemCount}
        onCartClick={handleCartClick}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onLogoClick={handleNavigateToHome}
        showSearch={currentPage === 'products'}
      />

      {/* User Selector Demo */}
      <div className="bg-muted/30 border-b p-4">
        <div className="container mx-auto flex items-center gap-4">
          <span className="text-sm font-medium">🎭 Demo - Simular perfil de usuário:</span>
          <Select value={currentUser?.id || ''} onValueChange={handleUserChange}>
            <SelectTrigger className="w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.length > 0 ? mockUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} - {user.role?.replace('_', ' ') || 'Usuário'} ({user.plan || 'Free'})
                </SelectItem>
              )) : (
                <SelectItem value="no-users" disabled>Nenhum usuário disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
          {currentUser && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentUser.role?.replace('_', ' ') || 'Usuário'}</Badge>
              <Badge variant="secondary">{currentUser.plan || 'Free'}</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Interface Access Panel */}
      {availableInterfaces.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b p-6">
          <div className="container mx-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Interfaces Especializadas para {currentUser?.name}</h3>
              <p className="text-muted-foreground">Clique em qualquer interface para explorar funcionalidades específicas do seu perfil</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {availableInterfaces.map(interfaceConfig => (
                <Card 
                  key={interfaceConfig.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/30"
                  onClick={() => handleInterfaceOpen(interfaceConfig.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${interfaceConfig.bgColor} shadow-sm`}>
                        <interfaceConfig.icon className={`w-6 h-6 ${interfaceConfig.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{interfaceConfig.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{interfaceConfig.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentPage === 'home' ? (
        <HomePage
          onNavigateToProducts={handleNavigateToProducts}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          cartItemCount={itemCount}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleNavigateToHome}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Main Content */}
            <main>
              {/* Results summary */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                  </h2>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground">
                      Resultados para "{searchQuery}"
                    </p>
                  )}
                  {filters.categories.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Categoria: {filters.categories.join(', ')}
                    </p>
                  )}
                  {itemCount > 0 && (
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCartClick}
                        className="text-primary border-primary hover:bg-primary/10"
                      >
                        🛒 {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho - Ver carrinho
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <ProductGrid
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </main>
          </div>
        </div>
      )}

      {/* Admin Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsAdminOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Painel Administrativo"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Modals and Sheets */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <ProductDialog
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={handleCloseProductDialog}
        onOpenCart={handleOpenCartFromProduct}
      />

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Specialized Interfaces */}
      {renderInterface()}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          },
        }}
      />
    </div>
  );
}