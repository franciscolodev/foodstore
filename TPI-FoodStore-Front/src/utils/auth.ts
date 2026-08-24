import { IUser } from "../types/IUser";
import { Rol } from "../types/Rol";
import { getUSer, removeUser } from "./localStorage";
import { navigateTo } from "./navigate";

export const getActiveSession = (): IUser | null => {
  const userStr = getUSer(); /*Trae la sesión actual desde localStorage.ts */
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as IUser;
  } catch {
    return null;
  }
};

export const checkAuthUser = (rolesPermitidos: (typeof Rol[keyof typeof Rol])[]): void => {
  const user = getActiveSession();


  if (!user) {
    alert("Acceso restringido. Por favor, iniciá sesión.");
    navigateTo("login");
    return;
  }

  if (!rolesPermitidos.includes(user.rol)) {
    alert("No tenés los permisos requeridos para ver esta sección.");
    navigateTo(user.rol);
    return;
  }
};

export const logout = (): void => {
  removeUser(); /*para limpiar la clave de userData en localStorage.ts*/
  navigateTo("login");
};