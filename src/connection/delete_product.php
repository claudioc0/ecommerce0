<?php
// Ficheiro: src/connection/delete_product.php (Refatorado com RedBeanPHP)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

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
    // --- LÓGICA DO ORM CORRIGIDA ---

    // 1. Carrega o bean (objeto) do produto que se quer apagar
    $produto = R::load('produto', $product_id);

    // 2. Carrega o bean do vendedor que está logado usando a coluna correta 'usuario_id'
    $lojista = R::findOne('lojista', 'usuario_id = ?', [$_SESSION['user_id']]);

    // 3. Verificação de Segurança CRUCIAL com a coluna correta 'lojista_id'
    if ($produto->id && $lojista && $produto->lojista_id == $lojista->id) {
        // Se a verificação passar, apaga o produto da base de dados.
        R::trash($produto);
        header('Location: vendor_dashboard.php?status=deleted');
        exit();
    } else {
        // Se o produto não for encontrado ou não pertencer ao vendedor,
        // redireciona com um erro de permissão.
        header('Location: vendor_dashboard.php?status=permission_error');
        exit();
    }

} catch (Exception $e) {
    error_log("Erro ao excluir produto com ORM: " . $e->getMessage());
    header('Location: vendor_dashboard.php?status=error');
    exit();
}
?>

