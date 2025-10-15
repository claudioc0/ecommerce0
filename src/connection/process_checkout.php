<?php
// Ficheiro: src/connection/process_checkout.php (Refatorado para usar RedBeanPHP)

// 1. Inclui o db.php, que agora trata da sessão e da configuração do RedBeanPHP
require_once 'db.php';

// 2. Inclui a classe Checkout
require_once __DIR__ . '/../classes/Checkout.php';

// Proteção do script (continua igual e correta)
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: index.php');
    exit();
}

// --- ALTERAÇÃO CRUCIAL APLICADA AQUI ---
// 3. Instancia a classe Checkout refatorada, que já não precisa do $pdo
$checkout = new Checkout();

// Tenta criar o pedido (esta parte continua igual)
$order_id = $checkout->createOrder();

if ($order_id) {
    // Se o pedido foi criado com sucesso, redireciona para a página de sucesso
    header('Location: order_success.php?order_id=' . $order_id);
    exit();
} else {
    // Se falhou, redireciona de volta para o carrinho com uma mensagem de erro
    header('Location: cart.php?error=checkout_failed');
    exit();
}
?>
