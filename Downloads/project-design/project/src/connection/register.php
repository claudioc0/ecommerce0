<?php
session_start();

if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once 'db.php';

    // --- Início da Transação ---
    $pdo->beginTransaction();

    try {
        // Dados Comuns
        $nome = trim($_POST['nome']);
        $email = trim($_POST['email']);
        $senha = trim($_POST['senha']);
        $senha_confirm = trim($_POST['senha_confirm']);
        $role = $_POST['role']; // 'customer' ou 'vendor'

        // Validação
        $errors = [];
        if (empty($nome) || !in_array($role, ['customer', 'vendor'])) {
            $errors[] = "Dados inválidos. Por favor, preencha todos os campos.";
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = "Formato de e-mail inválido."; }
        if (strlen($senha) < 8) { $errors[] = "A senha deve ter no mínimo 8 caracteres."; }
        if ($senha !== $senha_confirm) { $errors[] = "As senhas não coincidem."; }

        // Validação específica para Vendedor
        if ($role === 'vendor') {
            if (empty($_POST['cnpj']) || empty($_POST['razao_social']) || empty($_POST['nome_loja'])) {
                $errors[] = "Para vendedores, todos os campos da loja são obrigatórios.";
            }
        }
        
        // Verifica se o e-mail já existe
        $sql_check = "SELECT id_usuario FROM Usuario WHERE email = ?";
        $stmt_check = $pdo->prepare($sql_check);
        $stmt_check->execute([$email]);
        if ($stmt_check->rowCount() > 0) {
            $errors[] = "Este e-mail já está cadastrado.";
        }

        if (empty($errors)) {
            // 1. Inserir na tabela Usuario
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            $sql_insert_user = "INSERT INTO Usuario (nome, email, senha, role) VALUES (?, ?, ?, ?)";
            $stmt_user = $pdo->prepare($sql_insert_user);
            $stmt_user->execute([$nome, $email, $senha_hash, $role]);
            
            // Obter o ID do usuário recém-criado
            $id_usuario = $pdo->lastInsertId();

            // 2. Inserir na tabela Cliente ou Lojista
            if ($role === 'customer') {
                $sql_insert_customer = "INSERT INTO Cliente (id_usuario) VALUES (?)";
                $stmt_customer = $pdo->prepare($sql_insert_customer);
                $stmt_customer->execute([$id_usuario]);
            } elseif ($role === 'vendor') {
                $cnpj = trim($_POST['cnpj']);
                $razao_social = trim($_POST['razao_social']);
                $nome_loja = trim($_POST['nome_loja']);

                $sql_insert_vendor = "INSERT INTO Lojista (id_usuario, cnpj, razao_social, nome_loja) VALUES (?, ?, ?, ?)";
                $stmt_vendor = $pdo->prepare($sql_insert_vendor);
                $stmt_vendor->execute([$id_usuario, $cnpj, $razao_social, $nome_loja]);
            }
            
            // Se tudo correu bem, confirma a transação
            $pdo->commit();
            header('Location: login.php?status=success');
            exit();

        } else {
            $pdo->rollBack(); // Desfaz a transação se houver erros de validação
        }

    } catch (PDOException $e) {
        $pdo->rollBack(); // Desfaz a transação em caso de erro no banco de dados
        error_log("Erro no cadastro: " . $e->getMessage());
        $message = '<div class="text-error text-center mb-4">Ocorreu um erro ao processar seu cadastro.</div>';
    }
    
    if (!empty($errors)) {
        $message = '<div class="text-error text-center mb-4">';
        foreach ($errors as $error) { $message .= "<p>$error</p>"; }
        $message .= '</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Conta - Nossa Loja</title>
    <link rel="stylesheet" href="../styles/main.css"> 
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: var(--gray-50); padding: 20px 0; }
        .auth-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 480px; width: 100%; }
        .role-selector { display: flex; gap: 16px; margin-bottom: 24px; }
        .role-option { flex: 1; padding: 12px; border: 2px solid var(--gray-300); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease; }
        .role-option input { display: none; }
        .role-option.selected { border-color: var(--primary-500); background-color: var(--primary-50); }
        #vendor-fields { display: none; }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="text-center mb-4">
            <h2>Crie sua Conta</h2>
            <p style="color: var(--gray-500);">Escolha seu perfil para começar.</p>
        </div>
        <?php echo $message; ?>
        <form action="register.php" method="POST" class="auth-form active">
            <div class="role-selector">
                <label class="role-option selected" id="label-customer">
                    <input type="radio" name="role" value="customer" checked> Sou Cliente
                </label>
                <label class="role-option" id="label-vendor">
                    <input type="radio" name="role" value="vendor"> Sou Vendedor
                </label>
            </div>
            
            <div class="form-group mb-4">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" name="nome" required>
            </div>
            <div class="form-group mb-4">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <!-- Campos específicos do Vendedor -->
            <div id="vendor-fields">
                 <div class="form-group mb-4">
                    <label for="cnpj">CNPJ</label>
                    <input type="text" id="cnpj" name="cnpj">
                </div>
                 <div class="form-group mb-4">
                    <label for="razao_social">Razão Social</label>
                    <input type="text" id="razao_social" name="razao_social">
                </div>
                 <div class="form-group mb-4">
                    <label for="nome_loja">Nome da Loja</label>
                    <input type="text" id="nome_loja" name="nome_loja">
                </div>
            </div>

            <div class="form-group mb-4">
                <label for="senha">Senha (mínimo 8 caracteres)</label>
                <input type="password" id="senha" name="senha" required>
            </div>
            <div class="form-group mb-4">
                <label for="senha_confirm">Confirmar Senha</label>
                <input type="password" id="senha_confirm" name="senha_confirm" required>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;">Cadastrar</button>
        </form>
        <p class="text-center" style="margin-top: 24px; color: var(--gray-400);">Já tem uma conta? <a href="login.php">Faça Login</a></p>
    </div>

    <script>
        const customerLabel = document.getElementById('label-customer');
        const vendorLabel = document.getElementById('label-vendor');
        const vendorFields = document.getElementById('vendor-fields');

        document.querySelectorAll('input[name="role"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'vendor') {
                    vendorFields.style.display = 'block';
                    vendorLabel.classList.add('selected');
                    customerLabel.classList.remove('selected');
                } else {
                    vendorFields.style.display = 'none';
                    vendorLabel.classList.remove('selected');
                    customerLabel.classList.add('selected');
                }
            });
        });
    </script>
</body>
</html>

