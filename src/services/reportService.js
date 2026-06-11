import { supabase }          from '../lib/supabase';
import { informeRepository } from '../repositories/informeRepository';

export const reportService = {
    /**
     * Guarda un informe.
     * Siempre resuelve el UUID real de auth.users para no violar la FK
     * informes_user_id_fkey, sin importar qué userId llegue como argumento.
     */
    async save(userId, titulo, contenido) {
        // Obtener el usuario autenticado directamente desde la sesión activa
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('reportService.save: no hay sesión activa', authError?.message);
            return;
        }

        // Siempre usar el UUID de auth.users, no el ID de otras tablas
        const authUserId = user.id;

        const { error } = await informeRepository.create(authUserId, titulo, contenido);
        if (error) console.error('reportService.save:', error.message);
    },

    getByUser: (userId) => informeRepository.findAllByUser(userId),

    deleteById: (id) => informeRepository.deleteById(id),
};
