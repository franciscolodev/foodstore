/* TPI - Programación III - Francisco López */
export const Rol = {
    ADMIN: 'ADMIN',
    CLIENT: 'USUARIO'
} as const;

export type RolType = typeof Rol[keyof typeof Rol];