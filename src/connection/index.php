<?php
// Ficheiro: src/connection/index.php
require_once 'db.php'; // Inicia a sessão e o RedBeanPHP simplificado

// --- LÓGICA DO CARRINHO ATUALIZADA AQUI ---
$cart_item_count = 0;
if (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'customer') {
    try {
        // Encontra o perfil do cliente logado
        $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);
        if ($cliente) {
            // Encontra o carrinho do cliente
            $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);
            if ($carrinho) {
                // Conta quantos registos (tipos de produto) estão nesse carrinho
                $cart_item_count = R::count('carrinhoitem', 'carrinho_id = ?', [$carrinho->id]);
            }
        }
    } catch(Exception $e) {
        // Em caso de erro, o contador fica a 0
        error_log("Erro ao contar itens do carrinho: " . $e->getMessage());
    }
}

$products = [];
try {
    // A busca agora usa a coluna 'created_at'
    $products = R::findAll('produto', 'ORDER BY created_at DESC LIMIT 12');
} catch (Exception $e) {
    error_log("Erro ao buscar produtos com ORM: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FashionStore - Sua Loja Online</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="app">
        <nav id="navbar">
            <div class="nav-content">
                <a href="index.php" class="logo">FashionStore</a>
                <div class="nav-links">
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <span>Olá, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</span>
                        <?php if ($_SESSION['user_role'] === 'vendor'): ?>
                            <a href="vendor_dashboard.php" class="nav-link">Painel</a>
                        <?php elseif ($_SESSION['user_role'] === 'customer'): ?>
                            <a href="cart.php" class="cart-container" title="Carrinho">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                <?php if ($cart_item_count > 0): ?>
                                    <span class="cart-badge"><?php echo $cart_item_count; ?></span>
                                <?php endif; ?>
                            </a>
                        <?php endif; ?>
                        <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
                    <?php else: ?>
                        <a href="login.php" class="nav-link">Login</a>
                        <a href="register.php" class="btn-primary btn-sm">Cadastrar</a>
                    <?php endif; ?>
                </div>
            </div>
        </nav>
        
        <main id="main-content">
            <div id="catalog-view" class="view active">
                <div class="hero-section">
                    <div class="container">
                        <h1>Descubra a Moda que é a Sua Cara</h1>
                    </div>
                </div>
                
                <div class="container" style="padding-top: 32px;">
                    <div id="products-section">
                        <div class="section-header">
                            <h2>Produtos em Destaque</h2>
                        </div>
                        <div id="products-grid" class="products-grid">
                            <?php if (empty($products)): ?>
                                <p class="empty-state">Nenhum produto encontrado no momento. Cadastre um produto como vendedor para vê-lo aqui!</p>
                            <?php else: ?>
                                <?php foreach ($products as $product): ?>
                                    <div class="product-card">
                                        <a href="product_detail.php?id=<?php echo $product->id; ?>">
                                            <img src="<?php echo htmlspecialchars($product->image ?: 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=Produto'); ?>" alt="<?php echo htmlspecialchars($product->name); ?>" class="product-image">
                                        </a>
                                        <div class="product-info">
                                            <h3 class="product-title"><?php echo htmlspecialchars($product->name); ?></h3>
                                            <p class="product-price">R$ <?php echo number_format($product->price, 2, ',', '.'); ?></p>
                                            
                                            <form action="add_to_cart.php" method="POST">
                                                <input type="hidden" name="product_id" value="<?php echo $product->id; ?>">
                                                <button type="submit" class="add-to-cart-btn">Adicionar ao Carrinho</button>
                                            </form>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>

