import { profileRepository }  from '../repositories/profileRepository';
import { informeRepository }  from '../repositories/informeRepository';
import { novedadRepository }  from '../repositories/novedadRepository';
import { profileService }     from './profileService';

const ESTADOS = ['pendiente', 'en_proceso', 'completado', 'aprobado', 'rechazado'];

export const graficosService = {
    async getDashboardData(userId) {
        const empresaId = await profileService.getEmpresaIdByUser(userId);
        if (!empresaId) return { sinEmpresa: true };

        const { data: perfiles, error: errPerf } = await profileRepository.findByEmpresaId(empresaId);
        if (errPerf) throw errPerf;

        const userIds      = perfiles.map(p => p.id);
        let conteosEstado  = [0, 0, 0, 0, 0];
        let totalInformes  = 0;

        if (userIds.length > 0) {
            const { data: informes, error: errInf } = await informeRepository.findByUserIds(userIds);
            if (errInf) throw errInf;
            conteosEstado = ESTADOS.map(e => informes.filter(i => i.estado === e).length);
            totalInformes = informes.length;
        }

        const { data: novedades, error: errNov } = await novedadRepository.findTiposByEmpresa(empresaId);
        if (errNov) throw errNov;

        const { data: vistas, error: errPend } = await novedadRepository.findPendingViewsByUser(userId);
        if (errPend) throw errPend;

        return {
            sinEmpresa: false,
            conteosEstado,
            totalInformes,
            novedadesPorTipo: novedades ?? [],
            novedadesPend:    vistas?.length ?? 0,
        };
    },
};
