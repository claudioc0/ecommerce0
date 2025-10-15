<?php
session_start();
require_once 'db.php';

// Proteção: Apenas vendedores podem aceder e apenas via método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'vendor') {
    header('Location: index.php');
    exit();
}

// Valida o ID do produto
if (!isset($_POST['product_id']) || !is_numeric($_POST['product_id'])) {
    header('Location: vendor_dashboard.php');
    exit();
}

$product_id = $_POST['product_id'];

try {
    $sql = "DELETE FROM Produto WHERE id_produto = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$product_id]);

    // Redireciona para o painel do vendedor após a exclusão
    header('Location: vendor_dashboard.php?status=deleted');
    exit();

} catch (PDOException $e) {
    error_log("Erro ao excluir produto: " . $e->getMessage());
    // Em caso de erro, redireciona com uma mensagem de falha
    header('Location: vendor_dashboard.php?status=error');
    exit();
}
?>
