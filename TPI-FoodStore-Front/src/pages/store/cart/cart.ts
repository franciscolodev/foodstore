/* TPI - Programación III - Francisco López */
import { checkAuthUser } from "../../../utils/auth";
import { Rol } from "../../../types/Rol";
import { getUSer } from "../../../utils/localStorage";

checkAuthUser([Rol.CLIENT]);

const tbodyItems = document.getElementById("tbody-items-target") as HTMLTableSectionElement | null;
const carritoVacio = document.getElementById("carrito-vacio") as HTMLElement | null;
const tablaWrapper = document.getElementById("tabla-wrapper") as HTMLElement | null;
const resumenWrapper = document.getElementById("resumen-wrapper") as HTMLElement | null;
const navTotalBadge = document.getElementById("nav-total-badge") as HTMLElement | null;

const txtSubtotal = document.getElementById("txt-subtotal") as HTMLElement | null;
const txtTotal = document.getElementById("txt-total") as HTMLElement | null;

const formCheckout = document.getElementById("form-checkout") as HTMLFormElement | null;
const inputTelefono = document.getElementById("checkout-telefono") as HTMLInputElement | null;
const selectPago = document.getElementById("checkout-pago") as HTMLSelectElement | null;
const btnVaciar = document.getElementById("btn-vaciar-cart") as HTMLButtonElement | null;

let cart: any[] = [];

function cargarCarrito() {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    actualizarVista();
}

function actualizarVista() {
    actualizarBadge();

    if (cart.length === 0) {
    if (carritoVacio) carritoVacio.style.display = "block";
    if (tablaWrapper) tablaWrapper.style.display = "none";
    if (resumenWrapper) resumenWrapper.style.display = "none";
        return;
    }

    if (carritoVacio) carritoVacio.style.display = "none";
    if (tablaWrapper) tablaWrapper.style.display = "block";
    if (resumenWrapper) resumenWrapper.style.display = "block";

    renderizarItems();
    calcularTotales();
}

function renderizarItems() {
if (!tbodyItems) return;
tbodyItems.innerHTML = "";

cart.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>
        <div class="item-info">
        <img src="${item.product.imagen}" alt="${item.product.nombre}">
        <div>
            <h5>${item.product.nombre}</h5>
            <span style="font-size: 0.75rem; color: #9ca3af;">Cat: ${item.product.categoria.nombre}</span>
        </div>
        </div>
    </td>
    <td style="font-weight: 600;">$${item.product.precio}</td>
    <td>
        <div class="control-cantidad">
        <button class="btn-cant btn-restar" data-index="${index}">-</button>
        <span style="font-weight: bold; width: 20px; text-align: center;">${item.cantidad}</span>
        <button class="btn-cant btn-sumar" data-index="${index}">+</button>
        </div>
    </td>
      <td style="font-weight: 700; color: #111827;">$${item.product.precio * item.cantidad}</td>
    <td>
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    </td>
    `;

    // Listeners interactivos (+ / - / eliminar)
    tr.querySelector(".btn-restar")?.addEventListener("click", () => alterarCantidad(index, -1));
    tr.querySelector(".btn-sumar")?.addEventListener("click", () => alterarCantidad(index, 1));
    tr.querySelector(".btn-eliminar")?.addEventListener("click", () => eliminarItem(index));

    tbodyItems.appendChild(tr);
    });
}

function alterarCantidad(index: number, cambio: number) {
    const nuevoValor = cart[index].cantidad + cambio;

    if (nuevoValor <= 0) {
    eliminarItem(index);
    return;
    }

  // Validación dura contra el stock del JSON oficial
    if (nuevoValor > cart[index].product.stock) {
    alert(`No hay más stock físico. Límite máximo: ${cart[index].product.stock} unidades.`);
    return;
    }

    cart[index].cantidad = nuevoValor;
    guardarYRefrescar();
}

function eliminarItem(index: number) {
    cart.splice(index, 1);
    guardarYRefrescar();
}

function calcularTotales() {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.precio * item.cantidad), 0);
    if (txtSubtotal) txtSubtotal.textContent = `$${subtotal}`;
    if (txtTotal) txtTotal.textContent = `$${subtotal}`;
}

function guardarYRefrescar() {
    localStorage.setItem("cart", JSON.stringify(cart));
    actualizarVista();
}

function actualizarBadge() {
    if (!navTotalBadge) return;
    const total = cart.reduce((acc, item) => acc + item.cantidad, 0);
    navTotalBadge.textContent = total.toString();
}

// FHU-05: Procesamiento completo del Checkout y envío simulado
formCheckout?.addEventListener("submit", (e: Event) => {
e.preventDefault();

    if (!inputTelefono || !selectPago) return;

const telefono = inputTelefono.value.trim();
const formaPago = selectPago.value;
const usuarioSesion = JSON.parse(getUSer() || "{}");

    if (!telefono || !formaPago) {
    alert("Por favor completa los campos obligatorios del checkout.");
    return;
    }

  // Estructuramos el nuevo pedido simulado siguiendo el formato del TPI
const nuevoPedido = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    estado: "PENDIENTE",
    total: cart.reduce((acc, item) => acc + (item.product.precio * item.cantidad), 0),
    formaPago: formaPago,
    detalles: cart.map(item => ({
        cantidad: item.cantidad,
        subtotal: item.product.precio * item.cantidad,
        producto: item.product
    })),
    usuarioDto: {
        id: usuarioSesion.id,
        nombre: usuarioSesion.nombre,
        apellido: usuarioSesion.apellido,
        mail: usuarioSesion.email,
        rol: usuarioSesion.rol
    }
    };

  // Guardamos el pedido de forma simulada en una lista local
    const pedidosHistoricos = JSON.parse(localStorage.getItem("pedidosSimulados") || "[]");
    pedidosHistoricos.push(nuevoPedido);
    localStorage.setItem("pedidosSimulados", JSON.stringify(pedidosHistoricos));

  // Vaciamos el carrito de compras
    localStorage.removeItem("cart");

    alert("¡Pedido realizado con éxito! Redirigiendo a tu historial...");

  // FHU-06: Redirigimos a la vista de Mis Pedidos
    window.location.href = "../../client/orders/orders.html";
});

btnVaciar?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que querés vaciar todo el carrito?")) {
    cart = [];
    guardarYRefrescar();
    }
});

// Iniciamos carga de datos
cargarCarrito();