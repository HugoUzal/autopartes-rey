// ========== CHATBOT ALEJANDRO ==========

var BOT = [
  { t: ['envío','envio','despacho','manda','llega','entrega'],
    r: '🚚 ¡Sí! Tenemos <strong>envío gratis</strong> a todo el país. Los pedidos llegan en 3-5 días hábiles. Zonas del interior pueden demorar hasta 7 días.' },
  { t: ['tarjeta','pago','cuota','mercadopago','mp','crédito','debito','efectivo'],
    r: '💳 Aceptamos <strong>Visa, Mastercard, Amex</strong> y <strong>MercadoPago</strong>. ¡Hasta <strong>12 cuotas sin interés</strong> en todos los productos!' },
  { t: ['garantía','garantia','devoluci','reclam'],
    r: '🛡️ Todos nuestros productos tienen <strong>garantía del fabricante</strong> y <strong>30 días de devolución sin costo</strong>. Tu compra está 100% protegida.' },
  { t: ['oferta','descuento','promo','precio','rebaj','barato'],
    r: '🏷️ ¡Tenemos ofertas todos los días! Hoy hay hasta <strong>30% OFF en frenos y aceites</strong>. Mirá los chips de categorías en el inicio.' },
  { t: ['horario','aten','abre','cierra','func','cuando'],
    r: '🕐 Atendemos <strong>lunes a viernes de 8:00 a 18:00</strong> y sábados de 9:00 a 13:00. También por WhatsApp las 24hs.' },
  { t: ['filtro'],
    r: '🌀 Tenemos <strong>filtros de aceite, aire y combustible</strong> de Fram y K&N. ¡Buscalos en la sección Filtros!' },
  { t: ['freno','disco','pastilla'],
    r: '🛑 Tenemos <strong>pastillas y discos de freno</strong> Brembo y Zimmermann. Para el freno correcto decime el modelo y año de tu auto.' },
  { t: ['aceite','lubricante'],
    r: '🛢️ Tenemos <strong>Motul, Fric-Rot, Castrol</strong> en todas las viscosidades. Sintéticos y semi-sintéticos.' },
  { t: ['bater','arranque'],
    r: '⚡ Baterías <strong>Bosch y Moura</strong> para todos los vehículos. ¡Con instalación gratis en sucursal!' },
  { t: ['hola','buenas','buen','ola','hey','saludos'],
    r: '👋 ¡Hola! Soy <strong>Alejandro</strong>, tu mecánico virtual de Auto Partes Rey. ¿En qué te ayudo hoy?' },
  { t: ['gracias','graciosa','genial','excelente','perfecto','ok'],
    r: '😊 ¡Con mucho gusto! Si necesitás algo más, acá estoy. ¡Que andes bien! 🔧' },
  { t: ['whatsapp','telefono','contacto','llamar','mail','email'],
    r: '📱 Escribinos por <strong>WhatsApp al +54 9 11 4567-8901</strong> o a ventas@autopartesrey.com' },
  { t: ['compatib','sirve','anda','modelo','auto','marca','año','vehiculo'],
    r: '🔍 Para verificar compatibilidad decime <strong>marca, modelo y año</strong> de tu vehículo y te indico exactamente qué necesitás.' },
  { t: ['amortiguador','suspension','resorte'],
    r: '🔩 Tenemos <strong>amortiguadores Monroe</strong> para todas las marcas. Delanteros y traseros. ¡Instalación directa OEM!' },
  { t: ['bujia','encendido','chispa'],
    r: '🔥 Bujías <strong>NGK y Bosch</strong> para todos los motores. Juegos de 4 con garantía incluida.' },
];

var botOpen = false;

function initBot() {
  addBotMsg('👋 ¡Hola! Soy <strong>Alejandro</strong>, mecánico virtual de <strong>Auto Partes Rey</strong>. ¿En qué te puedo ayudar?', true);
}

function toggleBot() {
  botOpen = !botOpen;
  document.getElementById('bot-bubble').classList.toggle('hidden', !botOpen);
  if (botOpen && !document.getElementById('bot-msgs').children.length) initBot();
  if (botOpen) setTimeout(function() { document.getElementById('bot-input').focus(); }, 100);
}

function addBotMsg(text, isBot) {
  var m = document.getElementById('bot-msgs');
  var d = document.createElement('div');
  d.className = 'msg ' + (isBot ? 'bot' : 'user');
  d.innerHTML = text;
  m.appendChild(d);
  m.scrollTop = m.scrollHeight;
}

function botSend() {
  var inp  = document.getElementById('bot-input');
  var text = inp.value.trim();
  if (!text) return;
  addBotMsg(text, false);
  inp.value = '';
  setTimeout(function() {
    var low   = text.toLowerCase();
    var match = null;
    for (var i = 0; i < BOT.length; i++) {
      if (BOT[i].t.some(function(t) { return low.indexOf(t) >= 0; })) {
        match = BOT[i];
        break;
      }
    }
    addBotMsg(
      match ? match.r : '🔧 Para más info escribinos por <strong>WhatsApp al +54 9 11 4567-8901</strong>. ¡Te atendemos al toque!',
      true
    );
  }, 600);
}

function botQ(t) {
  document.getElementById('bot-input').value = t;
  botSend();
}
