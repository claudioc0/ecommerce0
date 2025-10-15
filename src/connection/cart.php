<?php
// Ficheiro: src/connection/cart.php (Refatorado com RedBeanPHP)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção da página: Apenas clientes logados podem ver o carrinho
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: login.php');
    exit();
}

$cart_items = [];
$total_price = 0;
$cart_product_ids = $_SESSION['cart'] ?? [];

if (!empty($cart_product_ids)) {
    // --- LÓGICA DO ORM APLICADA AQUI ---
    // 1. Conta a quantidade de cada produto no carrinho
    $product_quantities = array_count_values($cart_product_ids);
    $product_ids_unique = array_keys($product_quantities);

    // 2. Carrega todos os beans (objetos) dos produtos necessários com uma única consulta
    // R::loadAll() é o equivalente a "SELECT * FROM produto WHERE id IN (...)"
    $products_in_cart = R::loadAll('produto', $product_ids_unique);

    // 3. Constrói o array final do carrinho para exibição no HTML
    foreach ($products_in_cart as $product) {
        $product_id = $product->id;
        $quantity = $product_quantities[$product_id];
        $subtotal = $product->price * $quantity;
        $total_price += $subtotal;

        $cart_items[] = [
            'id'       => $product_id,
            'name'     => $product->name,
            'price'    => $product->price,
            'image'    => $product->image,
            'quantity' => $quantity,
            'subtotal' => $subtotal
        ];
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrinho de Compras - FashionStore</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav id="navbar">
        <div class="nav-content">
            <a href="index.php" class="logo">FashionStore</a>
            <div class="nav-links">
                <a href="index.php" class="nav-link">Home</a>
                <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
            </div>
        </div>
    </nav>

    <div class="container" style="padding-top: 32px;">
        <h2>Meu Carrinho de Compras</h2>
        
        <?php if (isset($_GET['error']) && $_GET['error'] === 'checkout_failed'): ?>
            <p class="text-error text-center mb-4">Ocorreu um erro ao finalizar a sua compra. Por favor, tente novamente.</p>
        <?php endif; ?>

        <?php if (empty($cart_items)): ?>
            <div class="empty-state" style="margin-top: 48px;">
                <p>O seu carrinho está vazio.</p>
                <a href="index.php" class="btn-primary mt-4">Continuar a Comprar</a>
            </div>
        <?php else: ?>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; margin-top: 24px;">
                <div id="cart-items-list">
                    <?php foreach ($cart_items as $item): ?>
                        <div class="cart-item">
                            <img src="<?php echo htmlspecialchars($item['image'] ?: 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=...'); ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
                            <div class="cart-item-info">
                                <p class="cart-item-title"><?php echo htmlspecialchars($item['name']); ?></p>
                                <p class="cart-item-price">R$ <?php echo number_format($item['price'], 2, ',', '.'); ?></p>
                                <div class="quantity-controls">
                                    <form action="update_cart_quantity.php" method="POST" style="display: inline;">
                                        <input type="hidden" name="product_id" value="<?php echo $item['id']; ?>">
                                        <input type="hidden" name="action" value="decrease">
                                        <button type="submit" class="quantity-btn">-</button>
                                    </form>
                                    <span class="quantity-input" style="padding: 0 10px;"><?php echo $item['quantity']; ?></span>
                                    <form action="update_cart_quantity.php" method="POST" style="display: inline;">
                                        <input type="hidden" name="product_id" value="<?php echo $item['id']; ?>">
                                        <input type="hidden" name="action" value="increase">
                                        <button type="submit" class="quantity-btn">+</button>
                                    </form>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-weight: 600;">Subtotal: R$ <?php echo number_format($item['subtotal'], 2, ',', '.'); ?></p>
                                <form action="remove_from_cart.php" method="POST" class="mt-4">
                                    <input type="hidden" name="product_id" value="<?php echo $item['id']; ?>">
                                    <button type="submit" style="background: none; border: none; color: var(--error-500); cursor: pointer; text-decoration: underline;">Remover</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="cart-summary">
                    <h3>Resumo do Pedido</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>R$ <?php echo number_format($total_price, 2, ',', '.'); ?></span>
                    </div>
                    <div class="summary-row">
                        <span>Frete</span>
                        <span>Grátis</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>R$ <?php echo number_format($total_price, 2, ',', '.'); ?></span>
                    </div>
                    <a href="checkout.php" class="btn-primary" style="width: 100%; margin-top: 16px; text-align: center;">Finalizar Compra</a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>

