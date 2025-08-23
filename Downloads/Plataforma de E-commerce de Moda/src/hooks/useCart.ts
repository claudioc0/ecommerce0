import { useState, useEffect } from 'react';
import { CartItem, Coupon } from '../types/product';

const STORAGE_KEY = 'fashion-cart';
const COUPONS_KEY = 'fashion-coupons';

// Mock cupons disponíveis
const availableCoupons: Record<string, Coupon> = {
  'DESCONTO10': { code: 'DESCONTO10', discount: 10, type: 'percentage', isValid: true },
  'PRIMEIRA20': { code: 'PRIMEIRA20', discount: 20, type: 'percentage', isValid: true },
  'FRETE15': { code: 'FRETE15', discount: 15, type: 'fixed', isValid: true },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      const savedCoupon = localStorage.getItem(COUPONS_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Carrinho carregado do localStorage:', parsedCart);
        setItems(parsedCart);
      }
      
      if (savedCoupon) {
        const coupon = JSON.parse(savedCoupon);
        console.log('Cupom carregado do localStorage:', coupon);
        setAppliedCoupon(coupon);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPONS_KEY);
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      console.log('Salvando carrinho no localStorage:', items);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        console.log('Salvando cupom no localStorage:', appliedCoupon);
        localStorage.setItem(COUPONS_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPONS_KEY);
      }
    } catch (error) {
      console.error('Erro ao salvar cupom no localStorage:', error);
    }
  }, [appliedCoupon]);

  const addItem = (item: CartItem) => {
    console.log('Adicionando item ao carrinho:', item);
    
    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(
        i => i.product.id === item.product.id && 
             i.size === item.size && 
             i.color === item.color
      );

      if (existingIndex >= 0) {
        const updated = [...currentItems];
        updated[existingIndex].quantity += item.quantity;
        console.log('Item atualizado (quantidade aumentada):', updated[existingIndex]);
        return updated;
      }

      const newItems = [...currentItems, item];
      console.log('Novo item adicionado. Carrinho atual:', newItems);
      return newItems;
    });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    console.log('Removendo item do carrinho:', { productId, size, color });
    
    setItems(currentItems => {
      const filtered = currentItems.filter(
        item => !(item.product.id === productId && 
                 item.size === size && 
                 item.color === color)
      );
      console.log('Item removido. Carrinho atual:', filtered);
      return filtered;
    });
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    console.log('Atualizando quantidade:', { productId, size, color, quantity });
    
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    setItems(currentItems => {
      const updated = currentItems.map(item =>
        item.product.id === productId && 
        item.size === size && 
        item.color === color
          ? { ...item, quantity }
          : item
      );
      console.log('Quantidade atualizada. Carrinho atual:', updated);
      return updated;
    });
  };

  const clearCart = () => {
    console.log('Limpando carrinho');
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    console.log('Tentando aplicar cupom:', code);
    const coupon = availableCoupons[code.toUpperCase()];
    if (coupon && coupon.isValid) {
      console.log('Cupom aplicado com sucesso:', coupon);
      setAppliedCoupon(coupon);
      return true;
    }
    console.log('Cupom inválido:', code);
    return false;
  };

  const removeCoupon = () => {
    console.log('Removendo cupom');
    setAppliedCoupon(null);
  };

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15.90; // Frete grátis acima de R$ 200
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const total = subtotal + shipping - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Debug: Log do estado atual do carrinho
  console.log('Estado atual do carrinho:', {
    itemsCount: items.length,
    totalItems: itemCount,
    subtotal,
    shipping,
    discount,
    total,
    appliedCoupon
  });

  return {
    items,
    itemCount,
    subtotal,
    shipping,
    discount,
    total,
    appliedCoupon,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
}