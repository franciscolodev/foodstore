/* TPI - Programación III - Francisco López */
import { checkAuthUser } from "../../../utils/auth";
import { Rol } from "../../../types/Rol";

// 1. Validamos de forma segura que el usuario tenga sesión activa de USUARIO
checkAuthUser([Rol.CLIENT]);

// Nodos del DOM
const gridProductos = document.getElementById("grid-productos-target") as HTMLElement | null;
const ulCategorias = document.getElementById("ul-lista-categorias") as HTMLUListElement | null;
const campoBusqueda = document.getElementById("campo-busqueda") as HTMLInputElement | null;
const selectorOrdenamiento = document.getElementById("selector-ordenamiento") as HTMLSelectElement | null;
const sinResultados = document.getElementById("sin-resultados") as HTMLElement | null;
const navTotalBadge = document.getElementById("nav-total-badge") as HTMLElement | null;

// Estado local de la aplicación
let productosBase: any[] = [];
let categoriasBase: any[] = [];
let categoriaSeleccionadaId: number | null = null; // null significa "Todos"

// Inicialización asincrónica
async function inicializarCatalogo() {
    try {
    // Realizamos los fetches simultáneos a las fuentes oficiales
    const [resProd, resCat] = await Promise.all([
    fetch('/data/productos.json'),
    fetch('/data/categorias.json')
    ]);

    if (!resProd.ok || !resCat.ok) throw new Error("Error cargando los datos del catálogo.");

    productosBase = await resProd.json();
    categoriasBase = await resCat.json();

    actualizarBadgeCarrito();
    renderizarCategorias();
    procesarYRenderizarProductos();
    setearEventos();

    } catch (error) {
    console.error("Error al inicializar la tienda:", error);
    }
}

// Renderiza las categorías dinámicamente en el sidebar
function renderizarCategorias() {
    if (!ulCategorias) return;

  // Limpiamos excepto el botón estático de "Todos los productos"
    const btnTodos = document.getElementById("btn-mostrar-todo");
    ulCategorias.innerHTML = "";
    if (btnTodos) ulCategorias.appendChild(btnTodos);

    categoriasBase.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.nombre;
    li.dataset.id = cat.id.toString();
    if (categoriaSeleccionadaId === cat.id) li.classList.add("active");
    
    li.addEventListener("click", () => {
        document.querySelectorAll("#ul-lista-categorias li").forEach(el => el.classList.remove("active"));
        li.classList.add("active");
        categoriaSeleccionadaId = cat.id;
        procesarYRenderizarProductos();
    });

    ulCategorias.appendChild(li);
    });

  // Evento para el botón "Todos"
    btnTodos?.addEventListener("click", () => {
    document.querySelectorAll("#ul-lista-categorias li").forEach(el => el.classList.remove("active"));
    btnTodos.classList.add("active");
    categoriaSeleccionadaId = null;
    procesarYRenderizarProductos();
    });
}

// Aplica filtros mutables y ordenamiento antes de pintar en pantalla
function procesarYRenderizarProductos() {
    if (!gridProductos) return;
    gridProductos.innerHTML = "";

const busqueda = campoBusqueda ? campoBusqueda.value.trim().toLowerCase() : "";

  // 1. Filtrado combinado (Categoría + Buscador)
let productosFiltrados = productosBase.filter(prod => {
    const coincideCategoria = categoriaSeleccionadaId === null || prod.categoria.id === categoriaSeleccionadaId;
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda) || prod.descripcion.toLowerCase().includes(busqueda);
    return coincideCategoria && coincideBusqueda;
});

  // 2. Ordenamiento Dinámico (Requisito Obligatorio TPI de la filmina)
const metodoOrden = selectorOrdenamiento ? selectorOrdenamiento.value : "default";
    if (metodoOrden === "az") {
    productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
} else if (metodoOrden === "za") {
    productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
} else if (metodoOrden === "precio-menor") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
} else if (metodoOrden === "precio-mayor") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
}

  // Manejo de la vista sin resultados
    if (productosFiltrados.length === 0) {
    if (sinResultados) sinResultados.style.display = "block";
    return;
    }
    if (sinResultados) sinResultados.style.display = "none";

  // 3. Renderizado de las tarjetas de los platos
productosFiltrados.forEach(prod => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-plato";

    // Manejo de disponibilidad física y lógica
    const estaDisponible = prod.disponible && prod.stock > 0;

    tarjeta.innerHTML = `
    <img src="${prod.imagen}" alt="${prod.nombre}">
    <span class="tag-cat">${prod.categoria.nombre}</span>
    <h4>${prod.nombre}</h4>
    <p>${prod.descripcion}</p>
    <div class="fila-compra">
        <span class="precio">$${prod.precio}</span>
        ${
        estaDisponible 
            ? `<button class="btn-comprar" data-id="${prod.id}">Ver detalle</button>` 
            : `<button class="btn-bloqueado" disabled>Sin Stock</button>`
        }
    </div>
    `;

    // FHU-04: El botón ahora redirige a la vista de detalle pasando el ID en la URL
    const btn = tarjeta.querySelector(".btn-comprar");
    btn?.addEventListener("click", () => {
        window.location.href = `../productDetail/productDetail.html?id=${prod.id}`;
    });

    gridProductos.appendChild(tarjeta);
});
}

function actualizarBadgeCarrito() {
    if (!navTotalBadge) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
    navTotalBadge.textContent = totalItems.toString();
}

function setearEventos() {
    campoBusqueda?.addEventListener("input", () => procesarYRenderizarProductos());
    selectorOrdenamiento?.addEventListener("change", () => procesarYRenderizarProductos());
}

// Iniciamos el flujo automático
inicializarCatalogo();