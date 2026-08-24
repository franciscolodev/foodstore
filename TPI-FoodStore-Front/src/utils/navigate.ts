import { Rol } from '../types/Rol';

export const navigateTo = (destino: typeof Rol[keyof typeof Rol] | 'login' | 'registro'): void => {
  const origin = window.location.origin;
  const basePath = '/src/pages';

  switch (destino) {
    case Rol.ADMIN:
      window.location.href = `${origin}${basePath}/admin/home/home.html`;
      break;
    case Rol.CLIENT:
      /*Cambie la dirección anterior que estaba en client/home/home por la nueva carpeta /store/home/home*/
      window.location.href = `${origin}${basePath}/store/home/home.html`;
      break;
    case 'login':
      window.location.href = `${origin}${basePath}/auth/login/login.html`;
      break;
    case 'registro':
      window.location.href = `${origin}${basePath}/auth/registro/registro.html`;
      break;
    default:
      window.location.href = `${origin}/index.html`;
  }
};