<?php
session_start();
require_once 'db.php';

// Valida o ID do produto na URL
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    // Redireciona para a página inicial se o ID for inválido
    header('Location: index.php');
    exit();
}
$product_id = $_GET['id'];

// Busca o produto no banco de dados
try {
    $stmt = $pdo->prepare("SELECT * FROM Produto WHERE id_produto = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
} catch (PDOException $e) {
    error_log("Erro ao buscar produto: " . $e->getMessage());
    $product = false;
}

// Se o produto não for encontrado, redireciona
if (!$product) {
    header('Location: index.php');
    exit();
}

// Verifica se o utilizador logado é um vendedor
$is_vendor = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'vendor';
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($product['name']); ?> - FashionStore</title>
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
            <img src="<?php echo htmlspecialchars($product['image'] ?: 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=Produto'); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
            <div class="product-detail-info">
                <h1><?php echo htmlspecialchars($product['name']); ?></h1>
                <p class="product-detail-price">R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></p>
                <p><?php echo nl2br(htmlspecialchars($product['description'])); ?></p>
                
                <div class="mt-4">
                    <?php if ($is_vendor): ?>
                        <!-- Botões para Vendedor -->
                        <a href="edit_product.php?id=<?php echo $product['id_produto']; ?>" class="btn-primary">Editar Produto</a>
                        <form action="delete_product.php" method="POST" onsubmit="return confirm('Tem a certeza de que deseja excluir este produto?');" style="display: inline;">
                            <input type="hidden" name="product_id" value="<?php echo $product['id_produto']; ?>">
                            <button type="submit" class="btn-secondary" style="background-color: var(--error-500); color: white; border: none;">Excluir Produto</button>
                        </form>
                    <?php else: ?>
                        <!-- Botão para Cliente -->
                        <button class="btn-primary" style="width: 100%;">Adicionar ao Carrinho</button>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
