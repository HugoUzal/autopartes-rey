// ========== DATOS ==========
var products = [
  {id:1,name:'Filtro de Aceite Fram PH3614',brand:'Fram',category:'Filtros',price:2850,oldPrice:3500,stock:45,desc:'Filtro de alto rendimiento. Tecnología Dual-Grip® para fácil instalación. Filtración al 95% de partículas de 25 micrones.',compat:'Toyota Corolla 2010-2022, VW Vento, Chevrolet Cruze',sku:'FRA-PH3614',weight:'0.3',images:[],rating:4.8,reviews:124},
  {id:2,name:'Bujías NGK BKR6E (x4)',brand:'NGK',category:'Encendido',price:4200,oldPrice:5100,stock:80,desc:'Juego de 4 bujías NGK electrodo de níquel de alta pureza. Vida útil hasta 40.000 km.',compat:'Honda Civic, Toyota Hilux, Chevrolet S10, Ford Ranger',sku:'NGK-BKR6E',weight:'0.2',images:[],rating:4.9,reviews:287},
  {id:3,name:'Pastillas de Freno Brembo P06018',brand:'Brembo',category:'Frenos',price:7500,oldPrice:9200,stock:30,desc:'Pastillas delanteras de alta performance. Sin amianto. Mayor disipación de calor.',compat:'Ford Focus III, Chevrolet Onix Plus, VW Golf VII',sku:'BRE-P06018',weight:'0.8',images:[],rating:4.7,reviews:156},
  {id:4,name:'Amortiguador Monroe Gas-Magnum',brand:'Monroe',category:'Suspensión',price:13500,oldPrice:0,stock:22,desc:'Amortiguador de gas Monroe con tecnología Gas-Matic. Instalación directa OEM.',compat:'Chevrolet Tracker 2019+, Toyota SW4, Mitsubishi Outlander',sku:'MON-G55245',weight:'2.5',images:[],rating:4.6,reviews:89},
  {id:5,name:'Aceite Motul 5W30 100% Sintético 4L',brand:'Motul',category:'Aceites',price:5800,oldPrice:7000,stock:60,desc:'Aceite 100% sintético de última generación. Alta resistencia a la oxidación y viscosidad estable.',compat:'Universal para motores nafteros y diésel modernos',sku:'MOT-5W30-4L',weight:'3.8',images:[],rating:4.9,reviews:341},
  {id:6,name:'Batería Bosch S4 Silver 12V 60Ah',brand:'Bosch',category:'Electricidad',price:19500,oldPrice:23000,stock:15,desc:'Batería libre de mantenimiento PowerFrame®. Alta confiabilidad en frío. Vida útil hasta 4 años.',compat:'Universal para autos livianos y SUV',sku:'BOS-S460',weight:'14',images:[],rating:4.8,reviews:203},
  {id:7,name:'Filtro de Aire K&N Alto Flujo',brand:'K&N',category:'Filtros',price:3200,oldPrice:3900,stock:35,desc:'Filtro lavable y reutilizable. Mejora hasta 15 HP. Garantía de por vida del fabricante.',compat:'Honda Fit, Peugeot 208, Renault Sandero, Fiat Uno',sku:'KN-E-2875',weight:'0.4',images:[],rating:4.7,reviews:178},
  {id:8,name:'Kit Correa Distribución Gates',brand:'Gates',category:'Motor',price:9800,oldPrice:11500,stock:20,desc:'Kit completo con tensores y rodamientos. Caucho reforzado con fibra de vidrio. -40°C a 130°C.',compat:'Renault Clio II/III, Peugeot 206/207, Citroën C3',sku:'GAT-K015487',weight:'1.2',images:[],rating:4.8,reviews:112},
  {id:9,name:'Disco de Freno Ventilado Zimmermann',brand:'Zimmermann',category:'Frenos',price:8900,oldPrice:10500,stock:18,desc:'Disco ventilado premium con recubrimiento ZincCoat anticorrosión. Equilibrado dinámico.',compat:'VW Golf VII, Audi A3 8V, SEAT León 5F',sku:'ZIM-150-3437-20',weight:'4.5',images:[],rating:4.6,reviews:67},
  {id:10,name:'Aceite Hidráulico Fric-Rot 1L',brand:'Fric-Rot',category:'Aceites',price:1850,oldPrice:2200,stock:100,desc:'Aceite mineral para dirección asistida. Anti-desgaste y anticorrosión. Compatible con todos los sellos.',compat:'Universal para todos los vehículos',sku:'FR-AH1L',weight:'0.95',images:[],rating:4.5,reviews:89},
  {id:11,name:'Pastillas Freno Traseras Brembo Sport',brand:'Brembo',category:'Frenos',price:6200,oldPrice:7800,stock:25,desc:'Pastillas traseras deportivas. Mayor eficiencia de frenado a altas temperaturas. Bajo nivel de polvo.',compat:'BMW Serie 3 F30, Mercedes Clase C W205, Audi A4 B9',sku:'BRE-P44020',weight:'0.7',images:[],rating:4.7,reviews:43},
  {id:12,name:'Amortiguador Trasero Monroe Reflex',brand:'Monroe',category:'Suspensión',price:11200,oldPrice:13500,stock:16,desc:'Tecnología de recarga continua de gas. Respuesta inmediata. Instalación directa OEM.',compat:'Toyota Corolla E210 2019+, Honda Civic FC 2016+',sku:'MON-R55233',weight:'2.2',images:[],rating:4.6,reviews:71},
];

var cart=[], activeCat='', activeBrand='', searchQ='', pMin=0, pMax=Infinity, sortMode='default';
var adminOk=false, editId=null, pendingImgs=[], nextId=products.length+1, botOpen=false;
var CATS=['Filtros','Frenos','Suspensión','Motor','Electricidad','Aceites','Encendido','Accesorios'];
var PH={
  'Filtros':'https://placehold.co/400x400/e8f4fd/1a3a5c?text=Filtro',
  'Frenos':'https://placehold.co/400x400/fde8e8/8b1a1a?text=Frenos',
  'Suspensión':'https://placehold.co/400x400/f0e8fd/4a1a8b?text=Suspensión',
  'Motor':'https://placehold.co/400x400/e8fde8/1a5c1a?text=Motor',
  'Electricidad':'https://placehold.co/400x400/fffde8/5c5c00?text=Eléctrico',
  'Aceites':'https://placehold.co/400x400/fde8f8/5c1a4a?text=Aceite',
  'Encendido':'https://placehold.co/400x400/fdf0e8/5c3a1a?text=Encendido',
  'Accesorios':'https://placehold.co/400x400/e8f8fd/1a4a5c?text=Accesorio'
};
function gImg(p,i){i=i||0;return (p.images&&p.images[i])?p.images[i]:(PH[p.category]||'https://placehold.co/400x400/f0f0f0/888?text=Producto');}
function fmt(n){return Number(n).toLocaleString('es-AR');}
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.style.display='block';clearTimeout(window._tt);window._tt=setTimeout(function(){t.style.display='none';},2800);}

// ===== VIEWS =====
function showView(v){
  ['home','product','cart','checkout','admin'].forEach(function(n){document.getElementById('view-'+n).classList.toggle('hidden',n!==v);});
  window.scrollTo(0,0);
  if(v==='home') renderHome();
  if(v==='cart') renderCart();
  if(v==='checkout') renderCheckout();
  if(v==='admin') renderAdmin();
}

// ===== HOME =====
function renderHome(){renderPills();renderSidebar();renderProds();}

function renderPills(){
  var el=document.getElementById('cat-pills');
  var h='<button class="cat-pill '+(activeCat===''?'active':'')+'" onclick="filterCat(\'\')">Todos</button>';
  CATS.forEach(function(c){h+='<button class="cat-pill '+(activeCat===c?'active':'')+'" onclick="filterCat(\''+c+'\')">'+c+'</button>';});
  el.innerHTML=h;
}

function renderSidebar(){
  var cc={},bc={};
  products.forEach(function(p){cc[p.category]=(cc[p.category]||0)+1;if(p.brand)bc[p.brand]=(bc[p.brand]||0)+1;});
  var sc=document.getElementById('sidebar-cats');
  var h='<li><a onclick="filterCat(\'\');return false" class="'+(activeCat===''?'active':'')+'">Todas <span class="cnt">'+products.length+'</span></a></li>';
  Object.keys(cc).forEach(function(c){h+='<li><a onclick="filterCat(\''+c+'\');return false" class="'+(activeCat===c?'active':'')+'">'+c+' <span class="cnt">'+cc[c]+'</span></a></li>';});
  sc.innerHTML=h;
  var sb=document.getElementById('sidebar-brands');
  h='<li><a onclick="filterBrand(\'\');return false" class="'+(activeBrand===''?'active':'')+'">Todas</a></li>';
  Object.keys(bc).slice(0,8).forEach(function(b){h+='<li><a onclick="filterBrand(\''+b+'\');return false" class="'+(activeBrand===b?'active':'')+'">'+b+' <span class="cnt">'+bc[b]+'</span></a></li>';});
  sb.innerHTML=h;
}

function getFiltered(){
  var l=products.slice();
  if(activeCat) l=l.filter(function(p){return p.category===activeCat;});
  if(activeBrand) l=l.filter(function(p){return p.brand===activeBrand;});
  if(searchQ) l=l.filter(function(p){return (p.name+p.brand+p.category).toLowerCase().indexOf(searchQ.toLowerCase())>=0;});
  l=l.filter(function(p){return p.price>=pMin&&p.price<=pMax;});
  if(sortMode==='asc') l.sort(function(a,b){return a.price-b.price;});
  else if(sortMode==='desc') l.sort(function(a,b){return b.price-a.price;});
  else if(sortMode==='az') l.sort(function(a,b){return a.name.localeCompare(b.name);});
  return l;
}

function renderProds(){
  var l=getFiltered();
  document.getElementById('pcount').textContent=l.length+' resultado'+(l.length!==1?'s':'');
  var g=document.getElementById('products-grid');
  if(!l.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-text)"><div style="font-size:48px">🔍</div><p style="margin-top:8px">Sin resultados. Probá otra búsqueda.</p></div>';return;}
  g.innerHTML=l.map(function(p){
    var s='★'.repeat(Math.round(p.rating))+'☆'.repeat(5-Math.round(p.rating));
    var op=p.oldPrice?'<div style="font-size:11px;text-decoration:line-through;color:var(--gray-text)">$'+fmt(p.oldPrice)+'</div>':'';
    return '<div class="product-card" onclick="showProduct('+p.id+')"><div class="img-wrap"><img src="'+gImg(p)+'" alt="'+p.name+'" loading="lazy"></div>'
      +'<div class="brand">'+p.brand+'</div><div class="pname">'+p.name+'</div>'
      +'<div class="stars">'+s+' <small style="color:var(--gray-text)">('+p.reviews+')</small></div>'
      +op+'<div class="price">$'+fmt(p.price)+'</div>'
      +'<div class="installments">💳 12x $'+fmt(Math.round(p.price/12))+' sin interés</div>'
      +'<div class="shipping">🚚 Envío gratis</div>'
      +'<button class="add-btn" onclick="event.stopPropagation();addToCart('+p.id+')">Agregar al carrito</button></div>';
  }).join('');
}

function filterCat(c){activeCat=c;searchQ='';document.getElementById('search-input').value='';renderHome();}
function filterBrand(b){activeBrand=b;renderHome();}
function handleSearch(){searchQ=document.getElementById('search-input').value;activeCat='';activeBrand='';renderHome();}
function applyPrice(){pMin=parseFloat(document.getElementById('price-min').value)||0;pMax=parseFloat(document.getElementById('price-max').value)||Infinity;renderProds();}
function sortProds(v){sortMode=v;renderProds();}

// ===== PRODUCT DETAIL =====
var dQty=1;
function showProduct(id){
  showView('product');
  var p=products.find(function(x){return x.id===id;});
  if(!p) return;
  window._pid=id; dQty=1;
  var imgs=p.images.length?p.images:[gImg(p)];
  var thumbs=imgs.length>1?'<div class="thumb-row">'+imgs.map(function(src,i){return '<img src="'+src+'" class="'+(i===0?'active':'')+'" onclick="setMain(this,\''+src+'\')">';}).join('')+'</div>':'';
  var s='★'.repeat(Math.round(p.rating))+'☆'.repeat(5-Math.round(p.rating));
  var disc=p.oldPrice?'<div class="disc-row"><span class="old-price">$'+fmt(p.oldPrice)+'</span><span class="disc-badge">'+Math.round((1-p.price/p.oldPrice)*100)+'% OFF</span></div>':'';
  document.getElementById('product-detail').innerHTML=
    '<div class="detail-wrap"><div class="detail-grid">'
    +'<div class="gallery">'+thumbs+'<div class="main-img"><img id="main-img" src="'+imgs[0]+'" alt="'+p.name+'"></div></div>'
    +'<div class="pinfo">'
    +'<div class="breadcrumb">'+p.category+' · '+p.brand+'</div>'
    +'<h1>'+p.name+'</h1>'
    +'<div class="rating-row"><span class="stars">'+s+'</span><span style="color:var(--gray-text)">'+p.rating+' · '+p.reviews+' opiniones</span></div>'
    +disc+'<div class="price-big">$'+fmt(p.price)+'</div>'
    +'<div style="color:var(--green);font-size:14px;margin-bottom:14px">💳 12x <strong>$'+fmt(Math.round(p.price/12))+'</strong> sin interés</div>'
    +'<div class="ship-box"><p style="color:var(--green);font-weight:600">🚚 Envío gratis a todo el país</p><p style="color:var(--gray-text)">📦 Llega en 3-5 días hábiles</p><p style="color:var(--gray-text)">🔄 Devolución gratis 30 días</p></div>'
    +'<div class="qty-row"><label>Cantidad:</label><div class="qty-ctrl"><button onclick="chQty(-1)">−</button><span id="dqty">1</span><button onclick="chQty(1)">+</button></div><span style="font-size:12px;color:var(--gray-text)">'+p.stock+' disponibles</span></div>'
    +'<button class="cart-main-btn" onclick="addFromDetail('+p.id+')">🛒 Agregar al carrito</button>'
    +'<button class="buy-now-btn" onclick="buyNow('+p.id+')" style="margin-top:8px">⚡ Comprar ahora</button>'
    +'<div style="margin-top:14px;display:flex;gap:14px;font-size:12px;color:var(--gray-text)"><span>🔒 Seguro</span><span>🏅 Original</span><span>📞 Soporte</span></div>'
    +'</div>'
    +'<div class="desc-section"><h2>Descripción</h2><p>'+p.desc+'</p>'
    +'<table class="specs-tbl" style="margin-top:14px"><tbody>'
    +'<tr><td>Marca</td><td>'+p.brand+'</td></tr>'
    +'<tr><td>Categoría</td><td>'+p.category+'</td></tr>'
    +(p.sku?'<tr><td>SKU / OEM</td><td>'+p.sku+'</td></tr>':'')
    +(p.compat?'<tr><td>Compatibilidad</td><td>'+p.compat+'</td></tr>':'')
    +(p.weight?'<tr><td>Peso</td><td>'+p.weight+' kg</td></tr>':'')
    +'<tr><td>Stock</td><td>'+p.stock+' unidades</td></tr>'
    +'</tbody></table></div>'
    +'</div></div>';
}

function setMain(t,src){document.getElementById('main-img').src=src;document.querySelectorAll('.thumb-row img').forEach(function(i){i.classList.remove('active');});t.classList.add('active');}
function chQty(d){var p=products.find(function(x){return x.id===window._pid;});if(!p)return;dQty=Math.max(1,Math.min(p.stock,dQty+d));document.getElementById('dqty').textContent=dQty;}
function addFromDetail(id){addToCart(id,dQty);dQty=1;}
function buyNow(id){addToCart(id,dQty);dQty=1;showView('checkout');}

// ===== CART =====
function addToCart(id,qty){
  qty=qty||1;
  var p=products.find(function(x){return x.id===id;});if(!p)return;
  var e=cart.find(function(x){return x.id===id;});
  if(e) e.qty=Math.min(p.stock,e.qty+qty); else cart.push({id:id,qty:qty});
  updateBadge(); toast('✅ '+p.name+' agregado al carrito');
}
function updateBadge(){document.getElementById('cart-badge').textContent=cart.reduce(function(s,x){return s+x.qty;},0);}

function renderCart(){
  var b=document.getElementById('cart-body');
  if(!cart.length){
    b.innerHTML='<div class="cart-empty"><div style="font-size:48px">🛒</div><p style="margin-top:8px">Tu carrito está vacío</p><button class="add-btn" onclick="showView(\'home\')" style="display:inline-block;padding:10px 24px;margin-top:12px;width:auto">Ver productos</button></div>';
  } else {
    b.innerHTML=cart.map(function(item){
      var p=products.find(function(x){return x.id===item.id;});if(!p)return '';
      return '<div class="cart-item"><img src="'+gImg(p)+'" alt="'+p.name+'"><div class="ci-info"><div class="name">'+p.name+'</div><div class="brand">'+p.brand+' · '+p.category+'</div><div class="qty-sm"><button onclick="updQty('+p.id+',-1)">−</button><span>'+item.qty+'</span><button onclick="updQty('+p.id+',1)">+</button></div></div><div class="ci-right"><div class="price">$'+fmt(p.price*item.qty)+'</div><span class="remove" onclick="rmCart('+p.id+')">🗑 Eliminar</span></div></div>';
    }).join('');
  }
  var qty=cart.reduce(function(s,x){return s+x.qty;},0);
  var sub=cart.reduce(function(s,x){var p=products.find(function(z){return z.id===x.id;});return s+(p?p.price*x.qty:0);},0);
  document.getElementById('sq').textContent=qty;
  document.getElementById('ss').textContent='$'+fmt(sub);
  document.getElementById('st').textContent='$'+fmt(sub);
}

function updQty(id,d){
  var p=products.find(function(x){return x.id===id;});
  var e=cart.find(function(x){return x.id===id;});
  if(!e||!p)return;
  e.qty=Math.max(0,Math.min(p.stock,e.qty+d));
  if(e.qty===0) cart=cart.filter(function(x){return x.id!==id;});
  updateBadge();renderCart();
}
function rmCart(id){cart=cart.filter(function(x){return x.id!==id;});updateBadge();renderCart();}

// ===== CHECKOUT =====
function renderCheckout(){
  var ci=document.getElementById('ck-items');
  ci.innerHTML=cart.map(function(item){
    var p=products.find(function(z){return z.id===item.id;});if(!p)return '';
    return '<div class="order-item"><img src="'+gImg(p)+'" alt="'+p.name+'"><div><div class="name">'+p.name+' × '+item.qty+'</div><div class="price">$'+fmt(p.price*item.qty)+'</div></div></div>';
  }).join('');
  var total=cart.reduce(function(s,x){var p=products.find(function(z){return z.id===x.id;});return s+(p?p.price*x.qty:0);},0);
  document.getElementById('ck-total').textContent='$'+fmt(total);
}

function processPayment(){
  var nombre=document.getElementById('ck-nombre').value;
  var card=document.getElementById('ck-card').value;
  if(!nombre||!card){toast('⚠️ Completá todos los campos obligatorios');return;}
  var total=cart.reduce(function(s,x){var p=products.find(function(z){return z.id===x.id;});return s+(p?p.price*x.qty:0);},0);
  var email=document.getElementById('ck-email').value||'tu email';
  var pedido='APR-'+Date.now().toString().slice(-6);
  document.getElementById('ck-content').innerHTML=
    '<div class="success-wrap"><div class="check">✅</div><h2>¡Pago exitoso!</h2>'
    +'<p>Tu pedido fue confirmado. Recibirás un email en <strong>'+email+'</strong>.</p>'
    +'<div class="info-box">'
    +'<p><strong>N° de pedido:</strong> '+pedido+'</p>'
    +'<p><strong>Total pagado:</strong> <span style="color:var(--navy);font-weight:700">$'+fmt(total)+'</span></p>'
    +'<p><strong>Entrega estimada:</strong> 3-5 días hábiles</p>'
    +'</div>'
    +'<button onclick="cart=[];updateBadge();showView(\'home\')">Seguir comprando 🛒</button></div>';
  cart=[];updateBadge();
}

// ===== ADMIN =====
function renderAdmin(){
  if(adminOk){
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    renderAdminTbl();
  } else {
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
  }
}
function adminLogin(){
  if(document.getElementById('au').value==='admin'&&document.getElementById('ap').value==='rey2024'){
    adminOk=true;renderAdmin();
  } else toast('❌ Usuario o contraseña incorrectos');
}
function adminLogout(){adminOk=false;renderAdmin();}

function catEmoji(c){return {'Filtros':'🌀','Frenos':'🛑','Suspensión':'🔩','Motor':'⚙️','Electricidad':'⚡','Aceites':'🛢️','Encendido':'🔥','Accesorios':'🔧'}[c]||'📦';}

function renderAdminTbl(){
  var q=(document.getElementById('admin-search')||{}).value||'';
  var l=products.filter(function(p){return !q||(p.name+p.brand+p.category).toLowerCase().indexOf(q.toLowerCase())>=0;});
  document.getElementById('admin-tbody').innerHTML=l.map(function(p){
    var th=p.images.length?'<img src="'+p.images[0]+'" class="thumb">':'<div class="thumb-ph">'+catEmoji(p.category)+'</div>';
    var op=p.oldPrice?'<br><span style="font-size:11px;text-decoration:line-through;color:var(--gray-text)">$'+fmt(p.oldPrice)+'</span>':'';
    var sk=p.stock>0?'<span class="stock-ok">'+p.stock+' en stock</span>':'<span class="stock-no">Sin stock</span>';
    return '<tr><td>'+th+'</td><td><strong>'+p.name+'</strong></td><td>'+p.category+'</td><td><strong>$'+fmt(p.price)+'</strong>'+op+'</td><td>'+sk+'</td><td><span class="tbl-edit" onclick="openModal('+p.id+')">✏️ Editar</span><span class="tbl-del" onclick="delProd('+p.id+')">🗑 Borrar</span></td></tr>';
  }).join('');
}

function delProd(id){if(!confirm('¿Eliminar este producto?'))return;products=products.filter(function(p){return p.id!==id;});renderAdminTbl();toast('🗑 Producto eliminado');}

// ===== MODAL =====
function openModal(id){
  editId=id||null; pendingImgs=[];
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal-title').textContent=id?'Editar Producto':'Agregar Producto';
  if(id){
    var p=products.find(function(x){return x.id===id;});
    if(p){
      document.getElementById('p-name').value=p.name;
      document.getElementById('p-brand').value=p.brand;
      document.getElementById('p-cat').value=p.category;
      document.getElementById('p-price').value=p.price;
      document.getElementById('p-oldprice').value=p.oldPrice||'';
      document.getElementById('p-stock').value=p.stock;
      document.getElementById('p-desc').value=p.desc;
      document.getElementById('p-compat').value=p.compat||'';
      document.getElementById('p-sku').value=p.sku||'';
      document.getElementById('p-weight').value=p.weight||'';
      pendingImgs=p.images.slice();
      renderPreview();
    }
  } else {
    ['p-name','p-brand','p-price','p-oldprice','p-stock','p-desc','p-compat','p-sku','p-weight'].forEach(function(i){document.getElementById(i).value='';});
    document.getElementById('p-cat').value='';
    document.getElementById('preview-grid').innerHTML='';
  }
}
function closeModal(){document.getElementById('modal').classList.add('hidden');editId=null;pendingImgs=[];}

function handleUpload(e){
  var files=Array.prototype.slice.call(e.target.files);
  files.slice(0,5-pendingImgs.length).forEach(function(f){
    var r=new FileReader();
    r.onload=function(ev){pendingImgs.push(ev.target.result);renderPreview();};
    r.readAsDataURL(f);
  });
  e.target.value='';
}
function renderPreview(){
  document.getElementById('preview-grid').innerHTML=pendingImgs.map(function(s,i){
    return '<div class="preview-item"><img src="'+s+'"><span class="rm-img" onclick="rmImg('+i+')">×</span></div>';
  }).join('');
}
function rmImg(i){pendingImgs.splice(i,1);renderPreview();}

function saveProduct(){
  var name=document.getElementById('p-name').value.trim();
  var cat=document.getElementById('p-cat').value;
  var price=parseFloat(document.getElementById('p-price').value);
  var desc=document.getElementById('p-desc').value.trim();
  if(!name||!cat||!price||!desc){toast('⚠️ Completá los campos obligatorios (*)');return;}
  var data={name:name,brand:document.getElementById('p-brand').value.trim(),category:cat,price:price,
    oldPrice:parseFloat(document.getElementById('p-oldprice').value)||0,
    stock:parseInt(document.getElementById('p-stock').value)||0,
    desc:desc,compat:document.getElementById('p-compat').value.trim(),
    sku:document.getElementById('p-sku').value.trim(),
    weight:document.getElementById('p-weight').value.trim(),
    images:pendingImgs.slice(),rating:4.5,reviews:0};
  if(editId){
    var idx=products.findIndex(function(p){return p.id===editId;});
    products[idx]=Object.assign(products[idx],data);
    toast('✅ Producto actualizado');
  } else {
    products.push(Object.assign({id:nextId++},data));
    toast('✅ Producto agregado');
  }
  closeModal();renderAdminTbl();
}

// ===== BOT =====
var BOT=[
  {t:['envío','envio','despacho','manda','llega','entrega'],r:'🚚 ¡Sí! Tenemos <strong>envío gratis</strong> a todo el país. Los pedidos llegan en 3-5 días hábiles. Zonas del interior pueden demorar hasta 7 días.'},
  {t:['tarjeta','pago','cuota','mercadopago','mp','crédito','debito','efectivo'],r:'💳 Aceptamos <strong>Visa, Mastercard, Amex</strong> y <strong>MercadoPago</strong>. ¡Hasta <strong>12 cuotas sin interés</strong> en todos los productos!'},
  {t:['garantía','garantia','devoluci','reclam'],r:'🛡️ Todos nuestros productos tienen <strong>garantía del fabricante</strong> y <strong>30 días de devolución sin costo</strong>. Tu compra está 100% protegida.'},
  {t:['oferta','descuento','promo','precio','rebaj','barato'],r:'🏷️ ¡Tenemos ofertas todos los días! Hoy hay hasta <strong>30% OFF en frenos y aceites</strong>. Mirá los chips de categorías en el inicio.'},
  {t:['horario','aten','abre','cierra','func','cuando'],r:'🕐 Atendemos <strong>lunes a viernes de 8:00 a 18:00</strong> y sábados de 9:00 a 13:00. También por WhatsApp las 24hs.'},
  {t:['filtro'],r:'🌀 Tenemos <strong>filtros de aceite, aire y combustible</strong> de Fram y K&N. ¡Buscalos en la sección Filtros!'},
  {t:['freno','disco','pastilla'],r:'🛑 Tenemos <strong>pastillas y discos de freno</strong> Brembo y Zimmermann. Para el freno correcto decime el modelo y año de tu auto.'},
  {t:['aceite','lubricante'],r:'🛢️ Tenemos <strong>Motul, Fric-Rot, Castrol</strong> en todas las viscosidades. Sintéticos y semi-sintéticos.'},
  {t:['bater','arranque'],r:'⚡ Baterías <strong>Bosch y Moura</strong> para todos los vehículos. ¡Con instalación gratis en sucursal!'},
  {t:['hola','buenas','buen','ola','hey','saludos'],r:'👋 ¡Hola! Soy <strong>Alejandro</strong>, tu mecánico virtual de Auto Partes Rey. ¿En qué te ayudo hoy?'},
  {t:['gracias','graciosa','genial','excelente','perfecto','ok'],r:'😊 ¡Con mucho gusto! Si necesitás algo más, acá estoy. ¡Que andes bien! 🔧'},
  {t:['whatsapp','telefono','contacto','llamar','mail','email'],r:'📱 Escribinos por <strong>WhatsApp al +54 9 11 4567-8901</strong> o a ventas@autopartesrey.com'},
  {t:['compatib','sirve','anda','modelo','auto','marca','año','vehiculo'],r:'🔍 Para verificar compatibilidad decime <strong>marca, modelo y año</strong> de tu vehículo y te indico exactamente qué necesitás.'},
  {t:['amortiguador','suspension','resorte'],r:'🔩 Tenemos <strong>amortiguadores Monroe</strong> para todas las marcas. Delanteros y traseros. ¡Instalación directa OEM!'},
  {t:['bujia','encendido','chispa'],r:'🔥 Bujías <strong>NGK y Bosch</strong> para todos los motores. Juegos de 4 con garantía incluida.'},
];

function initBot(){addBotMsg('👋 ¡Hola! Soy <strong>Alejandro</strong>, mecánico virtual de <strong>Auto Partes Rey</strong>. ¿En qué te puedo ayudar?',true);}

function toggleBot(){
  botOpen=!botOpen;
  document.getElementById('bot-bubble').classList.toggle('hidden',!botOpen);
  if(botOpen&&!document.getElementById('bot-msgs').children.length) initBot();
  if(botOpen) setTimeout(function(){document.getElementById('bot-input').focus();},100);
}

function addBotMsg(text,isBot){
  var m=document.getElementById('bot-msgs');
  var d=document.createElement('div');
  d.className='msg '+(isBot?'bot':'user');
  d.innerHTML=text;
  m.appendChild(d);
  m.scrollTop=m.scrollHeight;
}

function botSend(){
  var inp=document.getElementById('bot-input');
  var text=inp.value.trim();if(!text)return;
  addBotMsg(text,false);inp.value='';
  setTimeout(function(){
    var low=text.toLowerCase();
    var match=null;
    for(var i=0;i<BOT.length;i++){if(BOT[i].t.some(function(t){return low.indexOf(t)>=0;})){match=BOT[i];break;}}
    addBotMsg(match?match.r:'🔧 Para más info escribinos por <strong>WhatsApp al +54 9 11 4567-8901</strong>. ¡Te atendemos al toque!',true);
  },600);
}
function botQ(t){document.getElementById('bot-input').value=t;botSend();}

// ===== INIT =====
renderHome();
updateBadge();
