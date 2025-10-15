<?php
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'vendor') {
    header('Location: index.php');
    exit();
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: vendor_dashboard.php');
    exit();
}

$product_id = $_GET['id'];
$message = '';

// --- LÓGICA DO ORM APLICADA AQUI ---

// 1. Carrega o bean (objeto) do produto que se quer editar
$produto = R::load('produto', $product_id);

// 2. Carrega o bean do vendedor que está logado
$lojista = R::findOne('lojista', 'id_usuario = ?', [$_SESSION['user_id']]);

// 3. Verificação de Segurança CRUCIAL:
// Garante que o produto existe E que pertence ao vendedor logado.
if (!$produto->id || !$lojista || $produto->id_lojista != $lojista->id) {
    // Se o produto não existe ou não pertence ao vendedor, redireciona.
    header('Location: vendor_dashboard.php?status=not_found');
    exit();
}

// Se o formulário foi enviado (método POST), atualiza o produto
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validação dos campos
    if (empty($_POST['name']) || empty($_POST['price']) || !isset($_POST['stock'])) {
        $message = '<p class="text-error">Nome, preço e estoque são obrigatórios.</p>';
    } else {
        try {
            // 4. Atualiza as propriedades do bean com os dados do formulário
            $produto->name = trim($_POST['name']);
            $produto->description = trim($_POST['description']);
            $produto->price = $_POST['price'];
            $produto->image = trim($_POST['image']);
            $produto->category = trim($_POST['category']);
            $produto->stock = (int)$_POST['stock'] >= 0 ? (int)$_POST['stock'] : 0;
            
            // 5. Salva as alterações na base de dados.
            // O RedBeanPHP deteta que o bean já existe e faz um UPDATE em vez de um INSERT.
            R::store($produto);
            
            $message = '<p class="text-success">Produto atualizado com sucesso!</p>';
            
        } catch (Exception $e) {
            error_log("Erro ao atualizar produto com ORM: " . $e->getMessage());
            $message = '<p class="text-error">Ocorreu um erro ao atualizar o produto.</p>';
        }
    }
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
            <div class="nav-links">
                <a href="vendor_dashboard.php" class="nav-link">Meus Produtos</a>
                <a href="logout.php" class="btn-secondary btn-sm">Sair</a>
            </div>
        </div>
    </nav>

    <div class="container" style="padding-top: 32px;">
        <div class="admin-section">
            <h2>Editar Produto: <?php echo htmlspecialchars($produto->name); ?></h2>
            <?php echo $message; ?>
            <form method="POST" action="edit_product.php?id=<?php echo $product_id; ?>" class="checkout-form" style="padding:0; box-shadow:none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nome do Produto</label>
                        <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($produto->name); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="price">Preço</label>
                        <input type="number" step="0.01" id="price" name="price" value="<?php echo htmlspecialchars($produto->price); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Estoque</label>
                        <input type="number" min="0" id="stock" name="stock" value="<?php echo htmlspecialchars($produto->stock); ?>" required>
                    </div>
                     <div class="form-group">
                        <label for="category">Categoria</label>
                        <input type="text" id="category" name="category" value="<?php echo htmlspecialchars($produto->category); ?>">
                    </div>
                </div>
                <div class="form-group mt-4">
                    <label for="image">URL da Imagem</label>
                    <input type="url" id="image" name="image" value="<?php echo htmlspecialchars($produto->image); ?>">
                </div>
                <div class="form-group mt-4">
                    <label for="description">Descrição</label>
                    <textarea id="description" name="description" rows="4"><?php echo htmlspecialchars($produto->description); ?></textarea>
                </div>
                <button type="submit" class="btn-primary mt-4">Salvar Alterações</button>
            </form>
        </div>
    </div>
</body>
</html>

