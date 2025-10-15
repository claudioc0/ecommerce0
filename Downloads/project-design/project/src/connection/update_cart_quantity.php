<?php
session_start();

// Proteção
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

if (isset($_POST['product_id']) && isset($_POST['action'])) {
    $product_id = (int)$_POST['product_id'];
    $action = $_POST['action'];

    if (!empty($_SESSION['cart'])) {
        if ($action === 'increase') {
            // Adiciona mais uma unidade do produto
            $_SESSION['cart'][] = $product_id;
        } elseif ($action === 'decrease') {
            // Encontra a primeira ocorrência do ID do produto e remove-a
            $key = array_search($product_id, $_SESSION['cart']);
            if ($key !== false) {
                unset($_SESSION['cart'][$key]);
                // Re-indexa o array para evitar buracos
                $_SESSION['cart'] = array_values($_SESSION['cart']);
            }
        }
    }
}

// Redireciona de volta para a página do carrinho
header('Location: cart.php');
exit();
