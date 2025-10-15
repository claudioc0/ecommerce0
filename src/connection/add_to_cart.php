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
        // --- LÓGICA DO ORM PARA CARRINHO E CARRINHOITEM ---

        // 1. Verifica se o produto que se está a tentar adicionar realmente existe
        $produto = R::load('produto', $product_id);
        if (!$produto->id) {
            // Se o produto não existe, não faz nada.
            header('Location: index.php?status=product_not_found');
            exit();
        }
        
        // 2. Encontra o perfil do cliente logado
        $cliente = R::findOne('cliente', 'id_usuario = ?', [$_SESSION['user_id']]);
        if (!$cliente) {
            // Se não houver perfil de cliente, não pode adicionar ao carrinho
             header('Location: index.php?status=customer_profile_not_found');
            exit();
        }

        // 3. Encontra ou cria um carrinho ativo para este cliente
        $carrinho = R::findOne('carrinho', 'id_cliente = ?', [$cliente->id]);
        if (!$carrinho) {
            $carrinho = R::dispense('carrinho');
            $carrinho->id_cliente = $cliente->id;
            // O ID do carrinho será gerado ao guardar
        }
        
        // 4. Verifica se este item já existe no carrinho para apenas incrementar a quantidade
        $itemExistente = R::findOne('carrinhoitem', 'carrinho_id = ? AND id_produto = ?', [$carrinho->id, $product_id]);

        if ($itemExistente) {
            // Se o item já existe, apenas incrementa a quantidade
            $itemExistente->quantidade += 1;
            R::store($itemExistente);
        } else {
            // Se for um novo item, cria um novo bean CarrinhoItem
            $novoItem = R::dispense('carrinhoitem');
            $novoItem->id_produto = $product_id;
            $novoItem->quantidade = 1;
            
            // Associa o novo item ao carrinho do cliente
            $carrinho->ownCarrinhoitemList[] = $novoItem;
            R::store($carrinho);
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