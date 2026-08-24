/* TPI - Programación III - Francisco López */
import { RolType } from './Rol';

export interface IUser {
  id: number | string;
  nombre?: string;
  apellido?: string;
  celular?: string;
  email: string;
  password?: string;
  rol: RolType;
}