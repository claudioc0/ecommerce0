<?php
session_start();
require_once 'db.php';

// Inicializa o carrinho na sessão se ainda não existir
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}
$cart_item_count = count($_SESSION['cart']);

$products = [];
try {
    $stmt = $pdo->query("SELECT id_produto, name, description, price, image FROM Produto ORDER BY createdAt DESC LIMIT 12");
    $products = $stmt->fetchAll();
} catch (PDOException $e) {
    error_log("Erro ao buscar produtos: " . $e->getMessage());
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
                            <!-- --- LINK DO CARRINHO ATUALIZADO AQUI --- -->
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
                                <p class="empty-state">Nenhum produto encontrado no momento.</p>
                            <?php else: ?>
                                <?php foreach ($products as $product): ?>
                                    <div class="product-card">
                                        <a href="product_detail.php?id=<?php echo $product['id_produto']; ?>">
                                            <img src="<?php echo htmlspecialchars($product['image'] ?: 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=Produto'); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-image">
                                        </a>
                                        <div class="product-info">
                                            <h3 class="product-title"><?php echo htmlspecialchars($product['name']); ?></h3>
                                            <p class="product-price">R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></p>
                                            
                                            <!-- --- FORMULÁRIO PARA ADICIONAR AO CARRINHO --- -->
                                            <form action="add_to_cart.php" method="POST">
                                                <input type="hidden" name="product_id" value="<?php echo $product['id_produto']; ?>">
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

