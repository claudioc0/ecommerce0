<<<<<<< HEAD
<?php

session_start();
require_once "db.php";

if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit();
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST["nome"]);
    $descricao = trim($_POST["descricao"]);
    $preco = trim($_POST["preco"]);
    $quantidade = trim($_POST["quantidade"]);

    //if(empty($nome) || empty($preco) || empty($quantidade)) {
    //    $error = "Por favor, preencha os campos obrigatórios"
    //}
    // else{
    //    $sql = "INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)";
    //    $stat = $conn->prepare($sql);
    //    $stmt->bind_param("ssdi", $nome, $descricao, $preco, $quantidade);
//
    //    if($smt->execute()) {
    //        $success = "Produto cadastrado com sucesso"
    //    } else {
    //        $error = "Erro ao cadastrar produto " . $conn->error;
//
    //    }
//
    //    $stmt->close();
    //}
}
?>



<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Cadastro de Produto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            padding: 30px;
        }
        .container {
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 0 auto;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 15px;
        }
        button:hover {
            background-color: #45a049;
        }
        .msg {
            text-align: center;
            margin-bottom: 15px;
        }
        .sucesso { color: green; }
        .erro { color: red; }
        a.voltar {
            display: block;
            text-align: center;
            margin-top: 15px;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Cadastrar Produto</h2>

        <?php if (!empty($sucesso)): ?>
            <div class="msg sucesso"><?= htmlspecialchars($sucesso) ?></div>
        <?php elseif (!empty($erro)): ?>
            <div class="msg erro"><?= htmlspecialchars($erro) ?></div>
        <?php endif; ?>

        <form method="POST">
            <label>Nome do Produto *</label>
            <input type="text" name="nome" required>

            <label>Descrição</label>
            <textarea name="descricao" rows="4"></textarea>

            <label>Preço (R$) *</label>
            <input type="number" name="preco" step="0.01" required>

            <label>Quantidade *</label>
            <input type="number" name="quantidade" min="1" required>

            <button type="submit">Cadastrar</button>
        </form>

        <a href="dashboard.php" class="voltar">← Voltar ao painel</a>
    </div>
</body>
=======
<?php

session_start();
require_once "db.php";

if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php")
    exit();
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST["nome"]);
    $descricao = trim($_POST["descricao"]);
    $preco = trim(|$_POST["preco"]);
    $quantidade = trim($_POST["quantidade"]);

    if(empty($nome) || empty($preco) || empty($quantidade)) {
        $error = "Por favor, preencha os campos obrigatórios"

    } else {
        $sql = "INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)";
        $stat = $conn->prepare($sql);
        $stmt->bind_param("ssdi", $nome, $descricao, $preco, $quantidade);

        if($smt->execute()) {
            $success = "Produto cadastrado com sucesso"
        } else {
            $error = "Erro ao cadastrar produto " . $conn->error;

        }

        $stmt->close();
    }
}
?>



<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Cadastro de Produto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            padding: 30px;
        }
        .container {
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 0 auto;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 15px;
        }
        button:hover {
            background-color: #45a049;
        }
        .msg {
            text-align: center;
            margin-bottom: 15px;
        }
        .sucesso { color: green; }
        .erro { color: red; }
        a.voltar {
            display: block;
            text-align: center;
            margin-top: 15px;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Cadastrar Produto</h2>

        <?php if (!empty($sucesso)): ?>
            <div class="msg sucesso"><?= htmlspecialchars($sucesso) ?></div>
        <?php elseif (!empty($erro)): ?>
            <div class="msg erro"><?= htmlspecialchars($erro) ?></div>
        <?php endif; ?>

        <form method="POST">
            <label>Nome do Produto *</label>
            <input type="text" name="nome" required>

            <label>Descrição</label>
            <textarea name="descricao" rows="4"></textarea>

            <label>Preço (R$) *</label>
            <input type="number" name="preco" step="0.01" required>

            <label>Quantidade *</label>
            <input type="number" name="quantidade" min="1" required>

            <button type="submit">Cadastrar</button>
        </form>

        <a href="dashboard.php" class="voltar">← Voltar ao painel</a>
    </div>
</body>
>>>>>>> d80d84e05fdcb5b0cda9374dc3ea0d6d8e7b2e8c
</html>