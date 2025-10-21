<?php
// Ficheiro: src/connection/process_checkout.php

require_once 'db.php';
require_once __DIR__ . '/../classes/Checkout.php';

// Proteção do script
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: index.php');
    exit();
}

// Instancia a classe Checkout
$checkout = new Checkout();

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

