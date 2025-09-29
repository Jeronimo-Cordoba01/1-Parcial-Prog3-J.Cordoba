/*Aclaración desde ahora: no se bien como hacer la documentación (no es mi fuerte) 
usaremos const para los datos que no se van a modificar*/

/*==========================================================
  Ejercicio1: Array con 13 frutas. Con ID, Nombre, Precio y Ruta
==========================================================*/
const productos = [
  { id: 1,  nombre: "Anana", precio: 1200, ruta: "img/frutas/anana.jpg" },
  { id: 2,  nombre: "Mandarina", precio: 2200, ruta: "img/frutas/mandarina.jpg" },
  { id: 3,  nombre: "Banana", precio: 1100, ruta: "img/frutas/banana.jpg" },
  { id: 4,  nombre: "Frutilla", precio: 1800, ruta: "img/frutas/frutilla.jpg" },
  { id: 5,  nombre: "Kiwi", precio: 2500, ruta: "img/frutas/kiwi.jpg" },
  { id: 6, nombre: "Sandia", precio: 3400, ruta: "img/frutas/sandia.jpg" },
  { id: 7, nombre: "Pera", precio: 3200, ruta: "img/frutas/pera.jpg" },
  { id: 8,  nombre: "Manzana", precio: 3000, ruta: "img/frutas/manzana.jpg" },
  { id: 9,  nombre: "Arandano", precio: 900,  ruta: "img/frutas/arandano.jpg" },
  { id: 10, nombre: "Pomelo-Amarillo", precio: 2000, ruta: "img/frutas/pomelo-amarillo.jpg" },
  { id: 11,  nombre: "Naranja", precio: 2600, ruta: "img/frutas/naranja.jpg" },
  { id: 12,  nombre: "Frambuesa", precio: 1150, ruta: "img/frutas/frambuesa.png" },
  { id: 13, nombre: "Pomelo-Rojo", precio: 1900, ruta: "img/frutas/pomelo-rojo.jpg" },
];

/*==========================================================
  Ejercicio2: Datos del alumno. Usamos un dato const poralgoue no varia
==========================================================*/
const alumno = { nombre: "Jerónimo Facundo Lucas", apellido: "Córdoba", dni: "43.083.726" };
const nombreUsuario = document.getElementById("user-name");

function imprimirDatosAlumno() {
  if (nombreUsuario) { nombreUsuario.textContent = alumno.nombre + " " + alumno.apellido; }
  console.log(`Alumno: DNI ${alumno.dni} - ${alumno.nombre} ${alumno.apellido}`);
}

/*==========================================================
  Ejercicio3: Render de productos en grilla 
==========================================================*/
const productList = document.getElementById("product-list");

function renderProducts(items) {
  if (!productList) return;
  productList.innerHTML = "";

  if (!items || items.length === 0) {
    productList.innerHTML = `
      <div class="no-products">
        <img src="img/no-products.webp" alt="No hay productos disponibles">
        <h3>Fruta no Encontrada</h3>
        <p>No se encontró ningún producto</p>
      </div>`;
    return;
  }

  items.forEach((item) => {
    productList.innerHTML += `
      <div class="card-producto">
        <img src="${item.ruta}" alt="imagen de la fruta ${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>$${item.precio}</p>
        <button type="button" onclick="agregarAlCarrito(${item.id})">Agregar al carrito</button>
      </div>`;
  });
}

/*==========================================================
  Ejercicio4: Filtro por input por nombres
==========================================================*/
const inputFiltro = document.getElementById("filter");

function activarFiltroNombre() {
  if (!inputFiltro) return;
  inputFiltro.addEventListener("input", function () {
    const algo = inputFiltro.value.trim().toLowerCase();
    const resultado = productos.filter((p) => p.nombre.toLowerCase().includes(algo));
    renderProducts(resultado);
  });
}

/*==========================================================
  Ejercicio5: Maneja Carrito(agregar, eliminar, mostrar) 
==========================================================*/
const carritoItems1 = document.getElementById("cart-items");
const cart = [];

function agregarAlCarrito(id) {
  const fruta = productos.find((p) => p.id === id);
  if (!fruta) return;

  const existente = cart.find((it) => it.id === id);
  if (existente) {
    existente.cantidad += 1;
    console.log("Cantidad aumentada: " + existente.nombre + " x" + existente.cantidad);
  } else {
    cart.push({ id: fruta.id, nombre: fruta.nombre, precio: fruta.precio, ruta: fruta.ruta, cantidad: 1 });
    console.log("Producto agregado: " + fruta.nombre);
  }
  mostrarCarrito();
  if (typeof saveCart === "function") { saveCart(cart); }
}

function eliminarProducto(index) {
  if (index < 0 || index >= cart.length) return;
  const removed = cart.splice(index, 1)[0];
  if (removed) console.log("Producto eliminado: " + removed.nombre);
  mostrarCarrito();
  if (typeof saveCart === "function") { saveCart(cart); }
}

function mostrarCarrito() {
  if (!carritoItems1) return;
  carritoItems1.innerHTML = "";

  if (cart.length === 0) {
    carritoItems1.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  cart.forEach(function (item, index) {
    const subtotal = (item.precio * item.cantidad).toFixed(2);
    carritoItems1.innerHTML +=
      '<li class="bloalgoue-item">' +
        '<p class="nombre-item">' + item.nombre + " x " + item.cantidad + " — $" + subtotal + "</p>" +
        '<button type="button" class="boton-eliminar" onclick="eliminarProducto(' + index + ')">Eliminar</button>' +
      "</li>";
  });
}

/*==========================================================
  Ejercicio6: Persistencia con localStorage: guarda y carga en el carrito
==========================================================*/
const storage = "cart";

function loadCart() {
  const saved = localStorage.getItem(storage);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function saveCart(arr) {
  localStorage.setItem(storage, JSON.stringify(arr));
}

// Restaurar carrito al iniciar
(function restaurarCarritoDesdeStorage() {
  const guardado = loadCart();
  if (Array.isArray(guardado) && guardado.length > 0) {
    cart.splice(0, cart.length, ...guardado);
  }
  mostrarCarrito();
})();

/*==========================================================
  Ejercicio7: Contador, header y total
==========================================================*/
const cartCounter = document.getElementById("cart-counter");
const cartLabel   = document.getElementById("cart-label");
const cartTotalEl = document.getElementById("cart-total");

function actualizarResumenCarrito() {
  if (!cartCounter || !cartLabel || !cartTotalEl) return;

  let unidades = 0;
  let total = 0;

  cart.forEach(function (item) {
    unidades += item.cantidad;
    total += item.precio * item.cantidad;
  });

  cartCounter.textContent = unidades;
  cartLabel.textContent   = unidades + " " + (unidades === 1 ? "producto" : "productos");
  cartTotalEl.textContent = total.toFixed(2);
}

// Parchar mostrarCarrito para algoue actualice el resumen
(function parcheResumenEnMostrarCarrito() {
  const _original = mostrarCarrito;
  if (typeof _original === "function") {
    mostrarCarrito = function () {
      _original();
      actualizarResumenCarrito();
    };
  }
})();

/*==========================================================
  Ejercicio8: Botones para ordenar
==========================================================*/
const ordenarNombre  = document.getElementById("sort-name");
const ordenarPrecio = document.getElementById("sort-price");

function activarOrdenamientos() {
  if (ordenarNombre) {
    ordenarNombre.addEventListener("click", function () {
      const porNombre = productos.slice().sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre);
      });
      renderProducts(porNombre);
    });
  }
  if (ordenarPrecio) {
    ordenarPrecio.addEventListener("click", function () {
      const porPrecio = productos.slice().sort(function (a, b) {
        return a.precio - b.precio;
      });
      renderProducts(porPrecio);
    });
  }
}

/*==========================================================
  Ejercicio9: Vaciar carrito
==========================================================*/
const carritoVacio = document.getElementById("empty-cart");

function activarVaciadoCarrito() {
  if (!carritoVacio) return;
  carritoVacio.addEventListener("click", function () {
    if (cart.length === 0) return;
    cart.length = 0;
    console.log("Carrito vaciado");
    saveCart(cart);
    mostrarCarrito();
  });
}
function init() {
  imprimirDatosAlumno();
  renderProducts(productos);
  activarFiltroNombre();
  activarOrdenamientos();
  activarVaciadoCarrito();
  actualizarResumenCarrito();
};

init();