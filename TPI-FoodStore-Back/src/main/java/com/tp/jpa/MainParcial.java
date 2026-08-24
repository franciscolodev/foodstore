package com.tp.jpa;

/* TPI - Programación III - Francisco López */
import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.Producto;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.DetallePedido;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

public class MainParcial {
    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        int opcion;
        do {
            System.out.println("\n========================================");
            System.out.println("             SEGUNDO PARCIAL            ");
            System.out.println("       (EXTENSIÓN PARA EL TPI - JPAR)   ");
            System.out.println("========================================");
            System.out.println("1. ABM de Categorias");
            System.out.println("2. ABM de Productos");
            System.out.println("3. ABM de Usuarios (HU-11)");
            System.out.println("4. Registrar Nueva Orden / Venta (HU-12)");
            System.out.println("5. Gestion Secuencial de Pedidos (HU-14)");
            System.out.println("6. Menu de Reportes JPQL Avanzados");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opcion: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1 -> menuCategorias();
                    case 2 -> menuProductos();
                    case 3 -> menuUsuarios();
                    case 4 -> registrarPedido();
                    case 5 -> gestionEstadosPedidos();
                    case 6 -> menuReportes();
                    case 0 -> System.out.println("Saliendo del programa...");
                    default -> System.out.println("Opcion no valida.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error: Ingrese un numero valido.");
                opcion = -1;
            }
        } while (opcion != 0);
    }

    /* ==========================================================================
       ABM CATEGORÍAS (REUTILIZADO DEL PARCIAL)
       ========================================================================== */
    private static void menuCategorias() {
        int opcion;
        do {
            System.out.println("\n--- ABM CATEGORIAS ---");
            System.out.println("1. Alta");
            System.out.println("2. Baja Logica");
            System.out.println("3. Modificacion");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1 -> altaCategoria();
                    case 2 -> bajaCategoria();
                    case 3 -> modificacionCategoria();
                    case 4 -> listarCategorias();
                    case 0 -> {}
                    default -> System.out.println("Opcion no valida.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error.");
                opcion = -1;
            }
        } while (opcion != 0);
    }

    private static void altaCategoria() {
        System.out.print("Nombre: "); String nombre = scanner.nextLine().trim();
        if (nombre.isEmpty()) return;
        System.out.print("Descripcion: "); String descripcion = scanner.nextLine().trim();
        categoriaRepo.guardar(new Categoria(nombre, descripcion));
        System.out.println("Categoria guardada.");
    }

    private static void bajaCategoria() {
        System.out.print("Ingrese ID de la categoria: ");
        try {
            categoriaRepo.eliminarLogico(Long.parseLong(scanner.nextLine()));
            System.out.println("Baja realizada.");
        } catch (Exception e) { System.out.println("Error."); }
    }

    private static void modificacionCategoria() {
        System.out.print("Ingrese ID de la categoria: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Categoria> catOpt = categoriaRepo.buscarPorId(id);
            if (catOpt.isPresent() && !catOpt.get().isEliminado()) {
                Categoria cat = catOpt.get();
                System.out.print("Nuevo nombre: "); String n = scanner.nextLine().trim();
                if (!n.isEmpty()) cat.setNombre(n);
                categoriaRepo.guardar(cat);
                System.out.println("Categoria actualizada.");
            }
        } catch (Exception e) { System.out.println("ID incorrecto."); }
    }

    private static void listarCategorias() {
        List<Categoria> activas = categoriaRepo.listarActivos();
        if (activas.isEmpty()) {
            System.out.println("No hay categorias.");
        } else {
            activas.forEach(c -> System.out.println("ID: " + c.getId() + " - " + c.getNombre()));
        }
    }

    /* ==========================================================================
       ABM PRODUCTOS (REUTILIZADO DEL PARCIAL)
       ========================================================================== */
    private static void menuProductos() {
        int opcion;
        do {
            System.out.println("\n--- ABM PRODUCTOS ---");
            System.out.println("1. Alta");
            System.out.println("2. Baja Logica");
            System.out.println("3. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1 -> altaProducto();
                    case 2 -> bajaProducto();
                    case 3 -> listarProductos();
                    case 0 -> {}
                }
            } catch (Exception e) { opcion = -1; }
        } while (opcion != 0);
    }

    private static void altaProducto() {
        try {
            System.out.print("Nombre producto: "); String nom = scanner.nextLine().trim();
            System.out.print("Precio: "); double precio = Double.parseDouble(scanner.nextLine());
            System.out.print("Stock: "); int stock = Integer.parseInt(scanner.nextLine());
            listarCategorias();
            System.out.print("ID Categoria: "); Long catId = Long.parseLong(scanner.nextLine());
            Optional<Categoria> cat = categoriaRepo.buscarPorId(catId);
            if (cat.isPresent()) {
                Producto p = new Producto(); p.setNombre(nom); p.setPrecio(precio); p.setStock(stock); p.setCategoria(cat.get());
                productoRepo.guardar(p);
                System.out.println("Producto guardado.");
            }
        } catch (Exception e) { System.out.println("Formato incorrecto."); }
    }

    private static void bajaProducto() {
        System.out.print("ID Producto: ");
        try { productoRepo.eliminarLogico(Long.parseLong(scanner.nextLine())); System.out.println("Baja realizada."); } catch (Exception e) { System.out.println("Error."); }
    }

    private static void listarProductos() {
        List<Producto> activos = productoRepo.listarActivos();
        if (activos.isEmpty()) System.out.println("No hay productos.");
        else activos.forEach(p -> System.out.println("ID: " + p.getId() + " - " + p.getNombre() + " | $" + p.getPrecio() + " | Stock: " + p.getStock()));
    }

    /* ==========================================================================
       REQUERIMIENTOS DEL TPI: USUARIOS, PEDIDOS Y REPORTES
       ========================================================================== */
    private static void menuUsuarios() {
        int opcion;
        do {
            System.out.println("\n--- GESTIÓN DE USUARIOS (HU-11) ---");
            System.out.println("1. Alta Usuario");
            System.out.println("2. Baja Logica");
            System.out.println("3. Listar Usuarios Activos");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opción: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
                switch (opcion) {
                    case 1 -> {
                        System.out.print("Nombre completo: "); String n = scanner.nextLine().trim();
                        System.out.print("Mail: "); String m = scanner.nextLine().trim();
                        System.out.println("Seleccione Rol: 1. ADMIN | 2. CLIENTE");
                        int rSel = Integer.parseInt(scanner.nextLine());
                        Rol rol = (rSel == 1) ? Rol.ADMIN : Rol.values()[1];

                        Usuario u = new Usuario(); u.setNombre(n); u.setMail(m); u.setRol(rol);
                        em.getTransaction().begin(); em.merge(u); em.getTransaction().commit();
                        System.out.println("Usuario guardado.");
                    }
                    case 2 -> {
                        System.out.print("ID del Usuario a remover: ");
                        Long userId = Long.parseLong(scanner.nextLine());
                        em.getTransaction().begin();
                        Usuario uLogico = em.find(Usuario.class, userId);
                        if (uLogico != null) { uLogico.setEliminado(true); em.merge(uLogico); }
                        em.getTransaction().commit();
                        System.out.println("Baja procesada.");
                    }
                    case 3 -> {
                        List<Usuario> lista = em.createQuery("SELECT u FROM Usuario u WHERE u.eliminado = false", Usuario.class).getResultList();
                        lista.forEach(u -> System.out.println("ID: " + u.getId() + " - " + u.getNombre() + " (" + u.getMail() + ") - Rol: " + u.getRol()));
                    }
                    case 0 -> {}
                }
                em.close();
            } catch(Exception e) { System.out.println("Error procesando datos."); opcion = -1; }
        } while (opcion != 0);
    }

    private static void registrarPedido() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            System.out.println("\n--- REGISTRAR NUEVA ORDEN DE VENTA ---");
            List<Usuario> users = em.createQuery("SELECT u FROM Usuario u WHERE u.eliminado = false", Usuario.class).getResultList();
            if(users.isEmpty()) { System.out.println("No hay usuarios activos."); return; }
            users.forEach(u -> System.out.println("ID: " + u.getId() + " - " + u.getNombre()));
            System.out.print("ID del Cliente: ");
            Long uid = Long.parseLong(scanner.nextLine());
            Usuario usuario = em.find(Usuario.class, uid);
            if(usuario == null || usuario.isEliminado()) return;

            Pedido pedido = new Pedido();
            pedido.setFecha(new Date().toString());
            pedido.setEstado(Estado.PENDIENTE);
            pedido.setUsuario(usuario);
            System.out.println("Forma de pago: 1. EFECTIVO | 2. TARJETA | 3. TRANSFERENCIA");
            int fp = Integer.parseInt(scanner.nextLine());
            pedido.setFormaPago(fp == 1 ? FormaPago.EFECTIVO : fp == 2 ? FormaPago.TARJETA : FormaPago.TRANSFERENCIA);

            List<DetallePedido> detalles = new ArrayList<>();
            double totalAcumulado = 0;
            String continuar = "";

            em.getTransaction().begin();
            do {
                listarProductos();
                System.out.print("Seleccione ID del producto: ");
                Long pid = Long.parseLong(scanner.nextLine());
                Producto prod = em.find(Producto.class, pid);

                if(prod != null && !prod.isEliminado()) {
                    System.out.print("Cantidad (Stock actual: " + prod.getStock() + "): ");
                    int cant = Integer.parseInt(scanner.nextLine());
                    if(cant > prod.getStock()) { System.out.println("Stock insuficiente."); continue; }

                    prod.setStock(prod.getStock() - cant); // Descuento de stock físico
                    em.merge(prod);

                    DetallePedido det = new DetallePedido();
                    det.setProducto(prod); det.setCantidad(cant);
                    double sub = prod.getPrecio() * cant;
                    det.setSubtotal(sub); det.setPedido(pedido);
                    detalles.add(det);
                    totalAcumulado += sub;
                }
                System.out.print("¿Añadir otro plato? (s/n): "); continuar = scanner.nextLine().trim().toLowerCase();
            } while(continuar.equals("s"));

            pedido.setDetalles(detalles);
            pedido.setTotal(totalAcumulado);
            em.merge(pedido);
            em.getTransaction().commit();
            System.out.println("Pedido registrado. Total: $" + totalAcumulado);
        } catch (Exception e) { if(em.getTransaction().isActive()) em.getTransaction().rollback(); }
        finally { em.close(); }
    }

    private static void gestionEstadosPedidos() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            System.out.println("\n--- CONTROL SECUENCIAL DE ÓRDENES ---");
            System.out.println("Filtro: 1. PENDIENTE | 2. CONFIRMADO | 3. TERMINADO");
            int estSel = Integer.parseInt(scanner.nextLine());
            Estado est = estSel == 1 ? Estado.PENDIENTE : estSel == 2 ? Estado.CONFIRMADO : Estado.TERMINADO;

            List<Pedido> ordenes = em.createQuery("SELECT p FROM Pedido p WHERE p.estado = :est AND p.eliminado = false", Pedido.class).setParameter("est", est).getResultList();
            if(ordenes.isEmpty()) { System.out.println("No hay órdenes."); return; }

            ordenes.forEach(o -> System.out.println("ID: " + o.getId() + " | Cliente: " + o.getUsuario().getNombre() + " | Total: $" + o.getTotal()));
            System.out.print("Seleccione ID de la orden a avanzar: ");
            Long oid = Long.parseLong(scanner.nextLine());
            Pedido p = em.find(Pedido.class, oid);

            if(p != null) {
                em.getTransaction().begin();
                if(p.getEstado() == Estado.PENDIENTE) { p.setEstado(Estado.CONFIRMADO); }
                else if(p.getEstado() == Estado.CONFIRMADO) { p.setEstado(Estado.TERMINADO); }
                em.merge(p);
                em.getTransaction().commit();
                System.out.println("Estado avanzado.");
            }
        } catch(Exception e) { if(em.getTransaction().isActive()) em.getTransaction().rollback(); }
        finally { em.close(); }
    }

    private static void menuReportes() {
        int opcion;
        do {
            System.out.println("\n--- CENTRO DE REPORTES ANALÍTICOS JPQL ---");
            System.out.println("1. Productos por categoria (Filtro simple)");
            System.out.println("2. Total Facturado por Cliente (HU-16 - Agregacion/SUM)");
            System.out.println("3. Top Clientes Premium (HU-17 - Subconsultas Avanzadas)");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opción: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1 -> reporteProductosPorCategoria();
                    case 2 -> reporteFacturacionPorCliente();
                    case 3 -> reporteClientesPremium();
                    case 0 -> {}
                }
            } catch(Exception e) { opcion = -1; }
        } while (opcion != 0);
    }

    private static void reporteProductosPorCategoria() {
        System.out.print("ID Categoria: ");
        try {
            Long catId = Long.parseLong(scanner.nextLine());
            List<Producto> filtrados = productoRepo.buscarPorCategoria(catId);
            filtrados.forEach(p -> System.out.println(p.getNombre() + " | $" + p.getPrecio()));
        } catch (Exception e) { System.out.println("Error."); }
    }

    private static void reporteFacturacionPorCliente() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            System.out.println("\n--- TOTAL FACTURADO POR CLIENTE (HU-16) ---");
            String jpql = "SELECT p.usuario.nombre, SUM(p.total) FROM Pedido p WHERE p.eliminado = false GROUP BY p.usuario.nombre";
            TypedQuery<Object[]> query = em.createQuery(jpql, Object[].class);
            List<Object[]> resultados = query.getResultList();
            for(Object[] res : resultados) System.out.println("Cliente: " + res[0] + " | Total: $" + res[1]);
        } finally { em.close(); }
    }

    private static void reporteClientesPremium() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            System.out.println("\n--- TOP CLIENTES PREMIUM (HU-17) ---");
            String jpql = "SELECT p.usuario.nombre, p.total FROM Pedido p WHERE p.total > (SELECT AVG(p2.total) FROM Pedido p2 WHERE p2.eliminado = false) AND p.eliminado = false";
            TypedQuery<Object[]> query = em.createQuery(jpql, Object[].class);
            List<Object[]> resultados = query.getResultList();
            for(Object[] res : resultados) System.out.println("Cliente Premium: " + res[0] + " | Ticket: $" + res[1]);
        } finally { em.close(); }
    }
}