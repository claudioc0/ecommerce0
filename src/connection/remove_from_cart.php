<?php
// Ficheiro: src/connection/remove_from_cart.php (Refatorado com RedBeanPHP)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção: Apenas clientes logados podem remover itens
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: index.php');
    exit();
}

// Verifica se o ID do item a ser removido foi enviado
if (isset($_POST['item_id'])) {
    $item_id = (int)$_POST['item_id'];

    try {
        // --- LÓGICA DO ORM APLICADA AQUI ---

        // 1. Carrega o bean (objeto) do item do carrinho que se quer apagar
        $item = R::load('carrinhoitem', $item_id);

        // 2. Verificação de Segurança: Garante que o item pertence ao carrinho do cliente logado
        $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);
        $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);

        // 3. Se o item existe e pertence ao carrinho do cliente, apaga-o.
        if ($item->id && $carrinho && $item->carrinho_id == $carrinho->id) {
            R::trash($item); // Apaga o registo da tabela carrinhoitem
        }
    } catch (Exception $e) {
        error_log("Erro ao remover item do carrinho com ORM: " . $e->getMessage());
        // Em caso de erro, apenas redireciona sem fazer nada.
    }
}

// Redireciona de volta para a página do carrinho
header('Location: cart.php');
exit();
?>

