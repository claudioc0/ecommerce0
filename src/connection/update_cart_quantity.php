<?php
// Ficheiro: src/connection/update_cart_quantity.php
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção: Apenas clientes logados podem alterar o carrinho
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: index.php');
    exit();
}

// Verifica se os dados necessários foram enviados
if (isset($_POST['item_id']) && isset($_POST['action'])) {
    $item_id = (int)$_POST['item_id'];
    $action = $_POST['action'];

    try {
        // --- LÓGICA DO ORM APLICADA AQUI ---

        // 1. Carrega o bean (objeto) do item do carrinho que se quer atualizar
        $item = R::load('carrinhoitem', $item_id);
        
        // 2. Verificação de Segurança: Garante que o item pertence ao carrinho do cliente logado
        $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);
        $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);

        // 3. Se o item existe e pertence ao carrinho do cliente, atualiza a quantidade
        if ($item->id && $carrinho && $item->carrinho_id == $carrinho->id) {
            if ($action === 'increase') {
                $item->quantidade += 1;
                R::store($item);
            } elseif ($action === 'decrease') {
                if ($item->quantidade > 1) {
                    // Se a quantidade for maior que 1, apenas diminui
                    $item->quantidade -= 1;
                    R::store($item);
                } else {
                    // Se a quantidade for 1 ou menos, remove o item do carrinho
                    R::trash($item);
                }
            }
        }
    } catch (Exception $e) {
        error_log("Erro ao atualizar quantidade no carrinho com ORM: " . $e->getMessage());
        // Em caso de erro, apenas redireciona sem fazer nada.
    }
}

// Redireciona de volta para a página do carrinho
header('Location: cart.php');
exit();
?>

