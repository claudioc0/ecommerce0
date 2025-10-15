<?php
// Ficheiro: src/connection/db.php

require_once __DIR__ . '/../classes/rb-mysql.php';

// Inicia a sessão, se ainda não estiver iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configura a conexão com a base de dados
R::setup(
    'mysql:host=localhost;dbname=ecommerce',
    'root',
    'PUC@1234' // A sua senha
);

// Congela o esquema. Isto é CRUCIAL para a abordagem "database first".
// Diz ao RedBeanPHP para NÃO criar ou alterar tabelas/colunas automaticamente.
R::freeze(true);

// Verifica a conexão (opcional, mas bom para depuração)
if (!R::testConnection()) {
    // Se a conexão falhar, o script para com uma mensagem clara.
    die('Não foi possível conectar à base de dados.');
}

?>

