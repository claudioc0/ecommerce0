<?php
// Ficheiro: src/connection/product_detail.php
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// --- LÓGICA DO CARRINHO ATUALIZADA AQUI ---
$cart_item_count = 0;
if (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'customer') {
    try {
        $cliente = R::findOne('cliente', 'usuario_id = ?', [$_SESSION['user_id']]);
        if ($cliente) {
            $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);
            if ($carrinho) {
                // Conta o número de registos em 'carrinhoitem' associados a este carrinho
                $cart_item_count = R::count('carrinhoitem', 'carrinho_id = ?', [$carrinho->id]);
            }
        }
    } catch(Exception $e) {
        error_log("Erro ao contar itens do carrinho: " . $e->getMessage());
    }
}


// Valida o ID do produto na URL
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: index.php');
    exit();
}
$product_id = $_GET['id'];

$product = R::load('produto', $product_id);

if (!$product->id) {
    header('Location: index.php?status=not_found');
    exit();
}

$is_owner = false;
if (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'vendor') {
    $lojista = R::findOne('lojista', 'usuario_id = ?', [$_SESSION['user_id']]);
    if ($lojista && $lojista->id == $product->lojista_id) {
        $is_owner = true;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($product->name); ?> - FashionStore</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav id="navbar">
        <div class="nav-content">
            <a href="index.php" class="logo">FashionStore</a>
            <div class="nav-links">
                 <?php if (isset($_SESSION['user_id'])): ?>
                    <span>Olá, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</span>
                    <?php if ($_SESSION['user_role'] === 'vendor'): ?>
                        <a href="vendor_dashboard.php" class="nav-link">Painel</a>
                    <?php elseif ($_SESSION['user_role'] === 'customer'): ?>
                         <a href="cart.php" class="cart-container" title="Carrinho">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <?php if ($cart_item_count > 0): ?>
                                <span class="cart-badge"><?php echo $cart_item_count; ?></span>
                            <?php endif; ?>
                        </a>
                    <?php endif; ?>
                    <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
                <?php else: ?>
                    <a href="login.php" class="nav-link">Login</a>
                    <a href="register.php" class="btn-primary btn-sm">Cadastrar</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <div class="container" style="padding-top: 32px;">
        <div class="product-detail">
            <img src="<?php echo htmlspecialchars($product->image ?: 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=Produto'); ?>" alt="<?php echo htmlspecialchars($product->name); ?>">
            <div class="product-detail-info">
                <h1><?php echo htmlspecialchars($product->name); ?></h1>
                <p class="product-detail-price">R$ <?php echo number_format($product->price, 2, ',', '.'); ?></p>
                <p><?php echo nl2br(htmlspecialchars($product->description)); ?></p>
                
                <div class="mt-4">
                    <?php if ($is_owner): ?>
                        <a href="edit_product.php?id=<?php echo $product->id; ?>" class="btn-primary">Editar Produto</a>
                        <form action="delete_product.php" method="POST" onsubmit="return confirm('Tem a certeza de que deseja excluir este produto?');" style="display: inline;">
                            <input type="hidden" name="product_id" value="<?php echo $product->id; ?>">
                            <button type="submit" class="btn-secondary" style="background-color: var(--error-500); color: white; border: none;">Excluir Produto</button>
                        </form>

                    <?php elseif (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'customer'): ?>
                        <form action="add_to_cart.php" method="POST">
                            <input type="hidden" name="product_id" value="<?php echo $product->id; ?>">
                            <button type="submit" class="btn-primary" style="width: 100%;">Adicionar ao Carrinho</button>
                        </form>

                    <?php elseif (!isset($_SESSION['user_id'])): ?>
                        <a href="login.php" class="btn-primary" style="width: 100%; text-align: center;">Adicionar ao Carrinho</a>
                    
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

