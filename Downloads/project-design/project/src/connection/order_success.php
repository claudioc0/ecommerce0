<?php
session_start();

// Protege a página: só pode ser acedida se um ID de pedido for fornecido
if (!isset($_GET['order_id'])) {
    header('Location: index.php');
    exit();
}
$order_id = htmlspecialchars($_GET['order_id']);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compra Realizada com Sucesso!</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="[https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap)" rel="stylesheet">
</head>
<body>
    <div class="container" style="padding-top: 40px; text-align: center;">
        <div class="empty-state" style="max-width: 500px; margin: auto;">
            <h1 class="text-success">🎉 Pedido Realizado com Sucesso!</h1>
            <p>Obrigado pela sua compra! O seu pedido foi registado com o número <strong>#<?php echo $order_id; ?></strong>.</p>
            <p>Em breve, você receberá atualizações sobre o envio no seu e-mail.</p>
            <a href="index.php" class="btn-primary" style="margin-top: 24px;">Voltar à Loja</a>
        </div>
    </div>
</body>
</html>
