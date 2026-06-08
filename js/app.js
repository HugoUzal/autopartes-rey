// ========== PUNTO DE ENTRADA ==========
// Este archivo solo inicializa la app.
// El orden de carga en index.html debe ser:
//   1. data.js   → productos, constantes, gImg, fmt
//   2. store.js  → estado global, lógica de negocio
//   3. ui.js     → funciones de renderizado
//   4. bot.js    → chatbot Alejandro
//   5. app.js    → init (este archivo)

renderHome();
updateBadge();
