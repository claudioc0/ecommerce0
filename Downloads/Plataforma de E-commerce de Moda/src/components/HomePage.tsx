import { useState } from 'react';
import { ArrowRight, Truck, Shield, RotateCcw, Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './image/ImageWithFallback';
import { mockProducts } from '../data/mockProducts';
import { Product } from '../types/product';

interface HomePageProps {
  onNavigateToProducts: (category?: string) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  cartItemCount: number;
}

export function HomePage({ onNavigateToProducts, onAddToCart, onProductClick, cartItemCount }: HomePageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Get featured products (first 8 products)
  const featuredProducts = mockProducts.slice(0, 8);
  
  // Get products on sale
  const saleProducts = mockProducts.filter(product => 
    product.originalPrice && product.originalPrice > product.price
  ).slice(0, 4);

  const categories = [
    {
      id: 'camisetas',
      name: 'Camisetas',
      description: 'Conforto e estilo para o dia a dia',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0c2hpcnQlMjBmYXNoaW9ufGVufDF8fHx8MTc1NTYwOTk0NXww&ixlib=rb-4.1.0&q=80&w=1080',
      count: mockProducts.filter(p => p.category === 'camisetas').length
    },
    {
      id: 'vestidos',
      name: 'Vestidos',
      description: 'Elegância para todas as ocasiões',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTU2MDk5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: mockProducts.filter(p => p.category === 'vestidos').length
    },
    {
      id: 'calcas',
      name: 'Calças',
      description: 'Versatilidade e conforto',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW50cyUyMGZhc2hpb258ZW58MXx8fHwxNzU1NjA5OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: mockProducts.filter(p => p.category === 'calças').length
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      description: 'Finalize seu look com estilo',
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2Nlc3NvcmllcyUyMGZhc2hpb258ZW58MXx8fHwxNzU1NjA5OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: mockProducts.filter(p => p.category === 'acess��rios').length
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1672191265955-148f2058c389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RvcmUlMjBiYW5uZXIlMjBtb2Rlcm58ZW58MXx8fHwxNzU1NjA5OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Clothes Store Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Moda que
              <span className="block text-primary-foreground">Inspira</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Descubra as últimas tendências em moda e encontre seu estilo único na nossa coleção exclusiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100"
                onClick={() => onNavigateToProducts()}
              >
                Explorar Coleção
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-white/10 backdrop-blur-sm"
                onClick={() => onNavigateToProducts()}
              >
                Ver Ofertas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Frete Grátis</h3>
              <p className="text-muted-foreground">
                Frete grátis em compras acima de R$ 200. Receba em casa com rapidez e segurança.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
              <p className="text-muted-foreground">
                Sua compra 100% protegida com certificado de segurança e garantia de qualidade.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trocas Fáceis</h3>
              <p className="text-muted-foreground">
                30 dias para trocas e devoluções. Satisfação garantida ou seu dinheiro de volta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Nossas Categorias</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa ampla variedade de produtos para todos os estilos e ocasiões
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="group cursor-pointer overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onNavigateToProducts(category.id)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-200 mb-2">{category.description}</p>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {category.count} produtos
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Produtos em Destaque</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seleção especial dos nossos produtos mais populares e bem avaliados
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] overflow-hidden rounded-t-lg relative">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => onProductClick(product)}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Badge variant="destructive" className="text-xs">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Quick Add */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        className="w-full bg-white/90 text-black hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2" onClick={() => onProductClick(product)}>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(4.8)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => onNavigateToProducts()}
              className="px-8"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">🔥 Ofertas Especiais</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Aproveite nossas promoções exclusivas com descontos imperdíveis
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:shadow-xl transition-shadow bg-white">
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] overflow-hidden rounded-t-lg relative">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => onProductClick(product)}
                      />
                      
                      <div className="absolute top-3 left-3">
                        <Badge variant="destructive" className="text-xs font-bold">
                          -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Aproveitar Oferta
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-2" onClick={() => onProductClick(product)}>
                      <h3 className="font-semibold line-clamp-2 text-black">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-red-600">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.originalPrice!.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Fique por Dentro das Novidades</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Receba em primeira mão nossas promoções exclusivas e lançamentos
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Inscrever-se
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            Prometemos não enviar spam. Você pode cancelar a qualquer momento.
          </p>
        </div>
      </section>
    </div>
  );
}