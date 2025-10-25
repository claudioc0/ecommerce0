<?php
require_once 'db.php';
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.php');
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_user_id'])) {
    $userId = filter_var($_POST['delete_user_id'], FILTER_VALIDATE_INT);

    if ($userId) {
        try {
            R::begin();

            $user = R::load('usuario', $userId);

            if ($user->id) {
                if ($user->id == $_SESSION['user_id']) {
                    $_SESSION['error'] = 'Você não pode deletar sua própria conta!';
                } else {
                    $userName = $user->nome;

                    R::trash($user);

                    R::commit();
                    $_SESSION['success'] = "Usuário '$userName' deletado com sucesso!";
                }
            } else {
                $_SESSION['error'] = 'Usuário não encontrado.';
            }
        } catch (Exception $e) {
            R::rollback();
            $_SESSION['error'] = 'Erro ao deletar usuário: ' . $e->getMessage();
        }
    }

    header('Location: admin_manage_users.php');
    exit();
}
$users = R::findAll('usuario', 'ORDER BY created_at DESC');

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Usuários - Admin</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .admin-header {
            background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
            color: white;
            padding: 32px 0;
            margin-bottom: 32px;
        }

        .admin-header h1 {
            margin-bottom: 8px;
        }

        .admin-header p {
            opacity: 0.9;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-600);
            margin-bottom: 8px;
        }

        .stat-label {
            color: var(--gray-600);
            font-size: 0.9rem;
        }

        .users-table {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .table-header {
            padding: 24px;
            border-bottom: 1px solid var(--gray-200);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: var(--gray-50);
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: var(--gray-700);
            border-bottom: 2px solid var(--gray-200);
        }

        td {
            padding: 16px;
            border-bottom: 1px solid var(--gray-100);
        }

        tr:hover {
            background: var(--gray-50);
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .badge-admin {
            background: var(--error-500);
            color: white;
        }

        .badge-vendor {
            background: var(--secondary-500);
            color: white;
        }

        .badge-customer {
            background: var(--success-500);
            color: white;
        }

        .btn-danger {
            background: var(--error-500);
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-danger:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }

        .btn-danger:disabled {
            background: var(--gray-300);
            cursor: not-allowed;
        }

        .alert {
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-weight: 500;
        }

        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid var(--success-500);
        }

        .alert-error {
            background: #fee2e2;
            color: #991b1b;
            border-left: 4px solid var(--error-500);
        }

        .nav-links {
            margin-top: 16px;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            margin-right: 20px;
            opacity: 0.9;
            transition: opacity 0.2s;
        }

        .nav-links a:hover {
            opacity: 1;
        }

        .delete-form {
            display: inline;
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <div class="container">
            <h1>👥 Gerenciar Usuários</h1>
            <p>Painel Administrativo - <?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
            <div class="nav-links">
                <a href="../../index.html">← Voltar ao Site</a>
                <a href="vendor_dashboard.php">Dashboard</a>
                <a href="logout.php">Sair</a>
            </div>
        </div>
    </div>

    <div class="container">
        <?php if (isset($_SESSION['success'])): ?>
            <div class="alert alert-success">
                ✓ <?php echo htmlspecialchars($_SESSION['success']); unset($_SESSION['success']); ?>
            </div>
        <?php endif; ?>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="alert alert-error">
                ✗ <?php echo htmlspecialchars($_SESSION['error']); unset($_SESSION['error']); ?>
            </div>
        <?php endif; ?>

        <div class="stats-grid">
            <?php
            $totalUsers = count($users);
            $adminCount = count(array_filter($users, fn($u) => $u->role === 'admin'));
            $vendorCount = count(array_filter($users, fn($u) => $u->role === 'vendor'));
            $customerCount = count(array_filter($users, fn($u) => $u->role === 'customer'));
            ?>
            <div class="stat-card">
                <div class="stat-value"><?php echo $totalUsers; ?></div>
                <div class="stat-label">Total de Usuários</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?php echo $customerCount; ?></div>
                <div class="stat-label">Clientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?php echo $vendorCount; ?></div>
                <div class="stat-label">Lojistas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?php echo $adminCount; ?></div>
                <div class="stat-label">Administradores</div>
            </div>
        </div>

        <div class="users-table">
            <div class="table-header">
                <h2>Lista de Usuários</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Cadastrado em</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (count($users) > 0): ?>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td>#<?php echo $user->id; ?></td>
                                <td><?php echo htmlspecialchars($user->nome); ?></td>
                                <td><?php echo htmlspecialchars($user->email); ?></td>
                                <td>
                                    <?php
                                    $roleLabels = [
                                        'admin' => 'Administrador',
                                        'vendor' => 'Lojista',
                                        'customer' => 'Cliente'
                                    ];
                                    $roleClass = 'badge-' . $user->role;
                                    ?>
                                    <span class="badge <?php echo $roleClass; ?>">
                                        <?php echo $roleLabels[$user->role] ?? $user->role; ?>
                                    </span>
                                </td>
                                <td><?php echo date('d/m/Y H:i', strtotime($user->created_at)); ?></td>
                                <td>
                                    <?php if ($user->id == $_SESSION['user_id']): ?>
                                        <button class="btn-danger" disabled title="Você não pode deletar sua própria conta">
                                            Deletar (Você)
                                        </button>
                                    <?php else: ?>
                                        <form method="POST" class="delete-form" onsubmit="return confirm('Tem certeza que deseja deletar o usuário \'<?php echo htmlspecialchars($user->nome); ?>\'?\n\nEsta ação não pode ser desfeita!');">
                                            <input type="hidden" name="delete_user_id" value="<?php echo $user->id; ?>">
                                            <button type="submit" class="btn-danger">Deletar</button>
                                        </form>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray-500);">
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        setTimeout(() => {
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => {
                alert.style.transition = 'opacity 0.5s';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 500);
            });
        }, 5000);
    </script>
</body>
</html>
