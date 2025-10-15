<?php
// Ficheiro: src/connection/vendor_dashboard.php (Refatorado com ORM)
require_once 'db.php'; // Inicia a sessão e configura o RedBeanPHP

// Proteção da página
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'vendor') {
    header('Location: index.php');
    exit();
}

$lojista = R::findOne('lojista', 'id_usuario = ?', [$_SESSION['user_id']]);
$message = '';

if (!$lojista) {
    // Se não houver um perfil de lojista, redireciona por segurança.
    header('Location: index.php');
    exit();
}

// Lógica para cadastrar novo produto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_product'])) {
    if (empty($_POST['name']) || empty($_POST['price']) || !isset($_POST['stock'])) {
        $message = '<p class="text-error">Nome, preço e estoque são obrigatórios.</p>';
    } elseif ((int)$_POST['stock'] < 0) {
        $message = '<p class="text-error">A quantidade em estoque não pode ser um número negativo.</p>';
    } else {
        try {
            // Cria o bean do produto
            $produto = R::dispense('produto');
            $produto->name = trim($_POST['name']);
            $produto->description = trim($_POST['description']);
            $produto->price = $_POST['price'];
            $produto->image = trim($_POST['image']);
            $produto->category = trim($_POST['category']);
            $produto->stock = (int)$_POST['stock'];
            $produto->id_lojista = $lojista->id;
            $produto->createdAt = date('Y-m-d H:i:s');
            
            R::store($produto);
            
            // --- GERAÇÃO DA CLASSE/TABELA NOTIFICAÇÃO ---
            // Após o produto ser guardado com sucesso, cria uma notificação.
            $notificacao = R::dispense('notificacao');
            $notificacao->mensagem = "Novo produto '" . $produto->name . "' foi cadastrado pelo vendedor " . htmlspecialchars($_SESSION['user_name']) . ".";
            R::store($notificacao);

            $message = '<p class="text-success">Produto cadastrado com sucesso e notificação gerada!</p>';

        } catch (Exception $e) {
            error_log("Erro ao cadastrar produto com ORM: " . $e->getMessage());
            $message = '<p class="text-error">Ocorreu um erro ao cadastrar o produto.</p>';
        }
    }
}

// Busca apenas os produtos que pertencem ao lojista logado
$vendor_products = R::find('produto', 'id_lojista = ? ORDER BY createdAt DESC', [$lojista->id]);

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
                <!-- O resto do seu formulário HTML continua aqui... -->
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
                    <input type="url" id="image" name="image" placeholder="https://exemplo.com/imagem.jpg">
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

