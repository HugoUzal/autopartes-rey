// ========== DATOS Y CONSTANTES ==========

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

var CATS = ['Filtros','Frenos','Suspensión','Motor','Electricidad','Aceites','Encendido','Accesorios'];

var PH = {
  'Filtros':     'https://placehold.co/400x400/e8f4fd/1a3a5c?text=Filtro',
  'Frenos':      'https://placehold.co/400x400/fde8e8/8b1a1a?text=Frenos',
  'Suspensión':  'https://placehold.co/400x400/f0e8fd/4a1a8b?text=Suspensión',
  'Motor':       'https://placehold.co/400x400/e8fde8/1a5c1a?text=Motor',
  'Electricidad':'https://placehold.co/400x400/fffde8/5c5c00?text=Eléctrico',
  'Aceites':     'https://placehold.co/400x400/fde8f8/5c1a4a?text=Aceite',
  'Encendido':   'https://placehold.co/400x400/fdf0e8/5c3a1a?text=Encendido',
  'Accesorios':  'https://placehold.co/400x400/e8f8fd/1a4a5c?text=Accesorio'
};

// Devuelve la imagen de un producto (o placeholder por categoría)
function gImg(p, i) {
  i = i || 0;
  return (p.images && p.images[i])
    ? p.images[i]
    : (PH[p.category] || 'https://placehold.co/400x400/f0f0f0/888?text=Producto');
}

// Formatea número como moneda argentina
function fmt(n) {
  return Number(n).toLocaleString('es-AR');
}
