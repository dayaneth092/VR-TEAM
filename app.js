/*
  app.js
  Logica compartida entre ar.html y viewer.html.
  Ambos archivos definen la MISMA estructura de entidades A-Frame
  (mismos id / class), asi que esta unica logica sirve para las dos vistas.

  Que hace:
   1) Lee los 4 sliders (vx, vy, vz, rho_A)
   2) Reorienta y reescala la flecha del vector v
   3) Dibuja las 3 lineas de proyeccion (v -> cada cara)
   4) Actualiza el panel de lectura numerica (j_A^(c))
*/

function actualizarEscena(vx, vy, vz, rho) {
  const dir = new THREE.Vector3(vx, vy, vz);
  const mag = dir.length();

  // --- 1) Orientar el grupo de la flecha hacia (vx,vy,vz) ---
  const grupoVector = document.querySelector('#vector-v');
  if (grupoVector && grupoVector.object3D) {
    if (mag > 0.0005) {
      const ejeY = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(ejeY, dir.clone().normalize());
      grupoVector.object3D.quaternion.copy(quat);
      grupoVector.object3D.visible = true;
    } else {
      grupoVector.object3D.visible = false;
    }
  }

  // --- 2) Escalar el asta y la punta segun la magnitud ---
  const largoPunta = 0.09;
  const largoAsta = Math.max(mag - largoPunta, 0.001);
  const asta = document.querySelector('.v-shaft');
  const punta = document.querySelector('.v-head');
  if (asta) {
    asta.setAttribute('height', largoAsta);
    asta.setAttribute('position', `0 ${largoAsta / 2} 0`);
  }
  if (punta) {
    punta.setAttribute('position', `0 ${largoAsta + largoPunta / 2} 0`);
  }

  // --- 3) Lineas de proyeccion: de la punta de v a su sombra sobre cada cara ---
  dibujarLinea('#proj-x', vx, vy, vz, 0, vy, vz, '#2dd4bf');
  dibujarLinea('#proj-y', vx, vy, vz, vx, 0, vz, '#e2794f');
  dibujarLinea('#proj-z', vx, vy, vz, vx, vy, 0, '#8b7fe8');

  // --- 4) Panel numerico ---
  fijarTexto('#val-vx', vx.toFixed(2));
  fijarTexto('#val-vy', vy.toFixed(2));
  fijarTexto('#val-vz', vz.toFixed(2));
  fijarTexto('#val-rho', rho.toFixed(2));
  fijarTexto('#val-jx', (rho * vx).toFixed(2));
  fijarTexto('#val-jy', (rho * vy).toFixed(2));
  fijarTexto('#val-jz', (rho * vz).toFixed(2));
  fijarTexto('#val-jmag', (rho * mag).toFixed(2));
}

function dibujarLinea(selector, x1, y1, z1, x2, y2, z2, color) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.setAttribute('line', `start:${x1} ${y1} ${z1}; end:${x2} ${y2} ${z2}; color:${color}; opacity:0.55`);
}

function fijarTexto(selector, texto) {
  const el = document.querySelector(selector);
  if (el) el.textContent = texto;
}

function leerSlidersYActualizar() {
  const vx = parseFloat(document.querySelector('#slider-vx').value);
  const vy = parseFloat(document.querySelector('#slider-vy').value);
  const vz = parseFloat(document.querySelector('#slider-vz').value);
  const rho = parseFloat(document.querySelector('#slider-rho').value);
  actualizarEscena(vx, vy, vz, rho);
}

function iniciarControles() {
  ['slider-vx', 'slider-vy', 'slider-vz', 'slider-rho'].forEach((id) => {
    const el = document.querySelector('#' + id);
    if (el) el.addEventListener('input', leerSlidersYActualizar);
  });
  leerSlidersYActualizar();
}

/*
  Control de camara "orbita" hecho a mano (sin depender de componentes externos
  poco confiables en celular). Solo se activa si existe #camara-libre, es decir,
  solo en viewer.html (en ar.html la camara la maneja AR.js sobre el marcador).
*/
function iniciarOrbita() {
  const camEntity = document.querySelector('#camara-libre');
  if (!camEntity) return;

  const objetivo = new THREE.Vector3(0, 0, 0);
  let radio = 3.4;               // distancia inicial: mas lejos = vista mas amplia
  let theta = 0.8;               // angulo horizontal (radianes)
  let phi = 1.1;                 // angulo vertical (radianes), 0=arriba, PI=abajo
  const radioMin = 1.0;
  const radioMax = 6.0;

  function actualizarCamara() {
    const x = objetivo.x + radio * Math.sin(phi) * Math.sin(theta);
    const y = objetivo.y + radio * Math.cos(phi);
    const z = objetivo.z + radio * Math.sin(phi) * Math.cos(theta);
    camEntity.object3D.position.set(x, y, z);
    camEntity.object3D.lookAt(objetivo);
  }

  let arrastrando = false;
  let ultimoX = 0;
  let ultimoY = 0;
  let distanciaPellizcoPrevia = null;

  function inicioArrastre(x, y) {
    arrastrando = true;
    ultimoX = x;
    ultimoY = y;
  }
  function moverArrastre(x, y) {
    if (!arrastrando) return;
    const dx = x - ultimoX;
    const dy = y - ultimoY;
    theta -= dx * 0.006;
    phi -= dy * 0.006;
    phi = Math.max(0.25, Math.min(Math.PI - 0.25, phi));
    ultimoX = x;
    ultimoY = y;
    actualizarCamara();
  }
  function finArrastre() {
    arrastrando = false;
    distanciaPellizcoPrevia = null;
  }
  function distanciaEntreToques(toques) {
    const dx = toques[0].clientX - toques[1].clientX;
    const dy = toques[0].clientY - toques[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function aplicarZoom(factor) {
    radio = Math.max(radioMin, Math.min(radioMax, radio * factor));
    actualizarCamara();
  }

  const lienzo = document.querySelector('a-scene');

  lienzo.addEventListener('mousedown', (e) => inicioArrastre(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => moverArrastre(e.clientX, e.clientY));
  window.addEventListener('mouseup', finArrastre);
  lienzo.addEventListener('wheel', (e) => {
    e.preventDefault();
    aplicarZoom(1 + e.deltaY * 0.0015);
  }, { passive: false });

  lienzo.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      inicioArrastre(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      arrastrando = false;
      distanciaPellizcoPrevia = distanciaEntreToques(e.touches);
    }
  }, { passive: true });

  lienzo.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      moverArrastre(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const actual = distanciaEntreToques(e.touches);
      if (distanciaPellizcoPrevia) {
        aplicarZoom(distanciaPellizcoPrevia / actual);
      }
      distanciaPellizcoPrevia = actual;
    }
  }, { passive: true });

  lienzo.addEventListener('touchend', finArrastre);

  actualizarCamara();
}

document.addEventListener('DOMContentLoaded', () => {
  const escena = document.querySelector('a-scene');
  const overlay = document.querySelector('.loading');
  if (!escena) return;
  const ocultarCarga = () => { if (overlay) overlay.style.display = 'none'; };
  const iniciarTodo = () => {
    iniciarControles();
    iniciarOrbita();
    ocultarCarga();
  };
  if (escena.hasLoaded) {
    iniciarTodo();
  } else {
    escena.addEventListener('loaded', iniciarTodo);
  }
});
