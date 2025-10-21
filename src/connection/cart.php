<?php
// Ficheiro: src/connection/cart.php (Refatorado para usar a BD)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção da página
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: login.php');
    exit();
}

$cart_items = [];
$total_price = 0;

try {
    // 1. Encontra o perfil do cliente logado
    $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);

    if ($cliente) {
        // 2. Encontra o carrinho ativo para este cliente
        $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);

        if ($carrinho) {
            // 3. Busca todos os itens associados a este carrinho
            // A notação own<List> do RedBeanPHP carrega a lista de itens relacionados
            $items_no_carrinho = $carrinho->ownCarrinhoitemList;

            // 4. Constrói o array final do carrinho para exibição
            foreach ($items_no_carrinho as $item) {
                // $item->produto carrega o bean do produto relacionado automaticamente
                $produto = $item->produto; 
                
                $subtotal = $produto->price * $item->quantidade;
                $total_price += $subtotal;

                $cart_items[] = [
                    'item_id'  => $item->id, // ID do carrinhoitem, para remoção/update
                    'name'     => $produto->name,
                    'price'    => $produto->price,
                    'image'    => $produto->image,
                    'quantity' => $item->quantidade,
                    'subtotal' => $subtotal
                ];
            }
        }
    }
} catch (Exception $e) {
    error_log("Erro ao buscar itens do carrinho: " . $e->getMessage());
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
        
        <?php if (isset($_GET['error'])): ?>
            <p class="text-error text-center mb-4">Ocorreu um erro. Por favor, tente novamente.</p>
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
                                        <input type="hidden" name="item_id" value="<?php echo $item['item_id']; ?>">
                                        <input type="hidden" name="action" value="decrease">
                                        <button type="submit" class="quantity-btn">-</button>
                                    </form>
                                    <span class="quantity-input" style="padding: 0 10px;"><?php echo $item['quantity']; ?></span>
                                    <form action="update_cart_quantity.php" method="POST" style="display: inline;">
                                        <input type="hidden" name="item_id" value="<?php echo $item['item_id']; ?>">
                                        <input type="hidden" name="action" value="increase">
                                        <button type="submit" class="quantity-btn">+</button>
                                    </form>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-weight: 600;">Subtotal: R$ <?php echo number_format($item['subtotal'], 2, ',', '.'); ?></p>
                                <form action="remove_from_cart.php" method="POST" class="mt-4">
                                    <input type="hidden" name="item_id" value="<?php echo $item['item_id']; ?>">
                                    <button type="submit" style="background: none; border: none; color: var(--error-500); cursor: pointer; text-decoration: underline;">Remover</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="cart-summary">
                    <h3>Resumo do Pedido</h3>
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

