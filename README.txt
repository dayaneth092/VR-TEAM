FLUJO CONVECTIVO DE MASA — MODELO 3D / AR
==========================================

Que hay en esta carpeta
------------------------
index.html   -> pagina de inicio, elige AR o vista de escritorio
ar.html      -> realidad aumentada con marcador Hiro (usa la camara)
viewer.html  -> vista 3D en pantalla, sin marcador ni camara (rotar con mouse/dedo)
style.css    -> estilos compartidos
app.js       -> logica compartida: matematica del vector y actualizacion en vivo

Por que necesitas subirlo a internet (no basta con abrir el archivo)
----------------------------------------------------------------------
Los navegadores solo permiten usar la camara (necesaria para ar.html)
en paginas servidas por HTTPS, o en localhost durante pruebas.
Si simplemente abres ar.html haciendo doble clic (file://...), la camara
NO va a funcionar en el celular. viewer.html si funciona abriendo el
archivo directamente, porque no usa la camara.

Como publicarlo gratis (recomendado: GitHub Pages)
------------------------------------------------------
1. Crea una cuenta en github.com si no tienes.
2. Crea un repositorio nuevo (por ejemplo "transporte-ar").
3. Sube estos 6 archivos (index.html, ar.html, viewer.html, style.css, app.js, README.txt)
   a la raiz del repositorio.
4. Ve a Settings -> Pages -> Source -> selecciona la rama "main" y guarda.
5. En un minuto GitHub te da una URL tipo:
   https://tu-usuario.github.io/transporte-ar/
6. Esa URL SI es HTTPS, asi que ar.html va a poder usar la camara
   en cualquier celular.

Alternativas igual de faciles: Netlify Drop (netlify.com/drop, arrastras
la carpeta) o Vercel. Cualquiera de las tres sirve.

El marcador Hiro
-----------------
Es la imagen blanca y negra estandar de AR.js (una especie de codigo QR
cuadrado). Se descarga desde el enlace que aparece en index.html, o
directamente aqui:
https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg

Imprimelo en una hoja (que ocupe buena parte de la hoja, no muy chico)
y ponlo sobre una superficie plana con buena luz. Entre mas grande el
marcador, desde mas lejos lo reconoce la camara.

Que representa el modelo
--------------------------
El punto P es el origen del elemento de volumen. Las tres caras
semitransparentes (una por color) son los elementos de area dS
perpendiculares a los ejes x, y, z de la Fig. 17.7-1 de Bird. La flecha
naranja es el vector velocidad v, controlable con los 3 sliders (vx, vy, vz).
El cuarto slider es rho_A (o podria interpretarse como omega_A * rho).
El panel inferior calcula en vivo j_A^(c) = rho_A (vx*delta_x + vy*delta_y + vz*delta_z),
mostrando cada componente y la magnitud total.

Proximos pasos sugeridos (para seguir construyendo con Claude)
------------------------------------------------------------------
- Resaltar automaticamente la cara "dominante" segun cual componente de v
  es mayor en valor absoluto.
- Agregar una segunda escena para el flujo MOLAR (N_A) si el profesor
  tambien quiere cubrir esa seccion del capitulo.
- Agregar audio/texto explicativo que se dispare al tocar cada cara.
- Version para varios marcadores (uno por cada figura del capitulo).
