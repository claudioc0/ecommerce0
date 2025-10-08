<<<<<<< HEAD
<?php
$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    require_once 'db.php';

    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = trim($_POST['senha']);
    $senha_confirm = trim($_POST['senha_confirm']);
    
    $errors = [];
    if (empty($nome)) {
        $errors[] = "O campo nome é obrigatório.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Formato de e-mail inválido.";
    }
    if (strlen($senha) < 8) {
        $errors[] = "A senha deve ter no mínimo 8 caracteres.";
    }
    if ($senha !== $senha_confirm) {
        $errors[] = "As senhas não coincidem.";
    }

    if (empty($errors)) {
        try {
            $sql_check = "SELECT id_usuario FROM Usuario WHERE email = ?";
            $stmt_check = $pdo->prepare($sql_check);
            $stmt_check->execute([$email]);

            if ($stmt_check->rowCount() > 0) {
                $errors[] = "Este e-mail já está cadastrado.";
            } else {
                $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

                $sql_insert = "INSERT INTO Usuario (nome, email, senha, role) VALUES (?, ?, ?, ?)";
                $stmt_insert = $pdo->prepare($sql_insert);
                
                $stmt_insert->execute([$nome, $email, $senha_hash, 'customer']);

                header('Location: login.php?status=success');
                exit(); 
            }
        } catch (PDOException $e) {
            error_log("Erro no cadastro: " . $e->getMessage());
            $message = '<div class="text-error text-center mb-4">Ocorreu um erro ao processar seu cadastro. Tente novamente.</div>';
        }
    }
    
    if (!empty($errors)) {
        $message = '<div class="text-error text-center mb-4">';
        foreach ($errors as $error) {
            $message .= "<p>$error</p>";
        }
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: var(--gray-50);
        }
        .auth-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-width: 450px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="text-center mb-4">
            <h2>Crie sua Conta</h2>
            <p style="color: var(--gray-500);">Rápido e fácil para começar a comprar.</p>
        </div>

        <?php echo $message; ?>

        <form action="register.php" method="POST" class="auth-form active">
            <div class="form-group mb-4">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" name="nome" required>
            </div>
            <div class="form-group mb-4">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
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

        <p class="text-center" style="margin-top: 24px; color: var(--gray-400);">Já tem uma conta? <a href="login.php" class="nav-link" style="color: var(--primary-500); display: inline;">Faça Login</a></p>
    </div>
</body>
=======
<?php
$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    require_once 'db.php';

    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = trim($_POST['senha']);
    $senha_confirm = trim($_POST['senha_confirm']);
    
    $errors = [];
    if (empty($nome)) {
        $errors[] = "O campo nome é obrigatório.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Formato de e-mail inválido.";
    }
    if (strlen($senha) < 8) {
        $errors[] = "A senha deve ter no mínimo 8 caracteres.";
    }
    if ($senha !== $senha_confirm) {
        $errors[] = "As senhas não coincidem.";
    }

    if (empty($errors)) {
        try {
            $sql_check = "SELECT id_usuario FROM Usuario WHERE email = ?";
            $stmt_check = $pdo->prepare($sql_check);
            $stmt_check->execute([$email]);

            if ($stmt_check->rowCount() > 0) {
                $errors[] = "Este e-mail já está cadastrado.";
            } else {
                $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

                $sql_insert = "INSERT INTO Usuario (nome, email, senha, role) VALUES (?, ?, ?, ?)";
                $stmt_insert = $pdo->prepare($sql_insert);
                
                $stmt_insert->execute([$nome, $email, $senha_hash, 'customer']);

                header('Location: login.php?status=success');
                exit(); 
            }
        } catch (PDOException $e) {
            error_log("Erro no cadastro: " . $e->getMessage());
            $message = '<div class="text-error text-center mb-4">Ocorreu um erro ao processar seu cadastro. Tente novamente.</div>';
        }
    }
    
    if (!empty($errors)) {
        $message = '<div class="text-error text-center mb-4">';
        foreach ($errors as $error) {
            $message .= "<p>$error</p>";
        }
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: var(--gray-50);
        }
        .auth-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-width: 450px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="text-center mb-4">
            <h2>Crie sua Conta</h2>
            <p style="color: var(--gray-500);">Rápido e fácil para começar a comprar.</p>
        </div>

        <?php echo $message; ?>

        <form action="register.php" method="POST" class="auth-form active">
            <div class="form-group mb-4">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" name="nome" required>
            </div>
            <div class="form-group mb-4">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
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

        <p class="text-center" style="margin-top: 24px; color: var(--gray-400);">Já tem uma conta? <a href="login.php" class="nav-link" style="color: var(--primary-500); display: inline;">Faça Login</a></p>
    </div>
</body>
>>>>>>> d80d84e05fdcb5b0cda9374dc3ea0d6d8e7b2e8c
</html>