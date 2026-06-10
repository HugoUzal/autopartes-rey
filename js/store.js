// ========== ESTADO GLOBAL ==========

var cart        = [];
var activeCat   = '';
var activeBrand = '';
var searchQ     = '';
var pMin        = 0;
var pMax        = Infinity;
var sortMode    = 'default';

var adminOk     = false;
var editId      = null;
var pendingImgs = [];   // previews: base64 (nuevas) o URL (existentes)
var pendingFiles= [];   // File objects para nuevas imágenes, null para existentes
var nextId      = products.length + 1;  // requiere data.js cargado antes

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
  var n = cart.reduce(function(s, x) { return s + x.qty; }, 0);
  document.getElementById('cart-badge').textContent = n;
  var mb = document.getElementById('cart-badge-mobile');
  if (mb) mb.textContent = n;
}

function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  var btn  = document.getElementById('hamburger');
  var open = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden', open);
  btn.classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
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
  var total = cart.reduce(function(s, x) {
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
  var email = document.getElementById('au').value.trim();
  var pass  = document.getElementById('ap').value;
  if (!email || !pass) { toast('⚠️ Ingresá email y contraseña'); return; }
  toast('🔄 Verificando...');
  fbLogin(email, pass, function(err, user) {
    if (err) {
      toast('❌ Email o contraseña incorrectos');
    } else {
      adminOk = true;
      renderAdmin();
    }
  });
}

function adminLogout() {
  fbLogout(function() {
    adminOk = false;
    renderAdmin();
  });
}

function delProd(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  var p = products.find(function(x) { return x.id === id; });
  if (!p) return;

  function removeLocal() {
    fbLogActivity('eliminar', p.name);
    products = products.filter(function(x) { return x.id !== id; });
    renderAdminTbl();
    toast('🗑 Producto eliminado');
  }

  if (p._docId) {
    fbDeleteProduct(p._docId, function(err) {
      if (err) { toast('❌ Error al eliminar en Firebase'); return; }
      removeLocal();
    });
  } else {
    removeLocal();
  }
}

// ========== MODAL / IMÁGENES ==========

function openModal(id) {
  editId = id || null;
  pendingImgs  = [];
  pendingFiles = [];
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
      // Imágenes existentes: preview = URL, file = null (ya están en Storage)
      pendingImgs  = p.images.slice();
      pendingFiles = p.images.map(function() { return null; });
      renderPreview();
    }
  } else {
    ['p-name','p-brand','p-price','p-oldprice','p-stock','p-desc','p-compat','p-sku','p-weight']
      .forEach(function(i) { document.getElementById(i).value = ''; });
    document.getElementById('p-cat').value = '';
    document.getElementById('preview-grid').innerHTML = '';
  }
}

function markError(id) {
  document.getElementById(id).style.border = '2px solid #d32f2f';
  document.getElementById(id).style.background = '#fff5f5';
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  editId       = null;
  pendingImgs  = [];
  pendingFiles = [];
  // Limpiar errores visuales
  ['p-name','p-cat','p-price','p-oldprice','p-stock','p-desc'].forEach(function(id) {
    var el = document.getElementById(id);
    el.style.border = '';
    el.style.background = '';
  });
}

function compressImage(file, callback) {
  var MAX_PX  = 900;    // lado máximo en píxeles
  var QUALITY = 0.72;   // calidad JPEG (0-1)
  var reader  = new FileReader();
  reader.onload = function(ev) {
    var img = new Image();
    img.onload = function() {
      var w = img.width, h = img.height;
      if (w > MAX_PX) { h = Math.round(h * MAX_PX / w); w = MAX_PX; }
      if (h > MAX_PX) { w = Math.round(w * MAX_PX / h); h = MAX_PX; }
      var canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', QUALITY));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function handleUpload(e) {
  var files = Array.prototype.slice.call(e.target.files);
  files.slice(0, 5 - pendingImgs.length).forEach(function(f) {
    compressImage(f, function(base64) {
      pendingImgs.push(base64);
      pendingFiles.push(f);
      renderPreview();
    });
  });
  e.target.value = '';
}

function rmImg(i) {
  pendingImgs.splice(i, 1);
  pendingFiles.splice(i, 1);
  renderPreview();
}

function saveProduct() {
  // Limpiar errores anteriores
  ['p-name','p-cat','p-price','p-desc'].forEach(function(id) {
    document.getElementById(id).style.border = '';
  });

  var name  = document.getElementById('p-name').value.trim();
  var cat   = document.getElementById('p-cat').value;
  var price = parseFloat(document.getElementById('p-price').value);
  var desc  = document.getElementById('p-desc').value.trim();

  // Validar y marcar en rojo los inválidos
  var errors = [];
  if (!name)        { markError('p-name');  errors.push('Nombre'); }
  if (!cat)         { markError('p-cat');   errors.push('Categoría'); }
  if (!price || price < 0) { markError('p-price'); errors.push('Precio'); }
  if (!desc)        { markError('p-desc');  errors.push('Descripción'); }

  // Validar negativos en precio tachado y stock
  var oldPrice = parseFloat(document.getElementById('p-oldprice').value) || 0;
  var stock    = parseInt(document.getElementById('p-stock').value)      || 0;
  if (oldPrice < 0) { markError('p-oldprice'); errors.push('Precio tachado'); }
  if (stock    < 0) { markError('p-stock');    errors.push('Stock'); }

  if (errors.length) {
    toast('⚠️ Corregí: ' + errors.join(', '));
    return;
  }

  var existing = editId ? products.find(function(p) { return p.id === editId; }) : null;

  var data = {
    id:       existing ? existing.id : nextId,
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
    rating:   existing ? (existing.rating || 4.5) : 4.5,
    reviews:  existing ? (existing.reviews || 0)  : 0
  };

  // Imágenes: se guardan como base64 directo en Firestore
  data.images = pendingImgs.slice();

  toast('💾 Guardando...');

  var docId = existing ? (existing._docId || null) : null;

  fbSaveProduct(data, docId, function(err, savedDocId) {
    if (err) { toast('❌ Error al guardar en Firebase'); console.error(err); return; }
    data._docId = savedDocId;
    fbLogActivity(existing ? 'editar' : 'agregar', data.name);

    if (existing) {
      var idx = products.findIndex(function(p) { return p.id === editId; });
      products[idx] = Object.assign(products[idx], data);
      toast('✅ Producto actualizado');
    } else {
      nextId++;
      products.push(data);
      toast('✅ Producto agregado');
    }
    closeModal();
    renderAdminTbl();
  });
}
