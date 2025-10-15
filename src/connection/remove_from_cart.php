<?php
session_start();

// Proteção
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

if (isset($_POST['product_id'])) {
    $product_id_to_remove = (int)$_POST['product_id'];

    if (!empty($_SESSION['cart'])) {
        // Filtra o array, mantendo apenas os IDs que são diferentes do que queremos remover
        $_SESSION['cart'] = array_filter($_SESSION['cart'], function($id) use ($product_id_to_remove) {
            return $id != $product_id_to_remove;
        });
        // Re-indexa o array
        $_SESSION['cart'] = array_values($_SESSION['cart']);
    }
}

// Redireciona de volta para a página do carrinho
header('Location: cart.php');
exit();
