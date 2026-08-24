/* TPI - Programación III - Francisco López */
import { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";

const formRegistro = document.getElementById("form-registro") as HTMLFormElement | null;
const inputEmail = document.getElementById("reg-email") as HTMLInputElement | null;
const inputPassword = document.getElementById("reg-password") as HTMLInputElement | null;
const txtMensaje = document.getElementById("reg-mensaje") as HTMLParagraphElement | null;

if (formRegistro && inputEmail && inputPassword) {
formRegistro.addEventListener("submit", (e: Event) => {
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
      // 1. Estructuramos el nuevo usuario con el rol oficial 'USUARIO'
    const nuevoUsuario: IUser = {
        id: crypto.randomUUID(), // Generamos un ID provisorio
        email: email,
        rol: Rol.CLIENT // 'USUARIO'
    };

      // 2. Aplicamos la regla de AUTO-LOGIN: Guardamos la sesión directo en localStorage
    saveUser(nuevoUsuario);

    if (txtMensaje) {
        txtMensaje.textContent = "¡Registro exitoso! Iniciando sesión automáticamente...";
        txtMensaje.style.color = "green";
    }

      // 3. Lo mandamos directo al catálogo de la Food Store
    setTimeout(() => {
        navigateTo(Rol.CLIENT);
    }, 1500);

    } catch (error) {
    console.error(error);
    if (txtMensaje) {
        txtMensaje.textContent = "Hubo un error al procesar el registro.";
        txtMensaje.style.color = "red";
    }
    }
});
}