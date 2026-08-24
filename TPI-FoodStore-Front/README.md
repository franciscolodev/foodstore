# FoodStore - Interfaz de Usuario / Frontend
-Alumno: Francisco López
-Materia: Programación III (UTN)
-Institución: Universidad Tecnológica Nacional (UTN)

---

## 🎨 Descripción del Módulo Visual
Este módulo comprende la interfaz de usuario de **FoodStore**. Diseñado originalmente bajo una estética neo-brutalista con componentes visuales de alto contraste, se optimizó y reestructuró para integrarse de forma reactiva con el Backend transaccional de JPA. 

Permite la gestión ágil del catálogo por parte de los administradores y la simulación fluida de compras en tiempo real para los clientes.

---

## 🛠️ Tecnologías y Stack Utilizado
* **JavaScript / TypeScript**
* **React** (Biblioteca principal de componentes)
* **Tailwind CSS** (Estilizado responsive y diseño UI)

---

## 💻 Módulos Visuales Integrados (Estructura TPI)

### 1. Panel de Administración (Backoffice)
* **Gestión de Categorías y Platos:** Formularios dinámicos para el Alta, Modificación y Baja Lógica de productos, sincronizados con las validaciones del Backend.
* **Filtros por Estado:** Vistas selectivas para auditar y avanzar el estado de las órdenes en base al flujo secuencial del negocio.

### 2. Panel del Cliente / Experiencia de Compra
* **Góndola Interactiva:** Catálogo dinámico que lee el stock físico disponible directamente de la persistencia de datos.
* **Carrito de Compras Transaccional:** Módulo reactivo que calcula subtotales, totales en caliente y bloquea la compra si la cantidad seleccionada supera el stock físico de la tienda.

### 3. Tablero de Control Analítico (Dashboard)
* **Módulo de Reportes:** Visualización limpia de los datos recolectados por las consultas complejas de JPQL, permitiendo al administrador ver la facturación histórica agrupada y el listado exclusivo de Clientes Premium de un vistazo.

---

## ⚙️ Instrucciones de Inicialización
1. Clonar el repositorio e ingresar a la carpeta del Frontend.
2. Ejecutar `npm install` en la terminal para instalar todas las dependencias del stack.
3. Configurar el archivo de variables de entorno para apuntar a la URL del servidor Backend local.
4. Levantar el entorno de desarrollo local con el comando:
   ```bash
   npm run dev
