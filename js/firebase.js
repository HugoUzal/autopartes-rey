// ========== FIREBASE ==========
// Requiere los scripts compat cargados en index.html:
//   firebase-app-compat.js
//   firebase-firestore-compat.js
//   firebase-auth-compat.js

var db, auth;

function initFirebase() {
  var config = {
    apiKey:            "AIzaSyABBgQKgpH4vOz6MaGRAk2sbJRfJ4vbTbE",
    authDomain:        "auto-partes-rey.firebaseapp.com",
    projectId:         "auto-partes-rey",
    storageBucket:     "auto-partes-rey.firebasestorage.app",
    messagingSenderId: "132018710935",
    appId:             "1:132018710935:web:b78e4c321581af5e19bcd2"
  };
  firebase.initializeApp(config);
  db   = firebase.firestore();
  auth = firebase.auth();
  console.log('🔥 Firebase iniciado');
}

// ========== AUTH ==========

// Login con email y contraseña
function fbLogin(email, password, callback) {
  auth.signInWithEmailAndPassword(email, password)
    .then(function(result) { callback(null, result.user); })
    .catch(function(err) { callback(err, null); });
}

// Logout
function fbLogout(callback) {
  auth.signOut()
    .then(function() { if (callback) callback(null); })
    .catch(function(err) { if (callback) callback(err); });
}

// Escucha cambios de sesión (se llama al cargar y cuando cambia el estado)
function fbOnAuthChange(callback) {
  auth.onAuthStateChanged(function(user) { callback(user); });
}

// Devuelve el usuario actualmente logueado (o null)
function fbCurrentUser() {
  return auth.currentUser;
}

// ========== PRODUCTOS ==========

// Lee todos los productos de Firestore
function fbLoadProducts(callback) {
  db.collection('products').orderBy('id').get()
    .then(function(snap) {
      var list = [];
      snap.forEach(function(doc) {
        var d = doc.data();
        d._docId = doc.id;
        list.push(d);
      });
      callback(null, list);
    })
    .catch(function(err) { callback(err, []); });
}

// Crea o reemplaza un producto en Firestore
function fbSaveProduct(data, docId, callback) {
  var ref = docId
    ? db.collection('products').doc(docId)
    : db.collection('products').doc();
  ref.set(data)
    .then(function() { callback(null, ref.id); })
    .catch(function(err) { callback(err, null); });
}

// Elimina un producto de Firestore
function fbDeleteProduct(docId, callback) {
  db.collection('products').doc(docId).delete()
    .then(function() { callback(null); })
    .catch(function(err) { callback(err); });
}

// ========== REGISTRO DE ACTIVIDAD ==========

// Guarda una acción del admin en la colección activity_log
function fbLogActivity(action, productName) {
  var user = fbCurrentUser();
  if (!user) return;
  db.collection('activity_log').add({
    user:      user.email,
    action:    action,           // 'agregar', 'editar', 'eliminar'
    product:   productName || '',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(err) { console.error('Log error:', err); });
}

// Lee el registro de actividad (últimas 50 acciones)
function fbLoadActivityLog(callback) {
  db.collection('activity_log')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get()
    .then(function(snap) {
      var list = [];
      snap.forEach(function(doc) { list.push(doc.data()); });
      callback(null, list);
    })
    .catch(function(err) { callback(err, []); });
}

// Storage no disponible en plan Spark.
// Las imágenes se guardan como base64 en Firestore directamente.
