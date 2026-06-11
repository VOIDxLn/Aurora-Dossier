import { supabase }           from '../lib/supabase';
import { informeRepository }  from '../repositories/informeRepository';
import { empleadoRepository } from '../repositories/empleadoRepository';
import { profileRepository }  from '../repositories/profileRepository';

export const reportService = {
    /**
     * Guarda un informe.
     * 1. Resuelve el UUID real de auth.users (evita FK con IDs de otras tablas).
     * 2. Garantiza que exista un row en `profiles` antes de insertar
     *    (la FK informes_user_id_fkey → profiles.id lo requiere).
     *    Esto cubre empleados antiguos que no pasaron por el flujo de CrearUsuario.
     */
    async save(userId, titulo, contenido) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('reportService.save: no hay sesión activa', authError?.message);
            return;
        }

        const authUserId = user.id;

        // Garantizar que el perfil existe para cumplir la FK
        const { data: perfil } = await profileRepository.findByUid(authUserId);
        if (!perfil) {
            // El empleado no tiene profile — lo creamos a partir de su row en empleados
            const { data: empleado } = await empleadoRepository.findByUid(authUserId);
            if (empleado?.empresa_id) {
                await profileRepository.upsertProfile(authUserId, empleado.empresa_id, empleado.rol ?? 'empleado');
            } else {
                console.warn('reportService.save: no se pudo crear el perfil, empleado sin empresa_id');
            }
        }

        const { error } = await informeRepository.create(authUserId, titulo, contenido);
        if (error) console.error('reportService.save:', error.message);
    },

    getByUser: (userId) => informeRepository.findAllByUser(userId),

    deleteById: (id) => informeRepository.deleteById(id),
};

