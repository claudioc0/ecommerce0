import { StorageService } from '../utils/storage.js';

export class ProductService {
    constructor() {
        this.storage = new StorageService('products');
        this.filters = {};
        this.initializeDemoData();
    }

    getAllProducts() {
        return this.storage.get('products') || [];
    }

    getFilteredProducts() {
        let products = this.getAllProducts();
        
        // Apply filters
        if (this.filters.category) {
            products = products.filter(p => p.category === this.filters.category);
        }
        
        if (this.filters.size) {
            products = products.filter(p => p.sizes.includes(this.filters.size));
        }
        
        if (this.filters.color) {
            products = products.filter(p => p.colors.includes(this.filters.color));
        }
        
        if (this.filters.condition) {
            products = products.filter(p => p.condition === this.filters.condition);
        }
        
        // Price range filter
        products = products.filter(p => 
            p.price >= this.filters.minPrice && 
            p.price <= this.filters.maxPrice
        );
        
        return products;
    }

    getProductById(id) {
        const products = this.getAllProducts();
        return products.find(p => p.id === id);
    }

    addProduct(productData) {
        const products = this.getAllProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            stock: parseInt(productData.stock) || 0,
            sold: 0
        };
        
        products.push(newProduct);
        this.storage.set('products', products);
        return newProduct;
    }

    updateProduct(id, productData) {
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...productData,
                updatedAt: new Date().toISOString()
            };
            this.storage.set('products', products);
            return products[index];
        }
        
        return null;
    }

    deleteProduct(id) {
        const products = this.getAllProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        this.storage.set('products', filteredProducts);
        return true;
    }

    setFilters(filters) {
        this.filters = {
            category: filters.category || '',
            size: filters.size || '',
            color: filters.color || '',
            condition: filters.condition || '',
            minPrice: filters.minPrice || 0,
            maxPrice: filters.maxPrice || Infinity
        };
    }

    getCategories() {
        const products = this.getAllProducts();
        const categories = [...new Set(products.map(p => p.category))];
        return categories.sort();
    }

    getSizes() {
        const products = this.getAllProducts();
        const sizes = [...new Set(products.flatMap(p => p.sizes))];
        return sizes.sort();
    }

    getColors() {
        const products = this.getAllProducts();
        const colors = [...new Set(products.flatMap(p => p.colors))];
        return colors.sort();
    }

    updateStock(id, quantity) {
        const products = this.getAllProducts();
        const product = products.find(p => p.id === id);
        
        if (product) {
            product.stock = Math.max(0, product.stock - quantity);
            product.sold += quantity;
            this.storage.set('products', products);
            return true;
        }
        
        return false;
    }

    initializeDemoData() {
        const existingProducts = this.getAllProducts();
        if (existingProducts.length === 0) {
            const demoProducts = [
                {
                    id: '1',
                    name: 'Vestido Floral Elegante',
                    description: 'Vestido longo com estampa floral delicada, perfeito para ocasiões especiais.',
                    price: 159.90,
                    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Vestidos',
                    sizes: ['P', 'M', 'G', 'GG'],
                    colors: ['Rosa', 'Azul', 'Verde'],
                    condition: 'Novo',
                    stock: 25,
                    sold: 15,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'Blusa Casual Moderna',
                    description: 'Blusa confortável para o dia a dia, feita com tecido de alta qualidade.',
                    price: 79.90,
                    image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Blusas',
                    sizes: ['PP', 'P', 'M', 'G'],
                    colors: ['Branco', 'Preto', 'Cinza'],
                    condition: 'Novo',
                    stock: 30,
                    sold: 22,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Calça Jeans Premium',
                    description: 'Calça jeans de corte moderno, perfeita para qualquer ocasião.',
                    price: 129.90,
                    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Calças',
                    sizes: ['36', '38', '40', '42', '44'],
                    colors: ['Azul', 'Preto', 'Azul Escuro'],
                    condition: 'Novo',
                    stock: 20,
                    sold: 8,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '4',
                    name: 'Jaqueta de Couro Vintage',
                    description: 'Jaqueta de couro legítimo, estilo vintage, seminova em ótimo estado.',
                    price: 299.90,
                    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Jaquetas',
                    sizes: ['P', 'M', 'G'],
                    colors: ['Marrom', 'Preto'],
                    condition: 'Seminovo',
                    stock: 8,
                    sold: 3,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '5',
                    name: 'Saia Midi Elegante',
                    description: 'Saia midi em tecido fluido, ideal para looks sofisticados.',
                    price: 89.90,
                    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Saias',
                    sizes: ['PP', 'P', 'M', 'G', 'GG'],
                    colors: ['Preto', 'Marinho', 'Vinho'],
                    condition: 'Novo',
                    stock: 18,
                    sold: 12,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '6',
                    name: 'Camisa Social Feminina',
                    description: 'Camisa social de algodão, corte feminino, perfeita para o trabalho.',
                    price: 99.90,
                    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Camisas',
                    sizes: ['PP', 'P', 'M', 'G'],
                    colors: ['Branco', 'Azul Claro', 'Rosa'],
                    condition: 'Novo',
                    stock: 15,
                    sold: 18,
                    createdAt: new Date().toISOString()
                }
            ];
            
            this.storage.set('products', demoProducts);
        }
    }

    searchProducts(query) {
        const products = this.getAllProducts();
        const lowercaseQuery = query.toLowerCase();
        
        return products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
    }

    getFeaturedProducts() {
        const products = this.getAllProducts();
        return products
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 6);
    }

    getNewProducts() {
        const products = this.getAllProducts();
        return products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);
    }

    getProductsByCategory(category) {
        const products = this.getAllProducts();
        return products.filter(p => p.category === category);
    }

    isInStock(id) {
        const product = this.getProductById(id);
        return product && product.stock > 0;
    }

    reduceStock(id, quantity = 1) {
        const products = this.getAllProducts();
        const product = products.find(p => p.id === id);
        
        if (product && product.stock >= quantity) {
            product.stock -= quantity;
            product.sold += quantity;
            this.storage.set('products', products);
            return true;
        }
        
        return false;
    }

    getRelatedProducts(productId) {
        const product = this.getProductById(productId);
        if (!product) return [];
        
        const products = this.getAllProducts();
        return products
            .filter(p => p.id !== productId && p.category === product.category)
            .slice(0, 4);
    }
}