<?php
// Ficheiro: src/connection/add_to_cart.php (Refatorado para usar a BD)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção: Apenas clientes logados podem adicionar ao carrinho
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'customer') {
    header('Location: login.php');
    exit();
}

// Verifica se o formulário foi enviado com o ID do produto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id'])) {
    $product_id = (int)$_POST['product_id'];

    try {
        // --- LÓGICA DO ORM CORRIGIDA ---

        // 1. Verifica se o produto que se está a tentar adicionar realmente existe
        $produto = R::load('produto', $product_id);
        if (!$produto->id) {
            header('Location: index.php?status=product_not_found');
            exit();
        }
        
        // 2. Encontra o perfil do cliente logado usando a coluna correta 'usuario_id'
        $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);
        if (!$cliente) {
             header('Location: index.php?status=customer_profile_not_found');
            exit();
        }

        // 3. Encontra ou cria um carrinho ativo para este cliente usando a coluna correta 'cliente_id'
        $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);
        if (!$carrinho) {
            $carrinho = R::dispense('carrinho');
            $carrinho->cliente_id = $cliente->id;
            // O ID do carrinho será gerado ao guardar
            R::store($carrinho);
        }
        
        // 4. Verifica se este item já existe no carrinho para apenas incrementar a quantidade
        $itemExistente = R::findOne('carrinhoitem', 'carrinho_id = ? AND produto_id = ?', [$carrinho->id, $product_id]);

        if ($itemExistente) {
            // Se o item já existe, apenas incrementa a quantidade
            $itemExistente->quantidade += 1;
            R::store($itemExistente);
        } else {
            // Se for um novo item, cria um novo bean CarrinhoItem
            $novoItem = R::dispense('carrinhoitem');
            $novoItem->carrinho_id = $carrinho->id;
            $novoItem->produto_id = $product_id;
            $novoItem->quantidade = 1;
            R::store($novoItem);
        }
        
    } catch (Exception $e) {
        error_log("Erro ao adicionar ao carrinho com ORM: " . $e->getMessage());
    }
}

// Redireciona o utilizador de volta para a página de onde ele veio
$previous_page = $_SERVER['HTTP_REFERER'] ?? 'index.php';
header("Location: $previous_page");
exit();
?>

