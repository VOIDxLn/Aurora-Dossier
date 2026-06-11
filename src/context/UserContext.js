import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService }    from '../services/authService';
import { empleadoService } from '../services/empleadoService';
import { profileService }  from '../services/profileService';

const UserContext = createContext(null);

const buildEmpleadoData = (empleado) => ({
    tipo:       'empleado',
    nombre:     empleado.nombre,
    email:      empleado.email,
    rol:        empleado.rol,
    permisos:   empleado.permisos ?? {},
    activo:     empleado.activo,
    id:         empleado.id,
    empresa_id: empleado.empresa_id,
});

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading,  setLoading]  = useState(true);

    const loadUser = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user }, error } = await authService.getUser();
            if (error || !user) { setUserData(null); return; }

            const empleado = await empleadoService.resolveByAuth(user.id, user.email);
            if (empleado) {
                setUserData(buildEmpleadoData(empleado));
                if (empleado.empresa_id) {
                    await profileService.ensureProfile(user.id, empleado.empresa_id, empleado.rol);
                }
            } else {
                const adminData = await profileService.getAdminUserData(user.id, user.email);
                setUserData(adminData);
            }
        } catch (e) {
            console.error('UserContext:', e.message);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();

        const subscription = authService.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN')  loadUser();
            if (event === 'SIGNED_OUT') { setUserData(null); setLoading(false); }
        });

        return () => subscription.unsubscribe();
    }, [loadUser]);

    return (
        <UserContext.Provider value={{ userData, loading, refreshUser: loadUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
