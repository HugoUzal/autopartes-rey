// ========== ESTADO GLOBAL ==========
// Variables de estado que representan el "modelo" de la aplicación

var cart       = [];
var activeCat  = '';
var activeBrand= '';
var searchQ    = '';
var pMin       = 0;
var pMax       = Infinity;
var sortMode   = 'default';

var adminOk    = false;
var editId     = null;
var pendingImgs= [];
var nextId     = products.length + 1;  // requiere data.js cargado antes

// ========== TOAST ==========

function toast(m) {
  var t = document.getElementById('toast');
  t.textContent = m;
  t.style.display = 'block';
  clearTimeout(window._tt);
  window._tt = setTimeout(function() { t.style.display = 'none'; }, 2800);
}

// ========== CARRITO ==========

function addToCart(id, qty) {
  qty = qty || 1;
  var p = products.find(function(x) { return x.id === id; });
  if (!p) return;
  var e = cart.find(function(x) { return x.id === id; });
  if (e) e.qty = Math.min(p.stock, e.qty + qty);
  else cart.push({ id: id, qty: qty });
  updateBadge();
  toast('✅ ' + p.name + ' agregado al carrito');
}

function updateBadge() {
  document.getElementById('cart-badge').textContent =
    cart.reduce(function(s, x) { return s + x.qty; }, 0);
}

function updQty(id, d) {
  var p = products.find(function(x) { return x.id === id; });
  var e = cart.find(function(x) { return x.id === id; });
  if (!e || !p) return;
  e.qty = Math.max(0, Math.min(p.stock, e.qty + d));
  if (e.qty === 0) cart = cart.filter(function(x) { return x.id !== id; });
  updateBadge();
  renderCart();
}

function rmCart(id) {
  cart = cart.filter(function(x) { return x.id !== id; });
  updateBadge();
  renderCart();
}

// ========== FILTROS ==========

function filterCat(c) {
  activeCat = c;
  searchQ = '';
  document.getElementById('search-input').value = '';
  renderHome();
}

function filterBrand(b) {
  activeBrand = b;
  renderHome();
}

function handleSearch() {
  searchQ = document.getElementById('search-input').value;
  activeCat = '';
  activeBrand = '';
  renderHome();
}

function applyPrice() {
  pMin = parseFloat(document.getElementById('price-min').value) || 0;
  pMax = parseFloat(document.getElementById('price-max').value) || Infinity;
  renderProds();
}

function sortProds(v) {
  sortMode = v;
  renderProds();
}

// ========== PAGO ==========

function processPayment() {
  var nombre = document.getElementById('ck-nombre').value;
  var card   = document.getElementById('ck-card').value;
  if (!nombre || !card) { toast('⚠️ Completá todos los campos obligatorios'); return; }
  var total  = cart.reduce(function(s, x) {
    var p = products.find(function(z) { return z.id === x.id; });
    return s + (p ? p.price * x.qty : 0);
  }, 0);
  var email  = document.getElementById('ck-email').value || 'tu email';
  var pedido = 'APR-' + Date.now().toString().slice(-6);
  document.getElementById('ck-content').innerHTML =
    '<div class="success-wrap"><div class="check">✅</div><h2>¡Pago exitoso!</h2>'
    + '<p>Tu pedido fue confirmado. Recibirás un email en <strong>' + email + '</strong>.</p>'
    + '<div class="info-box">'
    + '<p><strong>N° de pedido:</strong> ' + pedido + '</p>'
    + '<p><strong>Total pagado:</strong> <span style="color:var(--navy);font-weight:700">$' + fmt(total) + '</span></p>'
    + '<p><strong>Entrega estimada:</strong> 3-5 días hábiles</p>'
    + '</div>'
    + '<button onclick="cart=[];updateBadge();showView(\'home\')">Seguir comprando 🛒</button></div>';
  cart = [];
  updateBadge();
}

// ========== ADMIN - SESIÓN ==========

function adminLogin() {
  if (document.getElementById('au').value === 'admin' &&
      document.getElementById('ap').value === 'rey2024') {
    adminOk = true;
    renderAdmin();
  } else {
    toast('❌ Usuario o contraseña incorrectos');
  }
}

function adminLogout() {
  adminOk = false;
  renderAdmin();
}

function delProd(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  products = products.filter(function(p) { return p.id !== id; });
  renderAdminTbl();
  toast('🗑 Producto eliminado');
}

// ========== MODAL / IMÁGENES ==========

function openModal(id) {
  editId = id || null;
  pendingImgs = [];
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal-title').textContent = id ? 'Editar Producto' : 'Agregar Producto';
  if (id) {
    var p = products.find(function(x) { return x.id === id; });
    if (p) {
      document.getElementById('p-name').value     = p.name;
      document.getElementById('p-brand').value    = p.brand;
      document.getElementById('p-cat').value      = p.category;
      document.getElementById('p-price').value    = p.price;
      document.getElementById('p-oldprice').value = p.oldPrice || '';
      document.getElementById('p-stock').value    = p.stock;
      document.getElementById('p-desc').value     = p.desc;
      document.getElementById('p-compat').value   = p.compat || '';
      document.getElementById('p-sku').value      = p.sku || '';
      document.getElementById('p-weight').value   = p.weight || '';
      pendingImgs = p.images.slice();
      renderPreview();
    }
  } else {
    ['p-name','p-brand','p-price','p-oldprice','p-stock','p-desc','p-compat','p-sku','p-weight']
      .forEach(function(i) { document.getElementById(i).value = ''; });
    document.getElementById('p-cat').value = '';
    document.getElementById('preview-grid').innerHTML = '';
  }
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  editId = null;
  pendingImgs = [];
}

function handleUpload(e) {
  var files = Array.prototype.slice.call(e.target.files);
  files.slice(0, 5 - pendingImgs.length).forEach(function(f) {
    var r = new FileReader();
    r.onload = function(ev) { pendingImgs.push(ev.target.result); renderPreview(); };
    r.readAsDataURL(f);
  });
  e.target.value = '';
}

function rmImg(i) {
  pendingImgs.splice(i, 1);
  renderPreview();
}

function saveProduct() {
  var name  = document.getElementById('p-name').value.trim();
  var cat   = document.getElementById('p-cat').value;
  var price = parseFloat(document.getElementById('p-price').value);
  var desc  = document.getElementById('p-desc').value.trim();
  if (!name || !cat || !price || !desc) { toast('⚠️ Completá los campos obligatorios (*)'); return; }
  var data = {
    name:     name,
    brand:    document.getElementById('p-brand').value.trim(),
    category: cat,
    price:    price,
    oldPrice: parseFloat(document.getElementById('p-oldprice').value) || 0,
    stock:    parseInt(document.getElementById('p-stock').value) || 0,
    desc:     desc,
    compat:   document.getElementById('p-compat').value.trim(),
    sku:      document.getElementById('p-sku').value.trim(),
    weight:   document.getElementById('p-weight').value.trim(),
    images:   pendingImgs.slice(),
    rating:   4.5,
    reviews:  0
  };
  if (editId) {
    var idx = products.findIndex(function(p) { return p.id === editId; });
    products[idx] = Object.assign(products[idx], data);
    toast('✅ Producto actualizado');
  } else {
    products.push(Object.assign({ id: nextId++ }, data));
    toast('✅ Producto agregado');
  }
  closeModal();
  renderAdminTbl();
}
