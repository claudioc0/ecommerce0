const sampleProducts = [
  {
    id: 1,
    title: 'Jaqueta Vintage',
    price: 129.90,
    category: 'Roupas',
    img: 'https://images.unsplash.com/photo-1724856604247-0de2c43b6491?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    title: 'Camiseta Minimal',
    price: 59.90,
    category: 'Roupas',
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    title: 'Calça Jeans',
    price: 149.90,
    category: 'Roupas',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    title: 'Macacão Infantil',
    price: 89.90,
    category: 'Infantil',
    img: 'https://plus.unsplash.com/premium_photo-1700429926449-2de63c04501d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 5,
    title: 'Short Esportivo',
    price: 79.90,
    category: 'Esportivo',
    img: 'https://images.unsplash.com/photo-1628476801147-b3e3cb99fe68?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 6,
    title: 'Bolsa Reciclada',
    price: 99.90,
    category: 'Acessórios',
    img: 'https://images.unsplash.com/photo-1597692021958-b698c472c25b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 7,
    title: 'Tênis Sustentável',
    price: 159.90,
    category: 'Esportivo',
    img: 'https://images.unsplash.com/photo-1679800558771-0e1737f489c0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

function readCart(){ return JSON.parse(localStorage.getItem('cart')||'[]') }
function writeCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartCounters(); }
function updateCartCounters(){
  const c = readCart(); const n=c.reduce((s,i)=>s+i.qty,0);
  ['cartCount','cartCount2','cartCount3','cartCount4'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent = n;
  });
}
function addToCart(id){
  const c = readCart();
  const p = sampleProducts.find(x=>x.id===id);
  const exist = c.find(x=>x.id===id);
  if(exist) exist.qty++;
  else c.push({id:p.id,title:p.title,price:p.price,qty:1});
  writeCart(c);
  alert('Adicionado ao carrinho: '+p.title);
}

function renderGrid(filterCategory = '') {
  const root = document.getElementById('productGrid');
  if (!root) return;
  root.innerHTML = '';
  sampleProducts
    .filter(p => !filterCategory || p.category === filterCategory)
    .forEach(p => {
      const d = document.createElement('div');
      d.className = 'product';
      d.innerHTML = `
        <img src="${p.img}" alt="" style="width:100px;height:100px;object-fit:cover;border-radius:10px;display:block;">
        <h4>${p.title}</h4>
        <div>R$ ${p.price.toFixed(2)}</div>
        <div style="margin-top:8px">
          <a class="btn" href="product.html?id=${p.id}">Ver</a>
          <button class="btn alt" onclick="addToCart(${p.id})">Comprar</button>
        </div>
      `;
      root.appendChild(d);
    });
}

function setupCategoryFilter() {
  const gridContainer = document.getElementById('productGrid');
  if (!gridContainer) return;

  let filterBar = document.getElementById('categoryFilterBar');
  if (!filterBar) {
    filterBar = document.createElement('div');
    filterBar.id = 'categoryFilterBar';
    filterBar.style.margin = '1rem 0';
    filterBar.innerHTML = `
      <select id="categoryFilter" style="padding:0.5rem 1rem;border-radius:8px;border:1px solid #111;">
        <option value="">Todas as categorias</option>
        ${[...new Set(sampleProducts.map(p => p.category))]
          .map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      </select>
    `;
    gridContainer.parentNode.insertBefore(filterBar, gridContainer);
  }

  document.getElementById('categoryFilter').onchange = function () {
    renderGrid(this.value);
  };
}

function renderList(){
  const root = document.getElementById('productList') || document.getElementById('itemsQC');
  if(!root) return;
  root.innerHTML='';
  sampleProducts.forEach(p=>{
    const d = document.createElement('div'); d.className='product';
    d.innerHTML = `<img src="${p.img}" alt="" style="width:120px;height:80px;height:100px;object-fit:cover;border-radius:10px;display:block;"><div><h4>${p.title}</h4><div>R$ ${p.price.toFixed(2)}</div>
    <div style="margin-top:6px"><a class="btn" href="product.html?id=${p.id}">Ver</a> <button class="btn" onclick="addToCart(${p.id})">Comprar</button></div><br></div>`;
    root.appendChild(d);
  });
}

function renderProductDetail(){
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id')||'1');
  const p = sampleProducts.find(x=>x.id===id);
  const root = document.getElementById('productDetail');
  if(!root || !p) return;
  root.innerHTML = `
    <div class="product-page">
      <img class="product-page-img" src="${p.img}" alt="${p.title}">
      <div class="product-page-details">
        <div class="product-page-title">${p.title}</div>
        <div class="product-page-price">R$ ${p.price.toFixed(2)}</div>
        <div class="product-page-desc">Categoria: ${p.category}<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        <div class="product-page-actions">
          <button class="btn" onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
          <button class="btn alt">Comprar Agora</button>
        </div>
      </div>
    </div>
  `;
}

function renderCart() {
  const root = document.getElementById('cartItems');
  if (!root) return;
  const cart = readCart();
  root.innerHTML = '';
  if (cart.length === 0) {
    root.innerHTML = '<p>Seu carrinho está vazio.</p>';
    document.getElementById('total').textContent = 'R$ 0,00';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    const product = sampleProducts.find(p => p.id === item.id);
    if (!product) return;
    total += product.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'space-between';
    div.style.gap = '1rem';
    div.style.marginBottom = '1rem';
    div.innerHTML = `
      <div>
        <strong>${product.title}</strong><br>
        <span>Qtd: ${item.qty}</span> - <span>R$ ${(product.price * item.qty).toFixed(2)}</span>
      </div>
      <button class="btn alt" style="padding:0.3rem 1rem;" onclick="removeFromCart(${item.id})">Excluir</button>
    `;
    root.appendChild(div);
  });
  document.getElementById('total').textContent = 'R$ ' + (total + 12).toFixed(2); 
}

function removeFromCart(id) {
  let cart = readCart();
  cart = cart.filter(item => item.id !== id);
  writeCart(cart);
  renderCart();
}

function setupForms(){
  const signup = document.getElementById('signupForm');
  if(signup){
    signup.addEventListener('submit', e=>{
      e.preventDefault();
      const name=document.getElementById('name').value;
      const email=document.getElementById('emailS').value;
      const type=document.getElementById('accountType').value;
      const users = JSON.parse(localStorage.getItem('users')||'[]');
      users.push({name,email,type,created:Date.now()});
      localStorage.setItem('users',JSON.stringify(users));
      alert('Conta criada: '+name+' (tipo: '+type+')');
      location.href='login.html';
    });
  }

  const login = document.getElementById('loginForm');
  if(login){
    login.addEventListener('submit', e=>{
      e.preventDefault();
      const asSeller = document.getElementById('asSeller').checked;
      const user = {name: 'Usuário Demo', type: asSeller? 'seller':'buyer'};
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('Logado como '+user.type);
      location.href = user.type==='seller' ? 'seller-dashboard.html' : 'index.html';
    });
  }

  const checkout = document.getElementById('checkoutForm');
  if(checkout){
    checkout.addEventListener('submit', e=>{
      e.preventDefault();
      localStorage.setItem('cart', '[]');
      alert('Pagamento simulado realizado. Obrigado!');
      location.href='index.html';
    });
  }

  const addQC = document.getElementById('addQC');
  if(addQC){
    addQC.addEventListener('click', ()=>{
      const name = document.getElementById('pieceName').value || 'Peça nova';
      const cond = document.getElementById('condition').value;
      const items = JSON.parse(localStorage.getItem('qc')||'[]');
      items.push({name,cond,when:Date.now()});
      localStorage.setItem('qc', JSON.stringify(items));
      renderQC();
    });
    renderQC();
  }
}

function renderQC(){
  const root = document.getElementById('itemsQC');
  if(!root) return;
  const items = JSON.parse(localStorage.getItem('qc')||'[]');
  root.innerHTML = '';
  items.forEach(it=>{
    const d = document.createElement('div'); d.className='card';
    d.innerHTML = `<strong>${it.name}</strong><div>Cond: ${it.cond || it.condition || '—'}</div>`;
    root.appendChild(d);
  });
}

function renderSellerProducts(){
  const root = document.getElementById('sellerProducts');
  if(!root) return;
  root.innerHTML = '<p>Lista de produtos do lojista (simulada)</p>';
}

function renderUsers(){
  const root = document.getElementById('usersList');
  if(!root) return;
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  root.innerHTML = users.map(u=>`<div class="card">${u.name} — ${u.type}</div>`).join('');
}

function updateMenuForUser(isSeller, isAdmin) {
  const nav = document.querySelector('.topbar nav');
  if (!nav) return;
  nav.innerHTML = '';
  nav.innerHTML += `<a href="shop-grid.html">Loja</a>`;
  if (isSeller) {
    nav.innerHTML += `<a href="store-preview.html">Pré-visualizar Loja</a>`;
    nav.innerHTML += `<a href="seller-dashboard.html">Painel Vendedor</a>`;
  }
  if (isAdmin) {
    nav.innerHTML += `<a href="admin-panel.html">Admin</a>`;
  }
}

function handleLogin(userType) {
  updateMenuForUser(userType === 'seller', userType === 'admin');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCounters();
  setupForms();
  setupCategoryFilter(); 
  renderGrid();
  renderList();
  renderProductDetail();
  renderCart();
  renderSellerProducts();
  renderUsers();

  document.querySelectorAll('.theme-switcher button').forEach(btn => {
    btn.addEventListener('click', () => document.body.className = btn.dataset.theme);
  });

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (location.pathname.endsWith('brecho-quality.html')) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hasBrecho = users.some(u => u.type === 'brecho');
    if (!hasBrecho && (!currentUser || currentUser.type !== 'seller')) {
      document.body.innerHTML = '<main class="container"><h2>Acesso negado</h2><p>Este módulo é exclusivo para contas de tipo <strong>brecho</strong>.</p></main>';
    } else {
      renderQC();
    }
  }
});
