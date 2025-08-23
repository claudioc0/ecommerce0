import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types/product';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './image/ImageWithFallback';

interface ProductListItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export function ProductListItem({ product, onAddToCart, onClick }: ProductListItemProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-24 h-32 flex-shrink-0">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => onClick(product)}
            />
            {hasDiscount && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 text-xs h-5 px-1"
              >
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 cursor-pointer" onClick={() => onClick(product)}>
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                )}
              </div>
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(4.8)</span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              {product.condition === 'used' && (
                <Badge variant="secondary" className="text-xs">Usado</Badge>
              )}
              {product.condition === 'excellent' && (
                <Badge variant="secondary" className="text-xs">Semi-novo</Badge>
              )}
              {!product.inStock && (
                <Badge variant="outline" className="text-xs">Esgotado</Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
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

              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={!product.inStock}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}