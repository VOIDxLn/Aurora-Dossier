import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext(null);

async function fetchEmpleado(userId, userEmail) {
    // Intento 1 — buscar por auth_uid
    const { data: porUid } = await supabase
        .from('empleados')
        .select('*')
        .eq('auth_uid', userId)
        .maybeSingle();

    if (porUid) return porUid;

    // Intento 2 — fallback por email (cuando auth_uid quedó null al crear)
    const { data: porEmail } = await supabase
        .from('empleados')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

    return porEmail ?? null;
}

async function fetchAdmin(userId, userEmail) {
    const { data: perfil } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', userId)
        .maybeSingle();

    const empresaId = perfil?.empresa_id;
    if (!empresaId) {
        return {
            tipo:     'admin',
            nombre:   userEmail?.split('@')[0] ?? 'Admin',
            email:    userEmail ?? '',
            rol:      'admin',
            permisos: null,
            activo:   true,
        };
    }

    const { data: empresa } = await supabase
        .from('empresas')
        .select('razon_social, correo')
        .eq('id', empresaId)
        .maybeSingle();

    return {
        tipo:     'admin',
        nombre:   empresa?.razon_social ?? 'Administrador',
        email:    empresa?.correo ?? userEmail,
        rol:      'admin',
        permisos: null,
        activo:   true,
    };
}

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading]   = useState(true);

    const loadUser = async () => {
        setLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) { setUserData(null); return; }

            const empleado = await fetchEmpleado(user.id, user.email);

            if (empleado) {
                setUserData({
                    tipo:     'empleado',
                    nombre:   empleado.nombre,
                    email:    empleado.email,
                    rol:      empleado.rol,
                    permisos: empleado.permisos ?? {},
                    activo:   empleado.activo,
                    id:       empleado.id,
                });
            } else {
                const adminData = await fetchAdmin(user.id, user.email);
                setUserData(adminData);
            }
        } catch (e) {
            console.error('UserContext:', e.message);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN')  loadUser();
            if (event === 'SIGNED_OUT') { setUserData(null); setLoading(false); }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ userData, loading, refreshUser: loadUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
