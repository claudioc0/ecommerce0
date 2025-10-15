<?php
session_start();
require_once 'db.php';

// Proteção: Apenas vendedores podem aceder
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'vendor') {
    header('Location: index.php');
    exit();
}

// Valida o ID do produto
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: vendor_dashboard.php');
    exit();
}
$product_id = $_GET['id'];
$message = '';

// Se o formulário foi enviado (método POST), atualiza o produto
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $description = trim($_POST['description']);
    $price = $_POST['price'];
    $image = trim($_POST['image']);
    $category = trim($_POST['category']);
    $stock = $_POST['stock'];

    if (empty($name) || empty($price) || empty($stock)) {
        $message = '<p class="text-error">Nome, preço e estoque são obrigatórios.</p>';
    } else {
        try {
            $sql = "UPDATE Produto SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ? WHERE id_produto = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $description, $price, $image, $category, $stock, $product_id]);
            $message = '<p class="text-success">Produto atualizado com sucesso!</p>';
        } catch (PDOException $e) {
            error_log("Erro ao atualizar produto: " . $e->getMessage());
            $message = '<p class="text-error">Ocorreu um erro ao atualizar o produto.</p>';
        }
    }
}

// Busca os dados atuais do produto para preencher o formulário
try {
    $stmt = $pdo->prepare("SELECT * FROM Produto WHERE id_produto = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
    if (!$product) {
        header('Location: vendor_dashboard.php');
        exit();
    }
} catch (PDOException $e) {
    die("Erro ao carregar dados do produto.");
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Produto</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav id="navbar">
        <div class="nav-content">
            <a href="vendor_dashboard.php" class="logo">Painel do Vendedor</a>
            <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
        </div>
    </nav>

    <div class="container" style="padding-top: 32px;">
        <div class="admin-section">
            <h2>Editar Produto: <?php echo htmlspecialchars($product['name']); ?></h2>
            <?php echo $message; ?>
            <form method="POST" action="edit_product.php?id=<?php echo $product_id; ?>" class="checkout-form" style="padding:0; box-shadow:none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nome do Produto</label>
                        <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($product['name']); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="price">Preço</label>
                        <input type="number" step="0.01" id="price" name="price" value="<?php echo htmlspecialchars($product['price']); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Estoque</label>
                        <input type="number" id="stock" name="stock" value="<?php echo htmlspecialchars($product['stock']); ?>" required>
                    </div>
                     <div class="form-group">
                        <label for="category">Categoria</label>
                        <input type="text" id="category" name="category" value="<?php echo htmlspecialchars($product['category']); ?>">
                    </div>
                </div>
                <div class="form-group mt-4">
                    <label for="image">URL da Imagem</label>
                    <input type="url" id="image" name="image" value="<?php echo htmlspecialchars($product['image']); ?>">
                </div>
                <div class="form-group mt-4">
                    <label for="description">Descrição</label>
                    <textarea id="description" name="description" rows="4"><?php echo htmlspecialchars($product['description']); ?></textarea>
                </div>
                <button type="submit" class="btn-primary mt-4">Salvar Alterações</button>
            </form>
        </div>
    </div>
</body>
</html>
