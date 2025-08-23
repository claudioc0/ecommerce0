import { Minus, Plus, ShoppingBag, Trash2, Tag, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { ImageWithFallback } from './image/ImageWithFallback';
import { toast } from 'sonner';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSheet({ isOpen, onClose, onCheckout }: CartSheetProps) {
  const { 
    items, 
    subtotal, 
    shipping, 
    discount, 
    total, 
    appliedCoupon,
    updateQuantity, 
    removeItem, 
    applyCoupon, 
    removeCoupon,
    itemCount 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

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

  const handleApplyCoupon = () => {
    setCouponError('');
    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
      toast.success('Cupom aplicado com sucesso!');
    } else {
      setCouponError('Cupom inválido ou expirado');
      toast.error('Cupom inválido ou expirado');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info('Cupom removido');
  };

  const handleRemoveItem = (productId: string, size: string, color: string, productName: string) => {
    removeItem(productId, size, color);
    toast.success(`${productName} removido do carrinho`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Adicione produtos ao carrinho para continuar');
      return;
    }
    onCheckout();
    onClose();
  };

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    updateQuantity(productId, size, color, newQuantity);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Carrinho vazio</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione produtos para continuar comprando
              </p>
              <Button onClick={onClose} variant="outline">
                Continuar comprando
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 p-3 border rounded-lg">
                  <div className="relative">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                          {item.product.name}
                        </h4>
                        {item.product.brand && (
                          <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                        )}
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {item.size}
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {getColorDisplayName(item.color)}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.product.id, item.size, item.color, item.product.name)}
                        title="Remover item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )}
                          disabled={item.quantity >= 10}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            R$ {item.product.price.toFixed(2).replace('.', ',')} cada
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="space-y-3 pb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && couponCode.trim()) {
                      handleApplyCoupon();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  title="Aplicar cupom"
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              
              {couponError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {couponError}
                </p>
              )}
              
              {appliedCoupon && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-green-700">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discount}% de desconto`
                          : `R$ ${appliedCoupon.discount.toFixed(2)} de desconto`
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="h-8 text-green-600 hover:text-green-700"
                    title="Remover cupom"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Available coupons hint */}
              <div className="text-xs text-muted-foreground">
                💡 Cupons disponíveis: DESCONTO10, PRIMEIRA20, FRETE15
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-2 py-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  Frete
                  {shipping === 0 && subtotal > 0 && (
                    <Badge variant="secondary" className="text-xs">Grátis</Badge>
                  )}
                </span>
                <span>
                  {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto ({appliedCoupon?.code})</span>
                  <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              
              {subtotal < 200 && subtotal > 0 && (
                <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                  💡 Adicione mais R$ {(200 - subtotal).toFixed(2).replace('.', ',')} para frete grátis!
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full" size="lg">
              Finalizar Compra
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}