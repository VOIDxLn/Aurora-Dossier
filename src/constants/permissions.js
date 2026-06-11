export const PERMISSION_KEYS = {
    CREAR_USUARIOS: 'crear_usuarios',
    VER_USUARIOS:   'ver_usuarios',
    CREAR_INFORMES: 'crear_informes',
    VER_INFORMES:   'ver_informes',
    VER_GRAFICOS:   'ver_graficos',
    VER_NOVEDADES:  'ver_novedades',
};

export const PERMISOS_CONFIG = [
    { key: PERMISSION_KEYS.CREAR_USUARIOS, label: 'Crear usuarios',  icon: 'account-plus-outline'      },
    { key: PERMISSION_KEYS.VER_USUARIOS,   label: 'Ver usuarios',     icon: 'account-group-outline'     },
    { key: PERMISSION_KEYS.CREAR_INFORMES, label: 'Crear informes',   icon: 'file-plus-outline'         },
    { key: PERMISSION_KEYS.VER_INFORMES,   label: 'Ver informes',     icon: 'file-document-outline'     },
    { key: PERMISSION_KEYS.VER_GRAFICOS,   label: 'Ver gráficos',     icon: 'chart-bar'                 },
    { key: PERMISSION_KEYS.VER_NOVEDADES,  label: 'Ver novedades',    icon: 'newspaper-variant-outline' },
];

export const ROL_STYLE = {
    admin:      { bg: '#EFF6FF', color: '#2456ee'  },
    supervisor: { bg: '#F0FDF4', color: '#16a34a'  },
    empleado:   { bg: '#FFF7ED', color: '#ea580c'  },
};
