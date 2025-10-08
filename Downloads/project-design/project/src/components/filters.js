export function renderFilters() {
    return `
        <div class="filters-container">
            <h3>Filtrar Produtos</h3>
            <div class="filters-grid">
                <div class="filter-group">
                    <label for="filter-category">Categoria</label>
                    <select id="filter-category" class="filter-input">
                        <option value="">Todas as categorias</option>
                        <option value="Vestidos">Vestidos</option>
                        <option value="Blusas">Blusas</option>
                        <option value="Calças">Calças</option>
                        <option value="Jaquetas">Jaquetas</option>
                        <option value="Saias">Saias</option>
                        <option value="Camisas">Camisas</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="filter-size">Tamanho</label>
                    <select id="filter-size" class="filter-input">
                        <option value="">Todos os tamanhos</option>
                        <option value="PP">PP</option>
                        <option value="P">P</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="GG">GG</option>
                        <option value="36">36</option>
                        <option value="38">38</option>
                        <option value="40">40</option>
                        <option value="42">42</option>
                        <option value="44">44</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="filter-color">Cor</label>
                    <select id="filter-color" class="filter-input">
                        <option value="">Todas as cores</option>
                        <option value="Preto">Preto</option>
                        <option value="Branco">Branco</option>
                        <option value="Azul">Azul</option>
                        <option value="Rosa">Rosa</option>
                        <option value="Verde">Verde</option>
                        <option value="Vermelho">Vermelho</option>
                        <option value="Marrom">Marrom</option>
                        <option value="Cinza">Cinza</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="filter-condition">Condição</label>
                    <select id="filter-condition" class="filter-input">
                        <option value="">Todas as condições</option>
                        <option value="Novo">Novo</option>
                        <option value="Seminovo">Seminovo</option>
                        <option value="Usado">Usado</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="filter-min-price">Preço Mínimo</label>
                    <input type="number" id="filter-min-price" class="filter-input" placeholder="R$ 0,00" min="0" step="0.01">
                </div>
                
                <div class="filter-group">
                    <label for="filter-max-price">Preço Máximo</label>
                    <input type="number" id="filter-max-price" class="filter-input" placeholder="R$ 1000,00" min="0" step="0.01">
                </div>
            </div>
        </div>
    `;
}