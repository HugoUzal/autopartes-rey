// ========== VISTAS ==========

function showView(v) {
  ['home','product','cart','checkout','admin'].forEach(function(n) {
    document.getElementById('view-' + n).classList.toggle('hidden', n !== v);
  });
  window.scrollTo(0, 0);
  if (v === 'home')     renderHome();
  if (v === 'cart')     renderCart();
  if (v === 'checkout') renderCheckout();
  if (v === 'admin')    renderAdmin();
}

// ========== HOME ==========

function renderHome() {
  renderPills();
  renderSidebar();
  renderProds();
}

function renderPills() {
  var el = document.getElementById('cat-pills');
  var h = '<button class="cat-pill ' + (activeCat === '' ? 'active' : '') + '" onclick="filterCat(\'\')">Todos</button>';
  CATS.forEach(function(c) {
    h += '<button class="cat-pill ' + (activeCat === c ? 'active' : '') + '" onclick="filterCat(\'' + c + '\')">' + c + '</button>';
  });
  el.innerHTML = h;
}

function renderSidebar() {
  var cc = {}, bc = {};
  products.forEach(function(p) {
    cc[p.category] = (cc[p.category] || 0) + 1;
    if (p.brand) bc[p.brand] = (bc[p.brand] || 0) + 1;
  });

  var sc = document.getElementById('sidebar-cats');
  var h = '<li><a onclick="filterCat(\'\');return false" class="' + (activeCat === '' ? 'active' : '') + '">Todas <span class="cnt">' + products.length + '</span></a></li>';
  Object.keys(cc).forEach(function(c) {
    h += '<li><a onclick="filterCat(\'' + c + '\');return false" class="' + (activeCat === c ? 'active' : '') + '">' + c + ' <span class="cnt">' + cc[c] + '</span></a></li>';
  });
  sc.innerHTML = h;

  var sb = document.getElementById('sidebar-brands');
  h = '<li><a onclick="filterBrand(\'\');return false" class="' + (activeBrand === '' ? 'active' : '') + '">Todas</a></li>';
  Object.keys(bc).slice(0, 8).forEach(function(b) {
    h += '<li><a onclick="filterBrand(\'' + b + '\');return false" class="' + (activeBrand === b ? 'active' : '') + '">' + b + ' <span class="cnt">' + bc[b] + '</span></a></li>';
  });
  sb.innerHTML = h;
}

function getFiltered() {
  var l = products.slice();
  if (activeCat)   l = l.filter(function(p) { return p.category === activeCat; });
  if (activeBrand) l = l.filter(function(p) { return p.brand === activeBrand; });
  if (searchQ)     l = l.filter(function(p) { return (p.name + p.brand + p.category).toLowerCase().indexOf(searchQ.toLowerCase()) >= 0; });
  l = l.filter(function(p) { return p.price >= pMin && p.price <= pMax; });
  if (sortMode === 'asc')  l.sort(function(a, b) { return a.price - b.price; });
  else if (sortMode === 'desc') l.sort(function(a, b) { return b.price - a.price; });
  else if (sortMode === 'az')   l.sort(function(a, b) { return a.name.localeCompare(b.name); });
  return l;
}

function renderProds() {
  var l = getFiltered();
  document.getElementById('pcount').textContent = l.length + ' resultado' + (l.length !== 1 ? 's' : '');
  var g = document.getElementById('products-grid');
  if (!l.length) {
    g.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-text)"><div style="font-size:48px">🔍</div><p style="margin-top:8px">Sin resultados. Probá otra búsqueda.</p></div>';
    return;
  }
  g.innerHTML = l.map(function(p) {
    var s  = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
    var op = p.oldPrice ? '<div style="font-size:11px;text-decoration:line-through;color:var(--gray-text)">$' + fmt(p.oldPrice) + '</div>' : '';
    return '<div class="product-card" onclick="showProduct(' + p.id + ')">'
      + '<div class="img-wrap"><img src="' + gImg(p) + '" alt="' + p.name + '" loading="lazy"></div>'
      + '<div class="brand">' + p.brand + '</div>'
      + '<div class="pname">' + p.name + '</div>'
      + '<div class="stars">' + s + ' <small style="color:var(--gray-text)">(' + p.reviews + ')</small></div>'
      + op
      + '<div class="price">$' + fmt(p.price) + '</div>'
      + '<div class="installments">💳 12x $' + fmt(Math.round(p.price / 12)) + ' sin interés</div>'
      + '<div class="shipping">🚚 Envío gratis</div>'
      + '<button class="add-btn" onclick="event.stopPropagation();addToCart(' + p.id + ')">Agregar al carrito</button>'
      + '</div>';
  }).join('');
}

// ========== DETALLE DE PRODUCTO ==========

var dQty = 1;

function showProduct(id) {
  showView('product');
  var p = products.find(function(x) { return x.id === id; });
  if (!p) return;
  window._pid = id;
  dQty = 1;
  var imgs   = p.images.length ? p.images : [gImg(p)];
  var thumbs = imgs.length > 1
    ? '<div class="thumb-row">' + imgs.map(function(src, i) {
        return '<img src="' + src + '" class="' + (i === 0 ? 'active' : '') + '" onclick="setMain(this,\'' + src + '\')">';
      }).join('') + '</div>'
    : '';
  var s    = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  var disc = p.oldPrice
    ? '<div class="disc-row"><span class="old-price">$' + fmt(p.oldPrice) + '</span><span class="disc-badge">' + Math.round((1 - p.price / p.oldPrice) * 100) + '% OFF</span></div>'
    : '';
  document.getElementById('product-detail').innerHTML =
    '<div class="detail-wrap"><div class="detail-grid">'
    + '<div class="gallery">' + thumbs + '<div class="main-img"><img id="main-img" src="' + imgs[0] + '" alt="' + p.name + '"></div></div>'
    + '<div class="pinfo">'
    + '<div class="breadcrumb">' + p.category + ' · ' + p.brand + '</div>'
    + '<h1>' + p.name + '</h1>'
    + '<div class="rating-row"><span class="stars">' + s + '</span><span style="color:var(--gray-text)">' + p.rating + ' · ' + p.reviews + ' opiniones</span></div>'
    + disc
    + '<div class="price-big">$' + fmt(p.price) + '</div>'
    + '<div style="color:var(--green);font-size:14px;margin-bottom:14px">💳 12x <strong>$' + fmt(Math.round(p.price / 12)) + '</strong> sin interés</div>'
    + '<div class="ship-box"><p style="color:var(--green);font-weight:600">🚚 Envío gratis a todo el país</p><p style="color:var(--gray-text)">📦 Llega en 3-5 días hábiles</p><p style="color:var(--gray-text)">🔄 Devolución gratis 30 días</p></div>'
    + '<div class="qty-row"><label>Cantidad:</label><div class="qty-ctrl"><button onclick="chQty(-1)">−</button><span id="dqty">1</span><button onclick="chQty(1)">+</button></div><span style="font-size:12px;color:var(--gray-text)">' + p.stock + ' disponibles</span></div>'
    + '<button class="cart-main-btn" onclick="addFromDetail(' + p.id + ')">🛒 Agregar al carrito</button>'
    + '<button class="buy-now-btn" onclick="buyNow(' + p.id + ')" style="margin-top:8px">⚡ Comprar ahora</button>'
    + '<div style="margin-top:14px;display:flex;gap:14px;font-size:12px;color:var(--gray-text)"><span>🔒 Seguro</span><span>🏅 Original</span><span>📞 Soporte</span></div>'
    + '</div>'
    + '<div class="desc-section"><h2>Descripción</h2><p>' + p.desc + '</p>'
    + '<table class="specs-tbl" style="margin-top:14px"><tbody>'
    + '<tr><td>Marca</td><td>' + p.brand + '</td></tr>'
    + '<tr><td>Categoría</td><td>' + p.category + '</td></tr>'
    + (p.sku    ? '<tr><td>SKU / OEM</td><td>' + p.sku + '</td></tr>' : '')
    + (p.compat ? '<tr><td>Compatibilidad</td><td>' + p.compat + '</td></tr>' : '')
    + (p.weight ? '<tr><td>Peso</td><td>' + p.weight + ' kg</td></tr>' : '')
    + '<tr><td>Stock</td><td>' + p.stock + ' unidades</td></tr>'
    + '</tbody></table></div>'
    + '</div></div>';
}

function setMain(t, src) {
  document.getElementById('main-img').src = src;
  document.querySelectorAll('.thumb-row img').forEach(function(i) { i.classList.remove('active'); });
  t.classList.add('active');
}

function chQty(d) {
  var p = products.find(function(x) { return x.id === window._pid; });
  if (!p) return;
  dQty = Math.max(1, Math.min(p.stock, dQty + d));
  document.getElementById('dqty').textContent = dQty;
}

function addFromDetail(id) { addToCart(id, dQty); dQty = 1; }
function buyNow(id)        { addToCart(id, dQty); dQty = 1; showView('checkout'); }

// ========== CARRITO ==========

function renderCart() {
  var b = document.getElementById('cart-body');
  if (!cart.length) {
    b.innerHTML = '<div class="cart-empty"><div style="font-size:48px">🛒</div><p style="margin-top:8px">Tu carrito está vacío</p><button class="add-btn" onclick="showView(\'home\')" style="display:inline-block;padding:10px 24px;margin-top:12px;width:auto">Ver productos</button></div>';
  } else {
    b.innerHTML = cart.map(function(item) {
      var p = products.find(function(x) { return x.id === item.id; });
      if (!p) return '';
      return '<div class="cart-item">'
        + '<img src="' + gImg(p) + '" alt="' + p.name + '">'
        + '<div class="ci-info"><div class="name">' + p.name + '</div><div class="brand">' + p.brand + ' · ' + p.category + '</div>'
        + '<div class="qty-sm"><button onclick="updQty(' + p.id + ',-1)">−</button><span>' + item.qty + '</span><button onclick="updQty(' + p.id + ',1)">+</button></div></div>'
        + '<div class="ci-right"><div class="price">$' + fmt(p.price * item.qty) + '</div><span class="remove" onclick="rmCart(' + p.id + ')">🗑 Eliminar</span></div>'
        + '</div>';
    }).join('');
  }
  var qty = cart.reduce(function(s, x) { return s + x.qty; }, 0);
  var sub = cart.reduce(function(s, x) {
    var p = products.find(function(z) { return z.id === x.id; });
    return s + (p ? p.price * x.qty : 0);
  }, 0);
  document.getElementById('sq').textContent = qty;
  document.getElementById('ss').textContent = '$' + fmt(sub);
  document.getElementById('st').textContent = '$' + fmt(sub);
}

// ========== CHECKOUT ==========

function renderCheckout() {
  var ci = document.getElementById('ck-items');
  ci.innerHTML = cart.map(function(item) {
    var p = products.find(function(z) { return z.id === item.id; });
    if (!p) return '';
    return '<div class="order-item"><img src="' + gImg(p) + '" alt="' + p.name + '"><div><div class="name">' + p.name + ' × ' + item.qty + '</div><div class="price">$' + fmt(p.price * item.qty) + '</div></div></div>';
  }).join('');
  var total = cart.reduce(function(s, x) {
    var p = products.find(function(z) { return z.id === x.id; });
    return s + (p ? p.price * x.qty : 0);
  }, 0);
  document.getElementById('ck-total').textContent = '$' + fmt(total);
}

// ========== ADMIN ==========

function catEmoji(c) {
  return { 'Filtros':'🌀','Frenos':'🛑','Suspensión':'🔩','Motor':'⚙️','Electricidad':'⚡','Aceites':'🛢️','Encendido':'🔥','Accesorios':'🔧' }[c] || '📦';
}

function renderAdmin() {
  if (adminOk) {
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    renderAdminTbl();
  } else {
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
  }
}

function renderAdminTbl() {
  var q = (document.getElementById('admin-search') || {}).value || '';
  var l = products.filter(function(p) {
    return !q || (p.name + p.brand + p.category).toLowerCase().indexOf(q.toLowerCase()) >= 0;
  });
  document.getElementById('admin-tbody').innerHTML = l.map(function(p) {
    var th = p.images.length
      ? '<img src="' + p.images[0] + '" class="thumb">'
      : '<div class="thumb-ph">' + catEmoji(p.category) + '</div>';
    var op = p.oldPrice ? '<br><span style="font-size:11px;text-decoration:line-through;color:var(--gray-text)">$' + fmt(p.oldPrice) + '</span>' : '';
    var sk = p.stock > 0
      ? '<span class="stock-ok">' + p.stock + ' en stock</span>'
      : '<span class="stock-no">Sin stock</span>';
    return '<tr><td>' + th + '</td><td><strong>' + p.name + '</strong></td><td>' + p.category + '</td>'
      + '<td><strong>$' + fmt(p.price) + '</strong>' + op + '</td><td>' + sk + '</td>'
      + '<td><span class="tbl-edit" onclick="openModal(' + p.id + ')">✏️ Editar</span>'
      + '<span class="tbl-del" onclick="delProd(' + p.id + ')">🗑 Borrar</span></td></tr>';
  }).join('');
}

function renderPreview() {
  document.getElementById('preview-grid').innerHTML = pendingImgs.map(function(s, i) {
    return '<div class="preview-item"><img src="' + s + '"><span class="rm-img" onclick="rmImg(' + i + ')">×</span></div>';
  }).join('');
}
