import { useState } from 'react';
import { Plus, Edit, Trash2, Package, BarChart3, Users, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { mockProducts, categories } from '../data/mockProducts';
import { Product } from '../types/product';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    condition: 'new' as 'new' | 'used' | 'excellent',
    brand: '',
    images: ['']
  });

  // Estatísticas mockadas
  const stats = {
    totalProducts: products.length,
    totalOrders: 45,
    totalRevenue: 12480.50,
    totalCustomers: 127
  };

  const handleSaveProduct = () => {
    const productData = {
      ...newProduct,
      id: editingProduct?.id || Date.now().toString(),
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      inStock: true,
      tags: newProduct.name.toLowerCase().split(' ')
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData as Product : p));
    } else {
      setProducts([...products, productData as Product]);
    }

    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      sizes: [],
      colors: [],
      condition: 'new',
      brand: '',
      images: ['']
    });
    setEditingProduct(null);
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      condition: product.condition,
      brand: product.brand || '',
      images: product.images
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie sua loja de moda</p>
          </div>
          <Button onClick={onClose} variant="outline">
            Fechar Painel
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Produtos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{stats.totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{stats.totalOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">
                    R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{stats.totalCustomers}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Produtos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-15 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                        <p className="text-sm font-medium">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Produtos</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct 
                        ? 'Edite as informações do produto selecionado.'
                        : 'Adicione um novo produto ao catálogo da loja.'
                      }
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Nome do Produto</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="productBrand">Marca</Label>
                      <Input
                        id="productBrand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="productDescription">Descrição</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="productPrice">Preço</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="productOriginalPrice">Preço Original (opcional)</Label>
                      <Input
                        id="productOriginalPrice"
                        type="number"
                        step="0.01"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="productCategory">Categoria</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="productCondition">Condição</Label>
                      <Select
                        value={newProduct.condition}
                        onValueChange={(value: 'new' | 'used' | 'excellent') => 
                          setNewProduct({...newProduct, condition: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Novo</SelectItem>
                          <SelectItem value="excellent">Semi-novo</SelectItem>
                          <SelectItem value="used">Usado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="productImage">URL da Imagem</Label>
                      <Input
                        id="productImage"
                        value={newProduct.images[0]}
                        onChange={(e) => setNewProduct({
                          ...newProduct, 
                          images: [e.target.value]
                        })}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsProductDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProduct} className="flex-1">
                      {editingProduct ? 'Atualizar' : 'Criar'} Produto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-15 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.brand}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? 'Em estoque' : 'Esgotado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>#MD{(1000 + i).toString()}</TableCell>
                        <TableCell>Cliente {i + 1}</TableCell>
                        <TableCell>R$ {(Math.random() * 500 + 50).toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>
                          <Badge variant={i % 3 === 0 ? "default" : i % 3 === 1 ? "secondary" : "outline"}>
                            {i % 3 === 0 ? 'Entregue' : i % 3 === 1 ? 'Enviado' : 'Processando'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Loja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="storeName">Nome da Loja</Label>
                    <Input id="storeName" defaultValue="ModaStyle" />
                  </div>
                  <div>
                    <Label htmlFor="storeDescription">Descrição</Label>
                    <Textarea 
                      id="storeDescription" 
                      defaultValue="Sua loja de moda online com as melhores tendências"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeEmail">E-mail de contato</Label>
                    <Input id="storeEmail" type="email" defaultValue="contato@modastyle.com" />
                  </div>
                  <Button>Salvar Configurações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Frete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="freeShipping">Valor mínimo para frete grátis</Label>
                    <Input id="freeShipping" type="number" defaultValue="200" />
                  </div>
                  <div>
                    <Label htmlFor="standardShipping">Valor do frete padrão</Label>
                    <Input id="standardShipping" type="number" step="0.01" defaultValue="15.90" />
                  </div>
                  <Button>Salvar Configurações</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}