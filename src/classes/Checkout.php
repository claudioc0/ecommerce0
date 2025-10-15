<?php
// Ficheiro: src/classes/Checkout.php

class Checkout {
    private $user_id;

    public function __construct() {

        $this->user_id = $_SESSION['user_id'] ?? null;
    }

    /**
     * Processa a criação de um novo pedido usando RedBeanPHP.
     * @return int|false O ID do novo pedido em caso de sucesso, ou false em caso de falha.
     */
    public function createOrder() {
        if (empty($_SESSION['cart']) || !$this->user_id) {
            return false;
        }

        try {
            // Inicia uma transação com RedBeanPHP
            R::begin();

            // Busca o bean (objeto) do cliente. R::findOne retorna um objeto ou null.
            $cliente = R::findOne('cliente', 'id_usuario = ?', [$this->user_id]);

            // Se o perfil do cliente não existir, cria-o agora.
            if (!$cliente) {
                $cliente = R::dispense('cliente'); // Cria um novo bean 'cliente'
                $cliente->id_usuario = $this->user_id;
                R::store($cliente); // Guarda o novo cliente na base de dados
            }

            $total_price = $this->calculateTotal();

            // 1. Cria um novo "bean" (objeto) para o pedido
            $pedido = R::dispense('pedido');
            
            // Define as propriedades. RedBeanPHP mapeia para as colunas corretas.
            $pedido->cliente_id = $cliente->id; 
            $pedido->valor_total = $total_price;
            $pedido->status = 'pago';
            $pedido->data_pedido = date('Y-m-d H:i:s'); // Define a data atual
            
            // Guarda o pedido na base de dados e obtém o seu ID
            $order_id = R::store($pedido);

            // 2. Insere os itens do pedido
            $product_quantities = array_count_values($_SESSION['cart']);

            foreach ($product_quantities as $product_id => $quantity) {
                // Carrega o bean do produto da base de dados
                $produto = R::load('produto', $product_id);

                if ($produto->id) { // Verifica se o produto foi encontrado
                    $pedidoItem = R::dispense('pedidoitem');
                    $pedidoItem->pedido_id = $order_id;
                    $pedidoItem->produto_id = $product_id;
                    $pedidoItem->quantidade = $quantity;
                    $pedidoItem->preco_unitario = $produto->price; // Preço no momento da compra
                    
                    // Guarda o item do pedido
                    R::store($pedidoItem);
                }
            }

            // Se tudo correu bem, confirma a transação
            R::commit();

            // Limpa o carrinho da sessão
            unset($_SESSION['cart']);
            
            return $order_id;

        } catch (Exception $e) {
            // Em caso de qualquer erro, reverte todas as operações da base de dados
            R::rollback();
            error_log("Erro no checkout com RedBeanPHP: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Calcula o valor total do carrinho usando RedBeanPHP.
     * @return float O valor total.
     */
    private function calculateTotal() {
        $total = 0.0;
        if (empty($_SESSION['cart'])) {
            return $total;
        }
        
        $product_ids_unique = array_unique($_SESSION['cart']);
        
        // Carrega todos os produtos necessários com uma única consulta
        // R::loadAll retorna um array de beans indexado pelo ID
        $produtos = R::loadAll('produto', $product_ids_unique);
        
        // Itera sobre o carrinho na sessão para considerar as quantidades
        foreach ($_SESSION['cart'] as $product_id) {
            if (isset($produtos[$product_id])) {
                $total += $produtos[$product_id]->price;
            }
        }
        return $total;
    }
}
?>

