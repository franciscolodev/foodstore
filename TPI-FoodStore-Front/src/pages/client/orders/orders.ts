/* TPI - Programación III - Francisco López */
import { checkAuthUser } from "../../../utils/auth";
import { Rol } from "../../../types/Rol";
import { getUSer } from "../../../utils/localStorage";

checkAuthUser([Rol.CLIENT]);

const contenedorTarget = document.getElementById("contenedor-pedidos-target") as HTMLElement | null;
const historialVacio = document.getElementById("historial-vacio") as HTMLElement | null;

// Nodos del modal
const modalOverlay = document.getElementById("modal-detalle-pedido") as HTMLElement | null;
const btnCerrarModal = document.getElementById("btn-cerrar-modal") as HTMLButtonElement | null;
const modalFechaPago = document.getElementById("modal-fecha-pago") as HTMLElement | null;
const modalItemsTarget = document.getElementById("modal-items-target") as HTMLElement | null;
const modalTotalTarget = document.getElementById("modal-total-target") as HTMLElement | null;

let pedidosTotales: any[] = [];

async function inicializarHistorial() {
    try {
    const usuarioActivo = JSON.parse(getUSer() || "{}");
    if (!usuarioActivo || !usuarioActivo.email) return;

    // 1. Cargamos el archivo histórico fijo provisto por los profesores
    const response = await fetch('/data/pedidos.json');
    let pedidosJson: any[] = [];
    if (response.ok) {
        pedidosJson = await response.json();
    }

    // 2. Cargamos los pedidos simulados generados en caliente desde el carrito
    const pedidosNuevos = JSON.parse(localStorage.getItem("pedidosSimulados") || "[]");

    // Combinamos ambas fuentes
    const combinados = [...pedidosJson, ...pedidosNuevos];

    // 3. Filtramos estrictamente para que el usuario solo vea sus propios pedidos (Regla TPI)
    pedidosTotales = combinados.filter(
        p => p.usuarioDto && p.usuarioDto.mail.toLowerCase() === usuarioActivo.email.toLowerCase()
    );

    renderizarHistorial();
    configurarCierreModal();

    } catch (error) {
    console.error("Error al cargar el historial de pedidos:", error);
    }
}

function renderizarHistorial() {
    if (!contenedorTarget) return;
    contenedorTarget.innerHTML = "";

    if (pedidosTotales.length === 0) {
        if (historialVacio) historialVacio.style.display = "block";
        return;
    }
    if (historialVacio) historialVacio.style.display = "none";

pedidosTotales.forEach(pedido => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-pedido";

    // Tomamos la cantidad total de artículos comprados
    const cantItems = pedido.detalles.reduce((acc: number, d: any) => acc + d.cantidad, 0);

    tarjeta.innerHTML = `
    <div class="info-pedido">
        <h4>Orden #${pedido.id.toString().substring(0, 6)}</h4>
        <p>Fecha: ${pedido.fecha} • ${cantItems} productos</p>
        <p style="font-weight: 600; color: #111827; margin-top: 4px;">Total Facturado: $${pedido.total}</p>
    </div>
    <div style="display: flex; align-items: center; gap: 15px;">
        <span class="badge-estado badge-${pedido.estado}">${pedido.estado.replace('_', ' ')}</span>
        <button class="btn-detalle" data-id="${pedido.id}">Ver detalles</button>
    </div>
    `;

    tarjeta.querySelector(".btn-detalle")?.addEventListener("click", () => {
        abrirModalDetalle(pedido);
    });

    contenedorTarget.appendChild(tarjeta);
    });
}

function abrirModalDetalle(pedido: any) {
    if (!modalOverlay || !modalFechaPago || !modalItemsTarget || !modalTotalTarget) return;

    modalFechaPago.textContent = `Realizado el: ${pedido.fecha} • Forma de pago: ${pedido.formaPago}`;
    modalItemsTarget.innerHTML = "";

pedido.detalles.forEach((det: any) => {
    const div = document.createElement("div");
    div.className = "item-modal";
    div.innerHTML = `
    <div>
        <span style="font-weight: bold; color: #1b382b;">${det.cantidad}x</span> 
        ${det.producto.nombre}
    </div>
    <div style="font-weight: 600; color: #111827;">$${det.subtotal}</div>
    `;
    modalItemsTarget.appendChild(div);
    });

    modalTotalTarget.textContent = `$${pedido.total}`;
    modalOverlay.style.display = "flex";
}

function configurarCierreModal() {
    btnCerrarModal?.addEventListener("click", () => {
    if (modalOverlay) modalOverlay.style.display = "none";
    });

  // Cerrar haciendo clic afuera de la caja blanca
    modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
    }
    });
}

inicializarHistorial();