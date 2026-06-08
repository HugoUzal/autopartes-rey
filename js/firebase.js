// ========== FIREBASE ==========
// Requiere los scripts compat cargados en index.html:
//   firebase-app-compat.js
//   firebase-firestore-compat.js
//   firebase-storage-compat.js

var db;

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
  db = firebase.firestore();
  console.log('🔥 Firebase iniciado');
}

// Lee todos los productos de Firestore (ordenados por id numérico)
function fbLoadProducts(callback) {
  db.collection('products').orderBy('id').get()
    .then(function(snap) {
      var list = [];
      snap.forEach(function(doc) {
        var d = doc.data();
        d._docId = doc.id;   // guardamos el ID del documento para editar/borrar
        list.push(d);
      });
      callback(null, list);
    })
    .catch(function(err) { callback(err, []); });
}

// Crea o reemplaza un producto en Firestore
// docId: string si es edición, null si es nuevo
function fbSaveProduct(data, docId, callback) {
  var ref = docId
    ? db.collection('products').doc(docId)
    : db.collection('products').doc();          // auto-ID para nuevos
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

// Storage no disponible en plan Spark.
// Las imágenes se guardan como base64 en Firestore directamente.
