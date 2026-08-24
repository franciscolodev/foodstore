package com.tp.jpa;

import com.tp.jpa.model.*;
import com.tp.jpa.model.enums.*;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import java.util.List;

public class MainTP8 {
    public static void main(String[] args) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();

            // 1. Instanciar y Persistir 3 Categorías
            Categoria cat1 = new Categoria("Componentes", "Hardware interno de PC");
            Categoria cat2 = new Categoria("Periféricos", "Teclados, ratones y audio");
            Categoria cat3 = new Categoria("Monitores", "Pantallas de alta frecuencia");
            em.persist(cat1); em.persist(cat2); em.persist(cat3);

            // 2. Instanciar y Persistir 10 productos
            Producto p1 = crearProducto("Intel i7 13700K", 450.0, 15, cat1);
            Producto p2 = crearProducto("AMD Ryzen 7 7800X3D", 500.0, 10, cat1);
            Producto p3 = crearProducto("NVIDIA RTX 4070 Ti", 900.0, 5, cat1);
            Producto p4 = crearProducto("Logitech G Pro X Superlight", 150.0, 25, cat2);
            Producto p5 = crearProducto("Razer Huntsman V3 Pro", 220.0, 12, cat2);
            Producto p6 = crearProducto("HyperX QuadCast S", 180.0, 8, cat2);
            Producto p7 = crearProducto("ASUS ROG Swift 240Hz", 600.0, 4, cat3);
            Producto p8 = crearProducto("Samsung Odyssey G7", 700.0, 6, cat3);
            Producto p9 = crearProducto("Corsair RM850x PSU", 140.0, 20, cat1);
            Producto p10 = crearProducto("G.Skill Trident Z5 32GB RAM", 160.0, 30, cat1);

            em.persist(p1); em.persist(p2); em.persist(p3); em.persist(p4); em.persist(p5);
            em.persist(p6); em.persist(p7); em.persist(p8); em.persist(p9); em.persist(p10);

            // 3. Instanciar y Persistir 2 Usuarios
            Usuario u1 = new Usuario("Francisco", "López", "fran@cuartosoft.online", "3584000000", "pass123", Rol.ADMIN);
            Usuario u2 = new Usuario("Juan", "Pérez", "juan@gmail.com", "3584111111", "user123", Rol.USUARIO);
            em.persist(u1); em.persist(u2);

            // 4. Instanciar y Persistir 3 Pedidos con al menos 2 detalles cada uno
            Pedido ped1 = new Pedido(Estado.PENDIENTE, FormaPago.TRANSFERENCIA, u1);
            ped1.addDetallePedido(1, p1);
            ped1.addDetallePedido(2, p4);
            em.persist(ped1);

            Pedido ped2 = new Pedido(Estado.CONFIRMADO, FormaPago.TARJETA, u2);
            ped2.addDetallePedido(1, p2);
            ped2.addDetallePedido(1, p8);
            em.persist(ped2);

            Pedido ped3 = new Pedido(Estado.TERMINADO, FormaPago.EFECTIVO, u1);
            ped3.addDetallePedido(1, p3);
            ped3.addDetallePedido(4, p10);
            em.persist(ped3);

            tx.commit();
            System.out.println("\n>>> [ÉXITO] Datos iniciales del TP8 guardados.");

            // 5. Actualizar al menos 2 productos
            tx.begin();
            p1.setPrecio(480.0); // Modificación de precio
            p4.setStock(20);     // Modificación de stock
            em.merge(p1);
            em.merge(p4);
            tx.commit();
            System.out.println(">>> [ÉXITO] Productos actualizados correctamente.");

            // 6. Buscar Usuario por id
            Usuario buscadoId = em.find(Usuario.class, u1.getId());
            System.out.println(">>> [CONSULTA ID] Usuario encontrado: " + buscadoId.getNombre() + " " + buscadoId.getApellido());

            // 7. Buscar Usuario por mail (Uso de JPQL básico solicitado)
            List<Usuario> resultadosMail = em.createQuery("SELECT u FROM Usuario u WHERE u.mail = :email", Usuario.class)
                    .setParameter("email", "juan@gmail.com")
                    .getResultList();
            if (!resultadosMail.isEmpty()) {
                System.out.println(">>> [CONSULTA MAIL] Usuario encontrado: " + resultadosMail.get(0).getNombre());
            }

            // 8. Borrar 1 producto de la base de datos
            tx.begin();
            Producto productoABorrar = em.find(Producto.class, p9.getId());
            if (productoABorrar != null) {
                em.remove(productoABorrar);
            }
            tx.commit();
            System.out.println(">>> [ÉXITO] Producto '" + p9.getNombre() + "' eliminado físicamente.\n");

        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            e.printStackTrace();
        } finally {
            if (em != null && em.isOpen()) em.close();
            JPAUtil.shutdown();
        }
    }

    private static Producto crearProducto(String nombre, Double precio, int stock, Categoria cat) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setPrecio(precio);
        p.setDescription("Descripción detallada de " + nombre);
        p.setStock(stock);
        p.setImagen(nombre.toLowerCase().replace(" ", "_") + ".png");
        p.setCategoria(cat);
        return p;
    }
}