# FoodStore - Backend

* **Asignatura:** Programación III
* **Alumno:** Francisco López
* **Institución:** Universidad Tecnológica Nacional (UTN)

---

## 🚀 Descripción del Proyecto
Este módulo constituye el núcleo de persistencia y lógica transaccional del ecosistema **FoodStore**. A partir de la estructura del Segundo Parcial, se expandió el sistema para cubrir el flujo comercial completo exigido en el Trabajo Práctico Integral (TPI), utilizando **JPA / Hibernate** y consultas avanzadas en **JPQL**.

---

## 🛠️ Tecnologías y Stack Utilizado
* **Java 17** (LTS)
* **JPA / Hibernate** (Jakarta Persistence API)
* **Gradle** (Gestor de dependencias)
* **MySQL / H2** (Capa de Base de Datos)

---

## 📋 Historias de Usuario Resueltas (Rúbrica de Evaluación)

### Capa de Persistencia Avanzada
* **HU-01 a HU-04 (Repositorios Específicos):** Implementación de `CategoriaRepository`, `ProductoRepository`, `UsuarioRepository` y `PedidoRepository` extendiendo de una base genérica, resolviendo búsquedas por tipos enumerados y relaciones específicas en JPQL sin casteos manuales.

### Capa de Negocio e Interfaz de Consola
* **HU-11 (ABM Usuarios):** Gestión completa y transaccional (Alta, Listado y Baja Lógica) de Usuarios con roles diferenciados (`ADMIN`, `CLIENTE`).
* **HU-12 & HU-13 (Registro de Órdenes y Control de Stock):** Flujo de venta multientidad. Al confirmar un pedido, el sistema descuenta en caliente el stock físico de la góndola de productos y calcula de forma automática los subtotales por ítem y el monto total facturado.
* **HU-14 (Flujo Secuencial de Estados):** Control de ciclo de vida de una orden bloqueando saltos de estado inválidos (`PENDIENTE` ➔ `CONFIRMADO` ➔ `TERMINADO`).

### Centro de Reportes Analíticos (JPQL Avanzado)
* **HU-16 (Reporte de Facturación Agrupada):** Uso de funciones de agregación (`SUM`, `GROUP BY`) y `JOIN` para auditar el total gastado por cada cliente.
* **HU-17 (Top Clientes Premium):** Uso de subconsultas dinámicas en JPA para aislar y listar los clientes cuyas compras superan el promedio aritmético general de la tienda.

---

## ⚙️ Instrucciones de Ejecución
1. Clonar el repositorio.
2. Abrir el proyecto en IntelliJ IDEA.
3. Asegurar que las credenciales de la base de datos en `persistence.xml` sean correctas.
4. Ejecutar la clase `MainParcial.java` haciendo clic derecho ➔ **Run 'MainParcial.main()'**.
