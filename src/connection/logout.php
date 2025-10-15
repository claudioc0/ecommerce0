<?php
// 1. Inicia a sessão para poder aceder-lhe.
session_start();

// 2. Remove todas as variáveis da sessão (como user_id e user_name).
session_unset();

// 3. Destrói a sessão por completo.
session_destroy();

// 4. Redireciona o utilizador de volta para a página principal (index.php),
//    que está na mesma pasta.
header('Location: index.php');
exit();
?>