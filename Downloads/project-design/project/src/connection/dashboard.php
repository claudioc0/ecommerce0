<?php
session_start();


if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}


$userName = htmlspecialchars($_SESSION['user_name']);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Usuário</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container" style="padding-top: 40px; text-align: center;">
        
        <h1>🎉 Bem-vindo ao seu Painel, <?php echo $userName; ?>!</h1>
        
        <p>Você está logado com sucesso.</p>
        <br>
        <a href="register.php" class="btn-secondary">Sair (Logout)</a>
    </div>
</body>
</html>