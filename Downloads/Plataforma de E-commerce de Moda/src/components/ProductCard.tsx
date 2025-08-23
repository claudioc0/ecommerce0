import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types/product';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './image/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => onClick(product)}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                -{discountPercentage}%
              </Badge>
            )}
            {product.condition === 'used' && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                Usado
              </Badge>
            )}
            {product.condition === 'excellent' && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                Semi-novo
              </Badge>
            )}
            {product.condition === 'new' && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-background/80 backdrop-blur-sm">
                Novo
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                Esgotado
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background">
              <Heart className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                onClick(product);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <Button 
              size="sm" 
              className="w-full bg-primary/90 backdrop-blur-sm hover:bg-primary"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              disabled={!product.inStock}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.inStock ? 'Selecionar opções' : 'Esgotado'}
            </Button>
          </div>

          {/* Stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  Produto Esgotado
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2" onClick={() => onClick(product)}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-2 flex-1 leading-tight">{product.name}</h3>
          </div>

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
            <span className="font-semibold text-lg">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice!.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          {/* Size and color info */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 3).map((size) => (
                <Badge key={size} variant="outline" className="text-xs px-1.5 py-0.5">
                  {size}
                </Badge>
              ))}
              {product.sizes.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{product.sizes.length - 3}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.colors.length} {product.colors.length === 1 ? 'cor' : 'cores'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}