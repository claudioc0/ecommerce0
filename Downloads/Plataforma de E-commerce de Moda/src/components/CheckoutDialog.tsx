import {React} from 'react';
import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { useCart } from '../hooks/useCart';
import { Card, CardContent } from './ui/card';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutDialog({ isOpen, onClose }: CheckoutDialogProps) {
  const { items, subtotal, shipping, discount, total, clearCart } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    state: ''
  });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    setStep('info');
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      state: ''
    });
    onClose();
  };

  if (step === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pedido Confirmado</DialogTitle>
            <DialogDescription>
              Seu pedido foi realizado com sucesso e está sendo processado.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Pedido realizado!</h2>
            <p className="text-muted-foreground mb-6">
              Seu pedido foi confirmado e você receberá um e-mail com os detalhes.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <p className="font-medium">Número do pedido</p>
              <p className="text-lg font-mono">#MD{Date.now().toString().slice(-6)}</p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Continuar comprando
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'info' ? 'Informações de entrega' : 'Pagamento'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info' 
              ? 'Preencha suas informações para entrega do pedido.'
              : 'Escolha o método de pagamento e finalize sua compra.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="space-y-6">
            {step === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={customerInfo.zipCode}
                    onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                    placeholder="00000-000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continuar para pagamento
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Método de pagamento</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="pix" id="pix" />
                        <Smartphone className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <Label htmlFor="pix" className="font-medium">PIX</Label>
                          <p className="text-sm text-muted-foreground">
                            Pagamento instantâneo
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="credit" id="credit" />
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <Label htmlFor="credit" className="font-medium">Cartão de crédito</Label>
                          <p className="text-sm text-muted-foreground">
                            Parcelamento disponível
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Banknote className="w-5 h-5 text-orange-600" />
                        <div className="flex-1">
                          <Label htmlFor="boleto" className="font-medium">Boleto bancário</Label>
                          <p className="text-sm text-muted-foreground">
                            Vencimento em 3 dias
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === 'credit' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número do cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="000"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Nome no cartão</Label>
                      <Input
                        id="cardName"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('info')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processando...' : 'Finalizar pedido'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumo do pedido */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Resumo do pedido</h3>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="w-12 h-15 bg-muted rounded overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.size} • {item.color} • Qtd: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}