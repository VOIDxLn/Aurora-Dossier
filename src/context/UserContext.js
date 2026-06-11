import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading]   = useState(true);

    const loadUser = async () => {
        setLoading(true);
        try {
            const { data: { user }, error } = await authService.getUser();
            if (error || !user) { setUserData(null); return; }

            const empleado = await userService.getEmpleadoData(user.id, user.email);

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
                const adminData = await userService.getAdminData(user.id, user.email);
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

        const subscription = authService.onAuthStateChange((event) => {
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
