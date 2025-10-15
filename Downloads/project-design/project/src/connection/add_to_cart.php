<?php
session_start();

// Proteção: Apenas utilizadores logados podem adicionar ao carrinho
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Verifica se o formulário foi enviado com o ID do produto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id'])) {
    $product_id = (int)$_POST['product_id'];

    // Inicializa o carrinho se ainda não existir
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    // Adiciona o ID do produto ao array do carrinho
    // Para simplificar, estamos a adicionar o mesmo produto várias vezes se o botão for clicado.
    // Uma implementação mais avançada poderia verificar a quantidade.
    $_SESSION['cart'][] = $product_id;
}

// Redireciona o utilizador de volta para a página principal
header('Location: index.php');
exit();
?>
