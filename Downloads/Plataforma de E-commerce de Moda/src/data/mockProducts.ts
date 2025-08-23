import { Product } from "../types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Vestido Floral Elegante",
    description: "Vestido feminino com estampa floral delicada, perfeito para ocasiões especiais. Tecido leve e confortável.",
    price: 189.90,
    originalPrice: 249.90,
    images: ["https://images.unsplash.com/photo-1619794724492-651397287d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBkcmVzc3xlbnwxfHx8fDE3NTUzNzYxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "feminino",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Rosa", "Azul", "Verde"],
    inStock: true,
    condition: "new",
    brand: "Elegance",
    tags: ["vestido", "floral", "elegante", "feminino"]
  },
  {
    id: "2",
    name: "Camisa Casual Masculina",
    description: "Camisa casual masculina de algodão, ideal para o dia a dia. Corte moderno e confortável.",
    price: 89.90,
    images: ["https://images.unsplash.com/photo-1603252109612-24fa03d145c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTUzNDEyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "masculino",
    sizes: ["P", "M", "G", "GG", "XGG"],
    colors: ["Branco", "Azul", "Cinza"],
    inStock: true,
    condition: "new",
    brand: "Urban Style",
    tags: ["camisa", "casual", "masculino", "algodão"]
  },
  {
    id: "3",
    name: "Vestidinho Infantil Unicórnio",
    description: "Vestido infantil encantador com estampa de unicórnio e glitter. 100% algodão, super confortável para as pequenas princesas.",
    price: 79.90,
    originalPrice: 99.90,
    images: ["https://images.unsplash.com/photo-1604482858862-1db908a653e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZHJlc3MlMjBjaGlsZHJlbiUyMGZhc2hpb258ZW58MXx8fHwxNzU1NjkyNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["2", "4", "6", "8", "10"],
    colors: ["Rosa", "Lilás", "Branco"],
    inStock: true,
    condition: "new",
    brand: "Little Dreams",
    tags: ["vestido", "infantil", "unicórnio", "menina", "festa"]
  },
  {
    id: "4",
    name: "Jaqueta Jeans Vintage",
    description: "Jaqueta jeans vintage de segunda mão, em excelente estado. Estilo atemporal e sustentável.",
    price: 129.90,
    images: ["https://images.unsplash.com/photo-1627342229908-71efbac25f08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBkcmVzc3xlbnwxfHx8fDE3NTUzNzYxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "unissex",
    sizes: ["P", "M", "G"],
    colors: ["Azul"],
    inStock: true,
    condition: "excellent",
    brand: "Vintage Co.",
    tags: ["jaqueta", "jeans", "vintage", "sustentável"]
  },
  {
    id: "5",
    name: "Blusa de Tricot Feminina",
    description: "Blusa de tricot feminina super macia, ideal para dias mais frescos. Design moderno e versátil.",
    price: 119.90,
    images: ["https://images.unsplash.com/photo-1619794724492-651397287d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBkcmVzc3xlbnwxfHx8fDE3NTUzNzYxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "feminino",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Bege", "Preto", "Marrom"],
    inStock: true,
    condition: "new",
    brand: "Cozy Wear",
    tags: ["blusa", "tricot", "feminino", "inverno"]
  },
  {
    id: "6",
    name: "Calça Esportiva Masculina",
    description: "Calça esportiva masculina com tecnologia dry-fit. Perfeita para exercícios e atividades físicas.",
    price: 149.90,
    images: ["https://images.unsplash.com/photo-1603252109612-24fa03d145c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTUzNDEyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "esportivo",
    sizes: ["P", "M", "G", "GG", "XGG"],
    colors: ["Preto", "Cinza", "Azul"],
    inStock: true,
    condition: "new",
    brand: "Sport Pro",
    tags: ["calça", "esportiva", "masculino", "dry-fit"]
  },
  // Novos produtos infantis
  {
    id: "7",
    name: "Conjunto Dinossauro Aventura",
    description: "Conjunto infantil masculino com estampa de dinossauros. Camiseta + bermuda em algodão puro, perfeito para brincadeiras.",
    price: 69.90,
    originalPrice: 89.90,
    images: ["https://images.unsplash.com/photo-1604155944627-35e00f0e66e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2hpbGRyZW4lMjBmYXNoaW9uJTIwY2xvdGhlc3xlbnwxfHx8fDE3NTU2OTI3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["2", "4", "6", "8", "10"],
    colors: ["Verde", "Azul", "Cinza"],
    inStock: true,
    condition: "new",
    brand: "Adventure Kids",
    tags: ["conjunto", "infantil", "dinossauro", "menino", "aventura"]
  },
  {
    id: "8",
    name: "Camiseta Super-Herói Infantil",
    description: "Camiseta infantil unissex com estampas de super-heróis. Material respirável e cores vibrantes que não desbotam.",
    price: 39.90,
    images: ["https://images.unsplash.com/photo-1607454317633-a30150d568a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHQtc2hpcnQlMjBraWRzJTIwY2FzdWFsfGVufDF8fHx8MTc1NTY5Mjc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["2", "4", "6", "8", "10", "12"],
    colors: ["Azul", "Vermelho", "Amarelo"],
    inStock: true,
    condition: "new",
    brand: "Hero Kids",
    tags: ["camiseta", "infantil", "super-herói", "unissex", "casual"]
  },
  {
    id: "9",
    name: "Tênis Infantil LED",
    description: "Tênis infantil com luzes LED que acendem ao caminhar. Solado antiderrapante e design moderno para diversão garantida.",
    price: 129.90,
    originalPrice: 159.90,
    images: ["https://images.unsplash.com/photo-1707013537977-90e0a6cfa484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwc25lYWtlcnMlMjBjaGlsZHJlbiUyMHNob2VzfGVufDF8fHx8MTc1NTY5Mjc5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Preto", "Rosa", "Azul"],
    inStock: true,
    condition: "new",
    brand: "Light Step",
    tags: ["tênis", "infantil", "LED", "luzes", "moderno"]
  },
  {
    id: "10",
    name: "Jaqueta Infantil Puffer",
    description: "Jaqueta infantil estilo puffer com capuz removível. Resistente à água e super quentinha para o inverno.",
    price: 159.90,
    originalPrice: 199.90,
    images: ["https://images.unsplash.com/photo-1606251032232-1a11b59e7f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwamFja2V0JTIwY2hpbGRyZW4lMjB3aW50ZXJ8ZW58MXx8fHwxNzU1NjkyODAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["4", "6", "8", "10", "12"],
    colors: ["Rosa", "Azul", "Verde"],
    inStock: true,
    condition: "new",
    brand: "Cozy Kids",
    tags: ["jaqueta", "infantil", "puffer", "inverno", "capuz"]
  },
  {
    id: "11",
    name: "Macacão Infantil Comfort",
    description: "Macacão infantil de moletom macio, ideal para dias de descanso em casa. Design fofo com orelhinhas de animalzinho.",
    price: 89.90,
    images: ["https://images.unsplash.com/photo-1604155944627-35e00f0e66e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2hpbGRyZW4lMjBmYXNoaW9uJTIwY2xvdGhlc3xlbnwxfHx8fDE3NTU2OTI3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["2", "4", "6", "8"],
    colors: ["Cinza", "Rosa", "Bege"],
    inStock: true,
    condition: "new",
    brand: "Sweet Dreams",
    tags: ["macacão", "infantil", "moletom", "conforto", "casa"]
  },
  {
    id: "12",
    name: "Kit 3 Cuecas Infantil",
    description: "Kit com 3 cuecas infantil em algodão premium. Estampas divertidas e elástico macio que não machuca.",
    price: 45.90,
    originalPrice: 59.90,
    images: ["https://images.unsplash.com/photo-1607454317633-a30150d568a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHQtc2hpcnQlMjBraWRzJTIwY2FzdWFsfGVufDF8fHx8MTc1NTY5Mjc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    category: "infantil",
    sizes: ["2", "4", "6", "8", "10"],
    colors: ["Azul", "Verde", "Amarelo"],
    inStock: true,
    condition: "new",
    brand: "Comfort Kids",
    tags: ["cueca", "infantil", "kit", "algodão", "conforto"]
  }
];

export const categories = [
  "feminino",
  "masculino",
  "infantil",
  "esportivo",
  "unissex"
];

export const sizes = ["P", "M", "G", "GG", "XGG", "2", "4", "6", "8", "10", "12", "26", "28", "30", "32", "34"];

export const colors = [
  "Branco",
  "Preto",
  "Azul",
  "Verde",
  "Rosa",
  "Amarelo",
  "Cinza",
  "Marrom",
  "Bege",
  "Lilás",
  "Vermelho"
];