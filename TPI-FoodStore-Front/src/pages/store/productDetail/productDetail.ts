/* TPI - Programación III - Francisco López */
import { checkAuthUser } from "../../../utils/auth";
import { Rol } from "../../../types/Rol";

// Validamos seguridad
checkAuthUser([Rol.CLIENT]);

const detalleWrapper = document.getElementById("detalle-wrapper") as HTMLElement | null;
const navTotalBadge = document.getElementById("nav-total-badge") as HTMLElement | null;

let productoActual: any = null;

async function inicializarDetalle() {
    try {
    // 1. Extraemos el ID del producto desde los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get("id");

    if (!idProducto) {
        window.location.href = "../home/home.html";
        return;
    }

    // 2. Traemos la lista oficial de productos
    const response = await fetch('/data/productos.json');
    if (!response.ok) throw new Error("No se pudo cargar la información del recurso.");
    
    const productos: any[] = await response.json();
    productoActual = productos.find(p => p.id.toString() === idProducto);

    if (!productoActual) {
        if (detalleWrapper) {
        detalleWrapper.innerHTML = `<h3>El producto seleccionado no existe o fue dado de baja.</h3>`;
        }
        return;
    }

    actualizarBadgeCarrito();
    renderizarDetalle();

    } catch (error) {
    console.error("Error al cargar el detalle:", error);
    }
}

function renderizarDetalle() {
    if (!detalleWrapper || !productoActual) return;

    const estaDisponible = productoActual.disponible && productoActual.stock > 0;

    detalleWrapper.innerHTML = `
    <img src="${productoActual.imagen}" alt="${productoActual.nombre}" class="detalle-imagen">
    <div class="detalle-info">
        <span class="tag-cat">${productoActual.categoria.nombre}</span>
        <h2>${productoActual.nombre}</h2>
        <div class="precio">$${productoActual.precio}</div>
        <p class="descripcion">${productoActual.descripcion}</p>
    
        <div class="stock-info ${!estaDisponible ? 'sin-stock' : ''}">
        ${estaDisponible ? `✓ Stock disponible: ${productoActual.stock} unidades` : '✗ Sin stock momentáneamente'}
        </div>

    ${estaDisponible ? `
        <div class="fila-acciones">
            <label for="input-cantidad" style="font-weight: 600; color: #4b5563;">Cantidad:</label>
            <input type="number" id="input-cantidad" class="selector-cantidad" value="1" min="1" max="${productoActual.stock}">
            <button id="btn-add-to-cart" class="btn-agregar">Agregar al Carrito</button>
        </div>
    ` : ''}
    </div>
    `;

  // Listener para el botón de añadir al carro (Cumpliendo FHU-04)
    const btnAgregar = document.getElementById("btn-add-to-cart");
    const inputCantidad = document.getElementById("input-cantidad") as HTMLInputElement | null;

    btnAgregar?.addEventListener("click", () => {
    if (!inputCantidad) return;
    
    const cantidad = parseInt(inputCantidad.value);

    // Validación estricta contra stock
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresá una cantidad válida.");
        return;
    }

    if (cantidad > productoActual.stock) {
        alert(`Lo sentimos, solo disponemos de ${productoActual.stock} unidades en stock.`);
        return;
    }

    agregarAlCarrito(productoActual, cantidad);
    });
}

function agregarAlCarrito(producto: any, cantidad: number) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Buscamos si el ítem ya estaba agregado previamente
    const index = cart.findIndex((item: any) => item.product.id === producto.id);

    if (index !== -1) {
    const nuevaCantidad = cart[index].cantidad + cantidad;
    // Validamos que el acumulado histórico tampoco salte el stock
    if (nuevaCantidad > producto.stock) {
        alert(`No podés agregar más de ${producto.stock} unidades de este producto en total en tu carrito.`);
        return;
    }
    cart[index].cantidad = nuevaCantidad;
    } else {
    cart.push({ product: producto, cantidad: cantidad });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    actualizarBadgeCarrito();

    alert("¡Producto añadido al carrito con éxito!");
}

function actualizarBadgeCarrito() {
    if (!navTotalBadge) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
    navTotalBadge.textContent = totalItems.toString();
}

inicializarDetalle();