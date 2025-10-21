<?php
// Ficheiro: src/connection/db.php

require_once __DIR__ . '/../classes/rb-mysql.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

R::setup(
    'mysql:host=localhost;dbname=ecommerce',
    'root',
    'root' // A sua senha
);

// Congela o esquema para a abordagem "database first".
R::freeze(true);



if (!R::testConnection()) {
    die('Não foi possível conectar à base de dados.');
}
?>

