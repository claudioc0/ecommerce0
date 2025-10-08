<?php
// Arquivo: db.php

$host = 'localhost';
$db   = 'ecommerce';
$user = 'root';
$pass = 'PUC@1234'; // <-- Sua senha
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Em caso de erro na conexão, lança uma exceção que será capturada no outro arquivo.
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>