<?php
// Ficheiro: src/connection/vendor_dashboard.php
require_once 'db.php'; // Inicia a sessão e o RedBeanPHP simplificado

// Proteção da página
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'vendor') {
    header('Location: index.php');
    exit();
}

// A busca agora usa a coluna 'usuario_id'
$lojista = R::findOne('lojista', 'usuario_id = ?', [$_SESSION['user_id']]);
$message = '';

if (!$lojista) {
    header('Location: index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_product'])) {
    if (empty($_POST['name']) || empty($_POST['price']) || !isset($_POST['stock'])) {
        $message = '<p class="text-error">Nome, preço e estoque são obrigatórios.</p>';
    } else {
        try {
            R::begin();

            $produto = R::dispense('produto');
            $produto->name = trim($_POST['name']);
            $produto->description = trim($_POST['description']);
            $produto->price = $_POST['price'];
            $produto->image = trim($_POST['image']);
            $produto->category = trim($_POST['category']);
            $produto->stock = (int)$_POST['stock'];
            
            // --- CORREÇÃO: O RedBeanPHP entende a relação e o nome da coluna 'lojista_id' ---
            $produto->lojista_id = $lojista->id; 
            
            // NÃO PRECISAMOS DE DEFINIR 'created_at'. O RedBeanPHP faz isso por nós
            // porque a coluna na BD chama-se 'created_at'.
            
            R::store($produto);
            
            $notificacao = R::dispense('notificacao');
            $notificacao->lojista_id = $lojista->id;
            $notificacao->mensagem = "Novo produto '" . $produto->name . "' foi cadastrado por você.";
            R::store($notificacao);

            R::commit();

            $message = '<p class="text-success">Produto cadastrado com sucesso!</p>';

        } catch (Exception $e) {
            R::rollback();
            error_log("Erro ao cadastrar produto com ORM: " . $e->getMessage());
            $message = '<p class="text-error">Ocorreu um erro ao cadastrar o produto. Verifique os logs.</p>';
        }
    }
}

// --- CORREÇÃO: A busca agora usa as colunas corretas ('lojista_id' e 'created_at') ---
$vendor_products = R::find('produto', 'lojista_id = ? ORDER BY created_at DESC', [$lojista->id]);

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
        <!-- Formulário para Adicionar Novo Produto -->
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
                        <input type="number" id="stock" name="stock" required min="0">
                    </div>
                     <div class="form-group">
                        <label for="category">Categoria</label>
                        <input type="text" id="category" name="category">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label for="image">URL da Imagem</label>
                    <input type="url" id="image" name="image" placeholder="https://placehold.co/600x400">
                </div>
                <div class="form-group" style="margin-top: 16px;">
                    <label for="description">Descrição</label>
                    <textarea id="description" name="description" rows="4"></textarea>
                </div>
                <button type="submit" class="btn-primary" style="margin-top: 24px;">Adicionar Produto</button>
            </form>
        </div>

        <!-- Tabela para Listar Produtos Existentes -->
        <div class="admin-section" style="margin-top: 32px;">
            <h2>Meus Produtos Cadastrados</h2>
            <?php if (empty($vendor_products)): ?>
                <p>Você ainda não cadastrou nenhum produto.</p>
            <?php else: ?>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($vendor_products as $product): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($product->name); ?></td>
                                    <td>R$ <?php echo number_format($product->price, 2, ',', '.'); ?></td>
                                    <td><?php echo htmlspecialchars($product->stock); ?></td>
                                    <td>
                                        <a href="product_detail.php?id=<?php echo $product->id; ?>" class="btn-secondary btn-sm">Ver</a>
                                        <a href="edit_product.php?id=<?php echo $product->id; ?>" class="btn-secondary btn-sm">Editar</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>

