import { novedadRepository } from '../repositories/novedadRepository';

export const novedadesService = {
    async obtenerNovedades(empresaId) {
        const { data, error } = await novedadRepository.findAllByEmpresa(empresaId);
        if (error) {
            console.error('novedadesService.obtenerNovedades:', error);
            return [];
        }
        return data;
    },

    async crearNovedad(nuevaNovedad) {
        const { error } = await novedadRepository.create(nuevaNovedad);
        if (error) throw error;
    },

    async obtenerPendientes(userId, empresaId) {
        const [{ data: todas, error: errTodas }, { data: vistas, error: errVistas }] =
            await Promise.all([
                novedadRepository.findPendingByEmpresa(empresaId),
                novedadRepository.findCompletedIdsByUser(userId),
            ]);

        if (errTodas)  throw errTodas;
        if (errVistas) throw errVistas;

        const completadasIds = new Set((vistas ?? []).map(v => v.novedad_id));
        return (todas ?? []).filter(n => !completadasIds.has(n.id));
    },

    async obtenerCompletadas(userId) {
        const { data, error } = await novedadRepository.findCompletedByUser(userId);
        if (error) throw error;
        return (data ?? []).map(v => ({ ...v.novedades, vista_at: v.vista_at }));
    },

    async marcarComoVisto(novedadId, userId) {
        const { error } = await novedadRepository.markAsViewed(novedadId, userId);
        if (error) throw error;
    },

    async obtenerVistasNovedad(novedadId) {
        const { data, error } = await novedadRepository.findViewsByNovedad(novedadId);
        if (error) throw error;
        return data ?? [];
    },
};

export default novedadesService;
