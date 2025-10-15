<?php
// Ficheiro: src/connection/process_checkout.php (Versão Final Limpa)

session_start();
require_once 'db.php';
// Usa __DIR__ para um caminho mais robusto a partir da localização atual do ficheiro
require_once __DIR__ . '/../classes/Checkout.php';

// Protege o script: só pode ser acedido via POST por um cliente logado
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: index.php');
    exit();
}

// Instancia a classe Checkout, passando a conexão PDO
$checkout = new Checkout($pdo);

// Tenta criar o pedido
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
