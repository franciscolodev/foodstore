/* TPI - Programación III - Francisco López */
import { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";

const formLogin = document.getElementById("form-login") as HTMLFormElement | null;
const inputEmail = document.getElementById("login-email") as HTMLInputElement | null;
const inputPassword = document.getElementById("login-password") as HTMLInputElement | null;
const txtMensaje = document.getElementById("log-mensaje") as HTMLParagraphElement | null;

if (formLogin && inputEmail && inputPassword) {
  // Añadimos 'async' para poder usar await en las promesas asincrónicas
  formLogin.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const email = inputEmail.value.trim().toLowerCase();
    const password = inputPassword.value.trim();

    if (!email || !password) {
      if (txtMensaje) {
        txtMensaje.textContent = "Por favor, completa todos los campos.";
        txtMensaje.style.color = "red";
      }
      return;
    }

    try {
      // 1. Consumimos el archivo JSON oficial provisto por la cátedra
      const response = await fetch('/data/usuarios.json');
      if (!response.ok) {
        throw new Error("No se pudo cargar el listado de usuarios.");
      }
      
      const listaUsuarios: any[] = await response.json();

      // 2. Buscamos coincidencia usando el campo .mail del JSON oficial
      const usuarioEncontrado = listaUsuarios.find(
        (user) => user.mail.toLowerCase() === email && user.password === password
      );

      if (!usuarioEncontrado) {
        if (txtMensaje) {
          txtMensaje.textContent = "Correo electrónico o contraseña incorrectos.";
          txtMensaje.style.color = "red";
        }
        return;
      }

      // 3. Estructuramos la sesión activa (Prohibido por consigna guardar el password en localStorage)
      const sesionUsuario: IUser = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        email: usuarioEncontrado.mail,
        rol: usuarioEncontrado.rol
      };

      // Guardamos la sesión en el localStorage bajo la clave 'userData'
      saveUser(sesionUsuario);

      if (txtMensaje) {
        txtMensaje.textContent = "¡Ingreso correcto! Redirigiendo...";
        txtMensaje.style.color = "green";
      }

      // 4. Redirección automática según el rol obtenido (ADMIN o USUARIO)
      setTimeout(() => {
        navigateTo(usuarioEncontrado.rol);
      }, 1000);

    } catch (error) {
      console.error(error);
      if (txtMensaje) {
        txtMensaje.textContent = "Hubo un error en el sistema de autenticación.";
        txtMensaje.style.color = "red";
      }
    }
  });
}