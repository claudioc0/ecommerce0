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
    // --- LÓGICA DO ORM APLICADA AQUI ---

    // 1. Carrega o bean (objeto) do produto que se quer apagar
    $produto = R::load('produto', $product_id);

    // 2. Carrega o bean do vendedor que está logado
    $lojista = R::findOne('lojista', 'id_usuario = ?', [$_SESSION['user_id']]);

    // 3. Verificação de Segurança CRUCIAL:
    // Garante que o produto existe E que o ID do lojista associado ao produto
    // é o mesmo ID do lojista que está logado.
    if ($produto->id && $lojista && $produto->id_lojista == $lojista->id) {
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
