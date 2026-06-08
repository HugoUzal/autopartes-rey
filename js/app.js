// ========== PUNTO DE ENTRADA ==========
// Orden de carga en index.html:
//   firebase-app-compat.js / firebase-firestore-compat.js / firebase-storage-compat.js
//   firebase.js → data.js → store.js → ui.js → bot.js → app.js

// 1. Iniciar Firebase
initFirebase();

// 2. Mostrar estado de carga mientras trae productos
document.getElementById('products-grid').innerHTML =
  '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-text)">'
  + '<div style="font-size:36px">⏳</div>'
  + '<p style="margin-top:8px">Cargando productos...</p>'
  + '</div>';

// 3. Cargar productos desde Firestore
fbLoadProducts(function(err, list) {
  if (!err && list.length > 0) {
    // Firebase tiene productos → usarlos
    products = list;
    nextId   = Math.max.apply(null, products.map(function(p) { return p.id || 0; })) + 1;
  }
  // Si Firebase está vacío o falla → quedan los productos hardcodeados de data.js
  renderHome();
  updateBadge();
});
