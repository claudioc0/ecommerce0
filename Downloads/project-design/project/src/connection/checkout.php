<?php
session_start();
require_once 'db.php';

// Proteção: Apenas clientes logados podem aceder
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: login.php');
    exit();
}

// Se o carrinho estiver vazio, não há porquê estar aqui
if (empty($_SESSION['cart'])) {
    header('Location: cart.php');
    exit();
}

// --- LÓGICA PARA BUSCAR OS ITENS DO CARRINHO ---
$cart_items = [];
$total_price = 0;
$cart_product_ids = $_SESSION['cart'];

// Conta a quantidade de cada produto
$product_quantities = array_count_values($cart_product_ids);
$product_ids_unique = array_keys($product_quantities);

// Prepara os placeholders para a consulta SQL (ex: ?,?,?)
$placeholders = implode(',', array_fill(0, count($product_ids_unique), '?'));

// Busca os detalhes dos produtos no carrinho
$sql = "SELECT id_produto, name, price FROM Produto WHERE id_produto IN ($placeholders)";
$stmt = $pdo->prepare($sql);
$stmt->execute($product_ids_unique);
$products_in_cart = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Constrói o array final do carrinho com todos os detalhes
foreach ($products_in_cart as $product) {
    $product_id = $product['id_produto'];
    $quantity = $product_quantities[$product_id];
    $total_price += $product['price'] * $quantity;

    $cart_items[] = [
        'name' => $product['name'],
        'price' => $product['price'],
        'quantity' => $quantity,
    ];
}
// --- FIM DA LÓGICA DO CARRINHO ---

?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale-1.0">
    <title>Finalizar Compra - FashionStore</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav id="navbar">
        <div class="nav-content">
            <a href="index.php" class="logo">FashionStore</a>
            <div class="nav-links">
                <a href="index.php" class="nav-link">Home</a>
                <a href="cart.php" class="nav-link">Voltar ao Carrinho</a>
                <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
            </div>
        </div>
    </nav>

    <div class="container" style="padding-top: 32px; max-width: 600px;">
        <h2>Finalizar Compra</h2>
        <p style="color: var(--gray-600); margin-bottom: 24px;">Por favor, confirme os seus dados para completar o pedido.</p>
        
        <div class="checkout-form">
            <div class="form-section">
                <h3>Informações do Cliente</h3>
                <p><strong>Nome:</strong> <?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
            </div>

            <!-- --- RESUMO DO PEDIDO ATUALIZADO --- -->
            <div class="form-section">
                <h3>Resumo do Pedido</h3>
                <div class="cart-summary" style="box-shadow: none; padding: 0;">
                    <?php foreach ($cart_items as $item): ?>
                        <div class="summary-row">
                            <span><?php echo htmlspecialchars($item['name']); ?> (x<?php echo $item['quantity']; ?>)</span>
                            <span>R$ <?php echo number_format($item['price'] * $item['quantity'], 2, ',', '.'); ?></span>
                        </div>
                    <?php endforeach; ?>
                    <div class="summary-row total" style="margin-top: 16px;">
                        <span>Total</span>
                        <span>R$ <?php echo number_format($total_price, 2, ',', '.'); ?></span>
                    </div>
                </div>
            </div>
            
            <!-- Este formulário envia o pedido para o script de processamento -->
            <form action="process_checkout.php" method="POST">
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 16px;">Confirmar e Pagar</button>
            </form>
        </div>
    </div>
</body>
</html>

