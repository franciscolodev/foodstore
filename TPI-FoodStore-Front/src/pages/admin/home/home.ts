/* TPI - Programación III - Francisco López */
import { checkAuthUser, logout } from "../../../utils/auth";
import { Rol } from "../../../types/Rol";

// 1. Forzar ingreso estricto con rol ADMIN
checkAuthUser([Rol.ADMIN]);

// Estado mutable en memoria
let categorias: any[] = [];
let productos: any[] = [];
let usuarios: any[] = [];
let pedidos: any[] = [];

// Elementos del DOM del Dashboard
const statCategorias = document.getElementById("stat-categorias");
const statProductos = document.getElementById("stat-productos");
const statUsuarios = document.getElementById("stat-usuarios");
const statFacturacion = document.getElementById("stat-facturacion");

// Modales
const modalOverlay = document.getElementById("modal-admin") as HTMLElement;
const modalBoxContent = document.getElementById("modal-box-content") as HTMLElement;

async function inicializarAdmin() {
  try {
    const [resCat, resProd, resUser, resPed] = await Promise.all([
      fetch('/data/categorias.json').then(r => r.json()),
      fetch('/data/productos.json').then(r => r.json()),
      fetch('/data/usuarios.json').then(r => r.json()),
      fetch('/data/pedidos.json').then(r => r.json())
    ]);

    categorias = resCat;
    productos = resProd;
    usuarios = resUser;
    
    // Unimos los pedidos del JSON base con los nuevos que se hayan creado en la simulación del carro
    const nuevosPedidos = JSON.parse(localStorage.getItem("pedidosSimulados") || "[]");
    pedidos = [...resPed, ...nuevosPedidos];

    calcularEstadisticas();
    configurarNavegacion();
    renderizarCategorias();
    renderizarProductos();
    renderizarPedidos();
    configurarEventosGlobales();

  } catch (error) {
    console.error("Error inicializando el panel de administración:", error);
  }
}

function calcularEstadisticas() {
  if (statCategorias) statCategorias.textContent = categorias.length.toString();
  if (statProductos) statProductos.textContent = productos.length.toString();
  if (statUsuarios) statUsuarios.textContent = usuarios.length.toString();
  
  const totalFacturado = pedidos
    .filter(p => p.estado !== "CANCELADO")
    .reduce((acc, p) => acc + p.total, 0);
  if (statFacturacion) statFacturacion.textContent = `$${totalFacturado}`;
}

function configurarNavegacion() {
  document.querySelectorAll(".sidebar-admin li").forEach(li => {
    li.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-admin li").forEach(el => el.classList.remove("active"));
      document.querySelectorAll(".seccion-panel").forEach(panel => panel.classList.remove("active"));
      
      li.classList.add("active");
      const target = li.getAttribute("data-target");
      if (target) document.getElementById(target)?.classList.add("active");
    });
  });
}

/* ==========================================================================
   MÓDULO CATEGORÍAS (FHU-08)
   ========================================================================== */
function renderizarCategorias() {
  const tbody = document.getElementById("tbody-categorias");
  if (!tbody) return;
  tbody.innerHTML = "";

  categorias.forEach(cat => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${cat.id}</strong></td>
      <td>${cat.nombre}</td>
      <td>${cat.descripcion}</td>
      <td>
        <button class="btn-tabla btn-editar" data-id="${cat.id}">Editar</button>
        <button class="btn-tabla btn-eliminar" data-id="${cat.id}">Eliminar</button>
      </td>
    `;
    
    tr.querySelector(".btn-editar")?.addEventListener("click", () => abrirModalCategoria(cat));
    tr.querySelector(".btn-eliminar")?.addEventListener("click", () => {
      if(confirm(`¿Estás seguro de eliminar la categoría: ${cat.nombre}?`)) {
        categorias = categorias.filter(c => c.id !== cat.id);
        renderizarCategorias();
        calcularEstadisticas();
      }
    });
    tbody.appendChild(tr);
  });
}

function abrirModalCategoria(cat: any = null) {
  modalBoxContent.innerHTML = `
    <h3>${cat ? 'Modificar Categoría' : 'Nueva Categoría'}</h3>
    <label>Nombre:</label>
    <input type="text" id="form-cat-nombre" class="form-control" value="${cat ? cat.nombre : ''}">
    <label>Descripción:</label>
    <input type="text" id="form-cat-desc" class="form-control" value="${cat ? cat.descripcion : ''}">
    <div class="modal-acciones">
      <button class="btn-tabla" id="btn-cerrar-modal">Cancelar</button>
      <button class="btn-crear" id="btn-guardar-cat">Guardar</button>
    </div>
  `;
  
  modalOverlay.style.display = "flex";
  
  document.getElementById("btn-cerrar-modal")?.addEventListener("click", () => modalOverlay.style.display = "none");
  document.getElementById("btn-guardar-cat")?.addEventListener("click", () => {
    const nom = (document.getElementById("form-cat-nombre") as HTMLInputElement).value.trim();
    const des = (document.getElementById("form-cat-desc") as HTMLInputElement).value.trim();
    
    if(!nom || !des) { alert("Completá todos los campos."); return; }

    if(cat) {
      cat.nombre = nom; cat.descripcion = des;
    } else {
      categorias.push({ id: categorias.length + 1, nombre: nom, descripcion: des });
    }
    modalOverlay.style.display = "none";
    renderizarCategorias();
    calcularEstadisticas();
  });
}

/* ==========================================================================
   MÓDULO PRODUCTOS (FHU-09)
   ========================================================================== */
function renderizarProductos() {
  const tbody = document.getElementById("tbody-productos");
  if (!tbody) return;
  tbody.innerHTML = "";

  productos.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${prod.id}</strong></td>
      <td>${prod.nombre}</td>
      <td><strong>$${prod.precio}</strong></td>
      <td>${prod.stock} u.</td>
      <td>${prod.categoria.nombre}</td>
      <td><span style="color: ${prod.disponible && prod.stock > 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">
        ${prod.disponible && prod.stock > 0 ? 'Disponible' : 'Sin Stock / Oculto'}
      </span></td>
      <td>
        <button class="btn-tabla btn-editar" data-id="${prod.id}">Editar</button>
        <button class="btn-tabla btn-eliminar" data-id="${prod.id}">Eliminar</button>
      </td>
    `;

    tr.querySelector(".btn-editar")?.addEventListener("click", () => abrirModalProducto(prod));
    tr.querySelector(".btn-eliminar")?.addEventListener("click", () => {
      if(confirm(`¿Deseás realizar la baja de: ${prod.nombre}?`)) {
        productos = productos.filter(p => p.id !== prod.id);
        renderizarProductos();
        calcularEstadisticas();
      }
    });
    tbody.appendChild(tr);
  });
}

function abrirModalProducto(prod: any = null) {
  let selectOptions = "";
  categorias.forEach(c => {
    selectOptions += `<option value="${c.id}" ${prod && prod.categoria.id === c.id ? 'selected' : ''}>${c.nombre}</option>`;
  });

  modalBoxContent.innerHTML = `
    <h3>${prod ? 'Modificar Producto' : 'Nuevo Producto'}</h3>
    <label>Nombre del Plato:</label>
    <input type="text" id="form-prod-nombre" class="form-control" value="${prod ? prod.nombre : ''}">
    <label>Precio ($):</label>
    <input type="number" id="form-prod-precio" class="form-control" value="${prod ? prod.precio : ''}">
    <label>Stock Físico:</label>
    <input type="number" id="form-prod-stock" class="form-control" value="${prod ? prod.stock : ''}">
    <label>Categoría Asignada:</label>
    <select id="form-prod-cat" class="form-control">${selectOptions}</select>
    <label><input type="checkbox" id="form-prod-disp" ${prod ? (prod.disponible ? 'checked' : '') : 'checked'}> Disponible para la venta</label>
    <div class="modal-acciones" style="margin-top: 15px;">
      <button class="btn-tabla" id="btn-cerrar-modal">Cancelar</button>
      <button class="btn-crear" id="btn-guardar-prod">Guardar</button>
    </div>
  `;

  modalOverlay.style.display = "flex";

  document.getElementById("btn-cerrar-modal")?.addEventListener("click", () => modalOverlay.style.display = "none");
  document.getElementById("btn-guardar-prod")?.addEventListener("click", () => {
    const nom = (document.getElementById("form-prod-nombre") as HTMLInputElement).value.trim();
    const prc = parseFloat((document.getElementById("form-prod-precio") as HTMLInputElement).value);
    const stk = parseInt((document.getElementById("form-prod-stock") as HTMLInputElement).value);
    const catId = parseInt((document.getElementById("form-prod-cat") as HTMLSelectElement).value);
    const disp = (document.getElementById("form-prod-disp") as HTMLInputElement).checked;

    if(!nom || isNaN(prc) || prc <= 0 || isNaN(stk) || stk < 0) { alert("Ingresá valores válidos."); return; }

    const catObj = categorias.find(c => c.id === catId);

    if(prod) {
      prod.nombre = nom; prod.precio = prc; prod.stock = stk; prod.categoria = catObj; prod.disponible = disp;
    } else {
      productos.push({
        id: productos.length + 1, nombre: nom, precio: prc, stock: stk, categoria: catObj, disponible: disp, imagen: "https://foodish-api.com/images/burger/burger1.jpg"
      });
    }
    modalOverlay.style.display = "none";
    renderizarProductos();
    calcularEstadisticas();
  });
}

/* ==========================================================================
   MÓDULO PEDIDOS / GESTIÓN SECUENCIAL (FHU-10)
   ========================================================================== */
function renderizarPedidos() {
  const tbody = document.getElementById("tbody-pedidos-admin");
  const filtro = (document.getElementById("filtro-pedidos-admin") as HTMLSelectElement)?.value || "TODOS";
  if (!tbody) return;
  tbody.innerHTML = "";

  const filtrados = pedidos.filter(p => filtro === "TODOS" || p.estado === filtro);

  filtrados.forEach(ped => {
    const tr = document.createElement("tr");
    
    // Control secuencial de flujo de estados requerido
    let btnAccionHtml = "";
    if (ped.estado === "PENDIENTE") {
      btnAccionHtml = `<button class="btn-crear btn-cambiar-estado" data-sig="CONFIRMADO" style="background:#2563eb;">Aceptar</button>`;
    } else if (ped.estado === "CONFIRMADO") {
      btnAccionHtml = `<button class="btn-crear btn-cambiar-estado" data-sig="TERMINADO" style="background:#059669;">Finalizar</button>`;
    } else {
      btnAccionHtml = `<span style="color:#9ca3af; font-size:0.8rem;">Flujo Terminado</span>`;
    }

    tr.innerHTML = `
      <td><strong>#${ped.id.toString().substring(0,6)}</strong></td>
      <td>${ped.fecha}</td>
      <td>${ped.usuarioDto ? `${ped.usuarioDto.nombre} (${ped.usuarioDto.mail})` : 'Cliente'}</td>
      <td style="font-weight: bold;">$${ped.total}</td>
      <td><span class="badge-estado badge-${ped.estado}">${ped.estado}</span></td>
      <td>${btnAccionHtml}</td>
    `;

    tr.querySelector(".btn-cambiar-estado")?.addEventListener("click", () => {
      const proximoEstado = tr.querySelector(".btn-cambiar-estado")?.getAttribute("data-sig");
      if (proximoEstado) {
        ped.estado = proximoEstado;
        renderizarPedidos();
        calcularEstadisticas();
      }
    });

    tbody.appendChild(tr);
  });
}

function configurarEventosGlobales() {
  document.getElementById("btn-nueva-categoria")?.addEventListener("click", () => abrirModalCategoria());
  document.getElementById("btn-nuevo-producto")?.addEventListener("click", () => abrirModalProducto());
  document.getElementById("filtro-pedidos-admin")?.addEventListener("change", () => renderizarPedidos());
  
  document.getElementById("logoutButton")?.addEventListener("click", () => {
    logout();
  });
}

// Inicialización del Script
inicializarAdmin();