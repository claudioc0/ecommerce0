<?php
// Ficheiro: src/connection/checkout.php (Refatorado para usar a BD)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção: Apenas clientes logados podem aceder
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: login.php');
    exit();
}

// --- LÓGICA DO ORM PARA LER O CARRINHO DA BD ---
$cart_items = [];
$total_price = 0;

try {
    // 1. Encontra o perfil do cliente logado
    $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);
    $carrinho_vazio = true;

    if ($cliente) {
        // 2. Encontra o carrinho ativo para este cliente
        $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);

        if ($carrinho) {
            // 3. Busca todos os itens associados a este carrinho
            $items_no_carrinho = $carrinho->ownCarrinhoitemList;

            if (!empty($items_no_carrinho)) {
                $carrinho_vazio = false;

                // 4. Constrói o array final para o resumo
                foreach ($items_no_carrinho as $item) {
                    $produto = $item->produto; // Carrega o produto relacionado
                    
                    $total_price += $produto->price * $item->quantidade;

                    $cart_items[] = [
                        'name'     => $produto->name,
                        'price'    => $produto->price,
                        'quantity' => $item->quantidade,
                    ];
                }
            }
        }
    }

    // Se o carrinho estiver vazio, não há porquê estar aqui
    if ($carrinho_vazio) {
        header('Location: cart.php');
        exit();
    }

} catch (Exception $e) {
    error_log("Erro ao buscar itens para o checkout: " . $e->getMessage());
    // Em caso de erro, redireciona para o carrinho
    header('Location: cart.php?error=1');
    exit();
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

