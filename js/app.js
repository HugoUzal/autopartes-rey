// ========== PUNTO DE ENTRADA ==========
// Orden de carga en index.html:
//   firebase-app-compat.js / firebase-firestore-compat.js / firebase-auth-compat.js
//   firebase.js → data.js → store.js → ui.js → bot.js → app.js

// Aplicar modo oscuro guardado
if (localStorage.getItem('aar-dark') === '1') {
  document.body.classList.add('dark');
  var ds = document.getElementById('dark-switch');
  if (ds) ds.classList.add('active');
}

// Ocultar barra del Mundial fuera de junio-julio 2026
(function() {
  var now = new Date();
  var year = now.getFullYear(), month = now.getMonth() + 1; // mes 1-12
  var bar = document.getElementById('mundial-bar');
  if (bar && !(year === 2026 && (month === 6 || month === 7))) {
    bar.style.display = 'none';
  }
})();

// 1. Iniciar Firebase
initFirebase();

// 2. Escuchar cambios de sesión (Firebase restaura sesión automáticamente al recargar)
fbOnAuthChange(function(user) {
  adminOk = !!user;
  // Si la vista admin ya está abierta, re-renderizarla con el nuevo estado
  if (!document.getElementById('view-admin').classList.contains('hidden')) {
    renderAdmin();
  }
});

// 3. Acceso secreto al admin via URL #admin
function checkAdminHash() {
  if (window.location.hash === '#admin') {
    showView('admin');
    // Limpiar el hash para que no quede visible en la barra de dirección
    history.replaceState(null, '', window.location.pathname);
  }
}
window.addEventListener('hashchange', checkAdminHash);

// 4. Mostrar estado de carga mientras trae productos
document.getElementById('products-grid').innerHTML =
  '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-text)">'
  + '<div style="font-size:36px">⏳</div>'
  + '<p style="margin-top:8px">Cargando productos...</p>'
  + '</div>';

// 5. Cargar productos desde Firestore
fbLoadProducts(function(err, list) {
  if (!err && list.length > 0) {
    // Firebase tiene productos → usarlos
    products = list;
    nextId   = Math.max.apply(null, products.map(function(p) { return p.id || 0; })) + 1;
  }
  // Si Firebase está vacío o falla → quedan los productos hardcodeados de data.js
  renderHome();
  updateBadge();
  // Verificar hash después de que la página está lista
  checkAdminHash();
});
