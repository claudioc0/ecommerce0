<?php
// Ficheiro: src/classes/Checkout.php (MODO DE DEPURAÇÃO)

class Checkout {
    private $pdo;
    private $user_id;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->user_id = $_SESSION['user_id'] ?? null;
    }

    public function createOrder() {
        if (empty($_SESSION['cart']) || !$this->user_id) {
            echo "--> FALHA em createOrder(): Carrinho vazio ou utilizador não logado.\n";
            return false;
        }

        echo "Passo 3.1: A chamar getClientId()...\n";
        $client_id = $this->getClientId();
        if (!$client_id) {
            echo "--> FALHA em createOrder(): getClientId() retornou 'false'.\n";
            return false;
        }

        try {
            $this->pdo->beginTransaction();

            echo "Passo 3.2: A calcular o total...\n";
            $total_price = $this->calculateTotal();
            echo "--> Total calculado: " . $total_price . "\n\n";

            echo "Passo 3.3: A inserir o pedido principal...\n";
            $sql_pedido = "INSERT INTO Pedido (id_cliente, valor_total, status) VALUES (?, ?, ?)";
            $stmt_pedido = $this->pdo->prepare($sql_pedido);
            $stmt_pedido->execute([$client_id, $total_price, 'pago']);
            $order_id = $this->pdo->lastInsertId();
            echo "--> SUCESSO: Pedido principal criado com ID: " . $order_id . "\n\n";

            echo "Passo 3.4: A inserir os itens do pedido...\n";
            $sql_item = "INSERT INTO PedidoItem (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
            $stmt_item = $this->pdo->prepare($sql_item);
            $product_quantities = array_count_values($_SESSION['cart']);

            foreach ($product_quantities as $product_id => $quantity) {
                $product_details = $this->getProductDetails($product_id);
                if ($product_details) {
                    echo "--> A inserir item: Produto ID #" . $product_id . ", Quantidade: " . $quantity . "\n";
                    $stmt_item->execute([$order_id, $product_id, $quantity, $product_details['price']]);
                }
            }
            echo "--> SUCESSO: Itens do pedido inseridos.\n\n";

            $this->pdo->commit();
            unset($_SESSION['cart']);

            return $order_id;

        } catch (PDOException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            // Força a exibição do erro de base de dados no ecrã
            die("--> ERRO FATAL DENTRO DE createOrder() (PDOException): " . $e->getMessage());
        }
    }
    
    private function getClientId() {
        echo "--> Dentro de getClientId(): A procurar cliente para user_id: " . $this->user_id . "\n";
        $stmt = $this->pdo->prepare("SELECT id_cliente FROM Cliente WHERE id_usuario = ?");
        $stmt->execute([$this->user_id]);
        $result = $stmt->fetch();
        
        if ($result) {
            echo "--> Cliente encontrado com ID: " . $result['id_cliente'] . "\n";
            return (int)$result['id_cliente'];
        } else {
            echo "--> Cliente não encontrado. A tentar criar um novo...\n";
            try {
                $stmt_create = $this->pdo->prepare("INSERT INTO Cliente (id_usuario) VALUES (?)");
                $stmt_create->execute([$this->user_id]);
                $new_client_id = (int)$this->pdo->lastInsertId();
                echo "--> SUCESSO: Novo cliente criado com ID: " . $new_client_id . "\n";
                return $new_client_id;
            } catch (PDOException $e) {
                // Força a exibição do erro exato no ecrã
                die("--> ERRO FATAL DENTRO DE getClientId() ao tentar criar cliente: " . $e->getMessage());
            }
        }
    }

    private function calculateTotal() {
        $total = 0.0;
        if (empty($_SESSION['cart'])) return $total;
        $product_ids_unique = array_unique($_SESSION['cart']);
        if (empty($product_ids_unique)) return 0.0;
        $placeholders = implode(',', array_fill(0, count($product_ids_unique), '?'));
        $sql = "SELECT id_produto, price FROM Produto WHERE id_produto IN ($placeholders)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($product_ids_unique);
        $products_prices = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        foreach ($_SESSION['cart'] as $product_id) {
            if (isset($products_prices[$product_id])) {
                $total += $products_prices[$product_id];
            }
        }
        return $total;
    }

    private function getProductDetails($product_id) {
        $stmt = $this->pdo->prepare("SELECT price FROM Produto WHERE id_produto = ?");
        $stmt->execute([$product_id]);
        return $stmt->fetch();
    }
}
?>

