<?php
session_start();

// Proteção da página: Apenas usuários logados e com a role 'vendor' podem aceder
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'vendor') {
    header('Location: index.php');
    exit();
}

require_once 'db.php';
$message = '';

// Lógica para cadastrar novo produto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_product'])) {
    $name = trim($_POST['name']);
    $description = trim($_POST['description']);
    $price = $_POST['price'];
    $image = trim($_POST['image']);
    $category = trim($_POST['category']);
    $stock = $_POST['stock'];

    // --- VALIDAÇÃO ATUALIZADA AQUI ---
    if (empty($name) || empty($price) || $stock === '') {
        $message = '<p class="text-error">Nome, preço e estoque são obrigatórios.</p>';
    } elseif ($stock < 0) {
        // Nova verificação para garantir que o estoque não é negativo
        $message = '<p class="text-error">A quantidade em estoque não pode ser um número negativo.</p>';
    } else {
        try {
            $sql = "INSERT INTO Produto (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $description, $price, $image, $category, $stock]);
            $message = '<p class="text-success">Produto cadastrado com sucesso!</p>';
        } catch (PDOException $e) {
            error_log("Erro ao cadastrar produto: " . $e->getMessage());
            $message = '<p class="text-error">Ocorreu um erro ao cadastrar o produto.</p>';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Vendedor</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav id="navbar">
        <div class="nav-content">
            <a href="index.php" class="logo">FashionStore</a>
            <div class="nav-links">
                <span>Olá, <?php echo htmlspecialchars($_SESSION['user_name']); ?>! (Vendedor)</span>
                <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
            </div>
        </div>
    </nav>

    <div class="container" style="padding-top: 32px;">
        <div class="admin-section">
            <h2>Cadastrar Novo Produto</h2>
            <?php echo $message; ?>
            <form method="POST" action="vendor_dashboard.php" class="checkout-form" style="padding:0; box-shadow:none;">
                <input type="hidden" name="add_product" value="1">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nome do Produto</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="price">Preço (ex: 99.90)</label>
                        <input type="number" step="0.01" id="price" name="price" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Estoque</label>
                        <!-- --- VALIDAÇÃO HTML ADICIONADA AQUI --- -->
                        <input type="number" id="stock" name="stock" required min="0">
                    </div>
                     <div class="form-group">
                        <label for="category">Categoria</label>
                        <input type="text" id="category" name="category">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label for="image">URL da Imagem</label>
                    <input type="url" id="image" name="image" placeholder="https://exemplo.com/imagem.jpg">
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label for="description">Descrição</label>
                    <textarea id="description" name="description" rows="4"></textarea>
                </div>
                <button type="submit" class="btn-primary" style="margin-top: 24px;">Adicionar Produto</button>
            </form>
        </div>
    </div>
</body>
</html>

