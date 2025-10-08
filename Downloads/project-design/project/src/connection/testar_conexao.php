<<<<<<< HEAD
<?php
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Conexão com o Banco de Dados</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5; }
        .container { text-align: center; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .success { background-color: #e6ffed; border: 2px solid #34c759; }
        .error { background-color: #ffebe6; border: 2px solid #ff3b30; }
        h1 { margin-top: 0; }
        p { font-size: 1.1rem; color: #333; }
    </style>
</head>
<body>

    <?php
    try {
        require_once 'db.php';

        $stmt = $pdo->query('SELECT 1');

        echo '<div class="container success">';
        echo '<h1>🎉 Conexão bem-sucedida!</h1>';
        echo '<p>O PHP conectou-se com sucesso ao banco de dados "'. htmlspecialchars($db) .'".</p>';
        echo '<p>Hora do servidor: ' . date('Y-m-d H:i:s') . '</p>';
        echo '</div>';

    } catch (PDOException $e) {
        echo '<div class="container error">';
        echo '<h1>❌ Falha na Conexão!</h1>';
        echo '<p>Não foi possível conectar ao banco de dados. Verifique as credenciais e se o serviço do MySQL está em execução.</p>';
        echo '<p><strong>Erro:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
        echo '</div>';
    }
    ?>

</body>
=======
<?php
// Arquivo: testar_conexao.php
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Conexão com o Banco de Dados</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5; }
        .container { text-align: center; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .success { background-color: #e6ffed; border: 2px solid #34c759; }
        .error { background-color: #ffebe6; border: 2px solid #ff3b30; }
        h1 { margin-top: 0; }
        p { font-size: 1.1rem; color: #333; }
    </style>
</head>
<body>

    <?php
    try {
        // Tenta incluir o arquivo de conexão
        require_once 'db.php';

        // Se o script chegou até aqui, a variável $pdo foi criada com sucesso em db.php
        // Vamos fazer uma consulta simples para ter 100% de certeza.
        $stmt = $pdo->query('SELECT 1');

        // Se tudo deu certo, exibe a caixa de sucesso
        echo '<div class="container success">';
        echo '<h1>🎉 Conexão bem-sucedida!</h1>';
        echo '<p>O PHP conectou-se com sucesso ao banco de dados "'. htmlspecialchars($db) .'".</p>';
        echo '<p>Hora do servidor: ' . date('Y-m-d H:i:s') . '</p>';
        echo '</div>';

    } catch (PDOException $e) {
        // Se a inclusão ou a consulta falhou, o catch será acionado
        // E exibirá a caixa de erro
        echo '<div class="container error">';
        echo '<h1>❌ Falha na Conexão!</h1>';
        echo '<p>Não foi possível conectar ao banco de dados. Verifique as credenciais e se o serviço do MySQL está em execução.</p>';
        // A linha abaixo é útil para depuração, mas pode expor informações sensíveis.
        // Remova ou comente em um ambiente de produção.
        echo '<p><strong>Erro:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
        echo '</div>';
    }
    ?>

</body>
>>>>>>> d80d84e05fdcb5b0cda9374dc3ea0d6d8e7b2e8c
</html>