<?php
session_start();

$message = '';

if (isset($_GET['status']) && $_GET['status'] == 'success') {
    $message = '<div class="text-success text-center mb-4">🎉 Cadastro realizado com sucesso! Faça o login para continuar.</div>';
}

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once 'db.php';

    $email = trim($_POST['email']);
    $senha = $_POST['senha']; 

    if (empty($email) || empty($senha)) {
        $message = '<div class="text-error text-center mb-4">Por favor, preencha todos os campos.</div>';
    } else {
        try {
            $sql = "SELECT id_usuario, nome, email, senha FROM Usuario WHERE email = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($senha, $user['senha'])) {
                
                $_SESSION['user_id'] = $user['id_usuario'];
                $_SESSION['user_name'] = $user['nome'];

                header('Location: dashboard.php');
                exit(); 

            } else {
                $message = '<div class="text-error text-center mb-4">E-mail ou senha inválidos.</div>';
            }

        } catch (PDOException $e) {
            error_log("Erro no login: " . $e->getMessage());
            $message = '<div class="text-error text-center mb-4">Ocorreu um erro ao processar seu login.</div>';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Nossa Loja</title>
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
            <h2>Acesse sua Conta</h2>
            <p style="color: var(--gray-500);">Bem-vindo de volta!</p>
        </div>

        <?php echo $message; ?>

        <form action="login.php" method="POST" class="auth-form active">
            <div class="form-group mb-4">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group mb-4">
                <label for="senha">Senha</label>
                <input type="password" id="senha" name="senha" required>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;">Entrar</button>
        </form>

        <p class="text-center" style="margin-top: 24px; color: var(--gray-400);">Não tem uma conta? <a href="register.php" class="nav-link" style="color: var(--primary-500); display: inline;">Crie uma agora</a></p>
    </div>
</body>
</html>