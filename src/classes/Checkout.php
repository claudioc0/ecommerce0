<?php
// Ficheiro: src/classes/Checkout.php

class Checkout {
    private $user_id;

    public function __construct() {
        $this->user_id = $_SESSION['user_id'] ?? null;
    }

    /**
     * Processa a criação de um novo pedido usando os dados do carrinho na BD.
     * @return int|false O ID do novo pedido em caso de sucesso, ou false em caso de falha.
     */
    public function createOrder() {
        if (!$this->user_id) {
            return false;
        }

        try {
            // 1. Encontra o cliente e o seu carrinho na base de dados
            $cliente = R::findOne('cliente', 'usuario_id = ?', [$this->user_id]);
            if (!$cliente) return false;

            $carrinho = R::findOne('carrinho', 'cliente_id = ?', [$cliente->id]);
            if (!$carrinho) return false;

            $items_no_carrinho = $carrinho->ownCarrinhoitemList;
            if (empty($items_no_carrinho)) {
                return false;
            }

            // Inicia uma transação
            R::begin();

            $total_price = $this->calculateTotal($items_no_carrinho);

            // 2. Cria o Pedido
            $pedido = R::dispense('pedido');
            $pedido->cliente_id = $cliente->id; 
            $pedido->valor_total = $total_price;
            $pedido->status = 'pago';
            $order_id = R::store($pedido);

            // 3. Copia os itens do carrinho para os itens do pedido
            foreach ($items_no_carrinho as $item_carrinho) {
                $produto = $item_carrinho->produto; // Carrega o produto relacionado

                $pedidoItem = R::dispense('pedidoitem');
                $pedidoItem->pedido_id = $order_id;
                $pedidoItem->produto_id = $item_carrinho->produto_id;
                $pedidoItem->quantidade = $item_carrinho->quantidade;
                $pedidoItem->preco_unitario = $produto->price;
                
                R::store($pedidoItem);
            }

            // 4. Limpa o carrinho da base de dados
            R::trash($carrinho); // O 'ON DELETE CASCADE' na BD apaga os carrinhoitem associados

            // Confirma a transação
            R::commit();
            
            return $order_id;

        } catch (Exception $e) {
            R::rollback();
            error_log("Erro no checkout com RedBeanPHP (BD): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Calcula o valor total com base nos itens do carrinho passados como argumento.
     * @param array $items_no_carrinho A lista de beans 'carrinhoitem'.
     * @return float O valor total.
     */
    private function calculateTotal($items_no_carrinho) {
        $total = 0.0;
        foreach ($items_no_carrinho as $item) {
            $produto = $item->produto; // Carrega o produto relacionado
            if ($produto) {
                $total += $produto->price * $item->quantidade;
            }
        }
        return $total;
    }
}
?>

