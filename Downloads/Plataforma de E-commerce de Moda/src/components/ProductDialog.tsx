import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Check, X } from 'lucide-react';
import { Product } from '../types/product';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { useCart } from '../hooks/useCart';
import { ImageWithFallback } from './image/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export function ProductDialog({ product, isOpen, onClose, onOpenCart }: ProductDialogProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem, itemCount } = useCart();

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setCurrentImageIndex(0);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Por favor, selecione tamanho e cor');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cartItem = {
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    };
    
    console.log('Adicionando item ao carrinho:', cartItem);
    addItem(cartItem);
    
    toast.success(
      `${product.name} adicionado ao carrinho!`,
      {
        description: `Tamanho: ${selectedSize}, Cor: ${getColorDisplayName(selectedColor)}, Quantidade: ${quantity}`,
        action: onOpenCart ? {
          label: 'Ver carrinho',
          onClick: () => {
            onClose();
            onOpenCart();
          }
        } : undefined
      }
    );
    
    setIsAddingToCart(false);
    onClose();
  };

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Por favor, selecione tamanho e cor');
      return;
    }
    
    await handleAddToCart();
    // Here you would trigger the checkout flow
    if (onOpenCart) {
      setTimeout(() => {
        onOpenCart();
        toast.info('Revise seus itens e finalize a compra');
      }, 1000);
    }
  };

  const canAddToCart = selectedSize && selectedColor && product.inStock;
  const showSizeError = !selectedSize && (selectedColor || quantity > 1);
  const showColorError = !selectedColor && (selectedSize || quantity > 1);

  const colorDisplayNames: Record<string, string> = {
    'red': 'Vermelho',
    'blue': 'Azul',
    'green': 'Verde',
    'black': 'Preto',
    'white': 'Branco',
    'pink': 'Rosa',
    'yellow': 'Amarelo',
    'purple': 'Roxo',
    'orange': 'Laranja',
    'gray': 'Cinza',
    'brown': 'Marrom',
    'navy': 'Azul Marinho'
  };

  const getColorDisplayName = (color: string) => {
    return colorDisplayNames[color.toLowerCase()] || color;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-left">{product.name}</DialogTitle>
          <DialogDescription className="text-left">
            Veja todos os detalhes do produto e escolha tamanho e cor para adicionar ao carrinho.
            {itemCount > 0 && (
              <span className="block mt-1 text-primary">
                🛒 Você tem {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 relative">
              <ImageWithFallback
                src={product.images[currentImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-3 left-3">
                  <Badge variant="destructive" className="text-xs px-2 py-1">
                    -{discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border-2 transition-colors ${
                      currentImageIndex === index ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h1>{product.name}</h1>
                  {product.brand && (
                    <p className="text-muted-foreground">{product.brand}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8) • 127 avaliações</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {product.originalPrice!.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                {product.condition === 'used' && (
                  <Badge variant="secondary">Usado</Badge>
                )}
                {product.condition === 'excellent' && (
                  <Badge variant="secondary">Semi-novo</Badge>
                )}
                {product.condition === 'new' && (
                  <Badge variant="outline">Novo</Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive">Esgotado</Badge>
                )}
              </div>
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <Separator />

            {/* Size Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3>Tamanho</h3>
                {showSizeError && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <X className="w-3 h-3" />
                    <span>Selecione um tamanho</span>
                  </div>
                )}
                {selectedSize && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-3 h-3" />
                    <span>{selectedSize} selecionado</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] transition-all ${
                      selectedSize === size ? 'ring-2 ring-primary/20' : ''
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3>Cor</h3>
                {showColorError && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <X className="w-3 h-3" />
                    <span>Selecione uma cor</span>
                  </div>
                )}
                {selectedColor && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-3 h-3" />
                    <span>{getColorDisplayName(selectedColor)} selecionado</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`transition-all ${
                      selectedColor === color ? 'ring-2 ring-primary/20' : ''
                    }`}
                  >
                    {getColorDisplayName(color)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="mb-3">Quantidade</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  (máx. 10 unidades)
                </span>
              </div>
            </div>

            <Separator />

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart || isAddingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {isAddingToCart 
                  ? 'Adicionando...'
                  : !selectedSize || !selectedColor 
                    ? 'Selecione tamanho e cor' 
                    : !product.inStock 
                      ? 'Produto esgotado'
                      : 'Adicionar ao carrinho'
                }
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleBuyNow}
                disabled={!canAddToCart || isAddingToCart}
              >
                Comprar agora
              </Button>
            </div>

            {/* Quick Cart Info */}
            {itemCount > 0 && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    🛒 {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
                  </span>
                  {onOpenCart && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                    >
                      Ver carrinho
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Frete grátis para compras acima de R$ 200</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Compra 100% segura e protegida</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-orange-600" />
                <span>30 dias para trocas e devoluções</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}