class product {  
    constructor(id, name, category, price, size, color, stock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.size = size;
        this.color = color;
        this.stock = stock;

    }

    applyDiscout(percent) {
        if (percent > 0 && percent <= 100) {
            this.price = this.price - (this.price * (percent / 100));

        }
    }

    isAvaliable() {
        return this.stock > 0;
    }

    reduceStock(quantity) {
        if (quantity <= this.stock) {
            this.stock -= quantity;
            return true;

        } else {
            console.log("Insufficient stock");
            return false;
        }
    }

    showInfo() {
       return `Produto: ${this.nome} | Categoria: ${this.categoria} | Preço: R$${this.preco.toFixed(2)} | Tamanho: ${this.tamanho} | Cor: ${this.cor} | Estoque: ${this.estoque}`;
    }
}

const tshirt = new product(1, "basic tshirt", "Cloth", 81.95, 'G', 'Black', 10);

console.log(tshirt.showInfo());
tshirt.applyDiscout(12);
console.log(tshirt.showInfo());
tshirt.reduceStock(1);
console.log("Avaialble?", tshirt.isAvaliable());

    
