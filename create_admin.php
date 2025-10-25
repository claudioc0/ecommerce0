<?php
require_once 'src/connection/db.php';

echo "<h1>Create Admin User</h1>";

try {
    $existingAdmin = R::findOne('usuario', 'email = ?', ['admin@fashionstore.com']);

    if ($existingAdmin) {
        echo "<p style='color: orange;'>⚠️ Admin user already exists!</p>";
        echo "<p>Email: admin@fashionstore.com</p>";
        echo "<p>To use this account, login with password: <strong>admin123</strong></p>";
    } else {
        R::begin();

        $admin = R::dispense('usuario');
        $admin->nome = 'Administrador';
        $admin->email = 'admin@fashionstore.com';
        $admin->senha = password_hash('admin123', PASSWORD_DEFAULT);
        $admin->role = 'admin';
        $admin->created_at = date('Y-m-d H:i:s');

        $adminId = R::store($admin);

        R::commit();

        echo "<p style='color: green; font-weight: bold;'>✓ Admin user created successfully!</p>";
        echo "<hr>";
        echo "<h2>Admin Credentials:</h2>";
        echo "<p><strong>Email:</strong> admin@fashionstore.com</p>";
        echo "<p><strong>Password:</strong> admin123</p>";
        echo "<hr>";
        echo "<p><a href='src/connection/login.php' style='display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;'>Go to Login</a></p>";
    }

    echo "<hr>";
    echo "<h2>Creating Test Users...</h2>";
    $existingCustomer = R::findOne('usuario', 'email = ?', ['cliente@email.com']);
    if (!$existingCustomer) {
        R::begin();
        $customer = R::dispense('usuario');
        $customer->nome = 'João Silva';
        $customer->email = 'cliente@email.com';
        $customer->senha = password_hash('cliente123', PASSWORD_DEFAULT);
        $customer->role = 'customer';
        $customer->created_at = date('Y-m-d H:i:s');
        $customerId = R::store($customer);

        $clienteProfile = R::dispense('cliente');
        $clienteProfile->usuario_id = $customerId;
        $clienteProfile->cpf = '123.456.789-00';
        $clienteProfile->telefone = '(11) 98888-8888';
        $clienteProfile->endereco = 'Rua das Flores, 123';
        R::store($clienteProfile);

        R::commit();
        echo "<p style='color: green;'>✓ Customer created: cliente@email.com / cliente123</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Customer already exists: cliente@email.com</p>";
    }

    $existingVendor = R::findOne('usuario', 'email = ?', ['lojista@email.com']);
    if (!$existingVendor) {
        R::begin();
        $vendor = R::dispense('usuario');
        $vendor->nome = 'Carlos Vendedor';
        $vendor->email = 'lojista@email.com';
        $vendor->senha = password_hash('lojista123', PASSWORD_DEFAULT);
        $vendor->role = 'vendor';
        $vendor->created_at = date('Y-m-d H:i:s');
        $vendorId = R::store($vendor);

        $lojistaProfile = R::dispense('lojista');
        $lojistaProfile->usuario_id = $vendorId;
        $lojistaProfile->cnpj = '12.345.678/0001-90';
        $lojistaProfile->razao_social = 'Moda & Estilo Ltda';
        $lojistaProfile->nome_loja = 'Boutique Fashion';
        R::store($lojistaProfile);

        R::commit();
        echo "<p style='color: green;'>✓ Vendor created: lojista@email.com / lojista123</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Vendor already exists: lojista@email.com</p>";
    }

    echo "<hr>";
    echo "<h2>✓ Setup Complete!</h2>";
    echo "<p><a href='src/connection/admin_manage_users.php' style='display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-right: 10px;'>Manage Users (Admin)</a></p>";
    echo "<p><a href='src/connection/vendor_dashboard.php' style='display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-right: 10px;'>Vendor Dashboard</a></p>";

} catch (Exception $e) {
    R::rollback();
    echo "<p style='color: red;'>✗ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
