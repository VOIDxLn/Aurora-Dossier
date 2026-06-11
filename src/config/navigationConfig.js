import { ROUTES }          from '../constants/routes';
import { PERMISSION_KEYS } from '../constants/permissions';
import { COLORS }          from '../constants/colors';

export const MENU_CARDS = [
    {
        label:   'Crear informe',
        icon:    'file-plus-outline',
        color:   COLORS.primary,
        bg:      COLORS.primaryLight,
        route:   ROUTES.CREAR_INFORME,
        permiso: PERMISSION_KEYS.CREAR_INFORMES,
        roles:   ['admin', 'empleado'],
    },
    {
        label:   'Consultar informes',
        icon:    'file-document-outline',
        color:   COLORS.danger,
        bg:      COLORS.dangerLight,
        route:   ROUTES.CARPETAS,
        permiso: PERMISSION_KEYS.VER_INFORMES,
        roles:   ['admin'],
    },
    {
        label:   'Gestionar informe',
        icon:    'paperclip',
        color:   COLORS.danger,
        bg:      COLORS.dangerLight,
        route:   ROUTES.INFORMES,
        permiso: PERMISSION_KEYS.VER_INFORMES,
        roles:   ['empleado'],
    },
    {
        label:   'Historial',
        icon:    'folder-open-outline',
        color:   COLORS.warning,
        bg:      COLORS.warningLight,
        route:   ROUTES.CARPETAS,
        permiso: PERMISSION_KEYS.VER_INFORMES,
        roles:   ['empleado'],
    },
    {
        label:   'Consultar usuarios',
        icon:    'account-group-outline',
        color:   COLORS.success,
        bg:      COLORS.successLight,
        route:   ROUTES.USUARIOS,
        permiso: PERMISSION_KEYS.VER_USUARIOS,
        roles:   ['admin'],
    },
    {
        label:   'Crear usuarios',
        icon:    'account-plus-outline',
        color:   COLORS.primary,
        bg:      COLORS.primaryLight,
        route:   ROUTES.CREAR_USUARIO,
        permiso: PERMISSION_KEYS.CREAR_USUARIOS,
        roles:   ['admin'],
    },
    {
        label:   'Novedades',
        icon:    'newspaper-variant-outline',
        color:   COLORS.warning,
        bg:      COLORS.warningLight,
        route:   ROUTES.NOVEDADES,
        permiso: PERMISSION_KEYS.VER_NOVEDADES,
        roles:   ['admin'],
    },
    {
        label:   'Pendientes',
        icon:    'clipboard-list-outline',
        color:   '#FF9800',
        bg:      '#FFF8F0',
        route:   ROUTES.NOVEDADES,
        permiso: PERMISSION_KEYS.VER_NOVEDADES,
        roles:   ['empleado'],
    },
    {
        label:   'Gráficos',
        icon:    'chart-bar',
        color:   '#FF9800',
        bg:      '#FFF3E0',
        route:   ROUTES.GRAFICOS,
        permiso: PERMISSION_KEYS.VER_GRAFICOS,
        roles:   ['admin'],
    },
];

export const BOTTOM_NAV_CONFIG = {
    admin: [
        { icon: 'account-outline', route: ROUTES.HOME          },
        { icon: 'cog-outline',     route: ROUTES.CONFIGURACION },
        { icon: 'bell-outline',    route: ROUTES.NOVEDADES     },
        { icon: 'folder-outline',  route: ROUTES.CARPETAS      },
    ],
    empleado: [
        { icon: 'account-outline', route: ROUTES.CONFIGURACION },
        { icon: 'cog-outline',     route: ROUTES.CONFIGURACION },
        { icon: 'bell-outline',    route: null                  },
        { icon: 'folder-outline',  route: ROUTES.CARPETAS      },
    ],
};
