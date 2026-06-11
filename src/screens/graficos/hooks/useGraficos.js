import { useState, useEffect, useCallback } from 'react';
import { authService }    from '../../../services/authService';
import { graficosService } from '../../../services/graficosService';
import { COLORS } from '../../../constants/colors';

const TIPOS_NOVEDAD = [
    { key: 'novedad', label: 'Novedad', color: COLORS.primary },
    { key: 'tarea',   label: 'Tarea',   color: '#f59e0b'      },
    { key: 'aviso',   label: 'Aviso',   color: '#10b981'      },
];

export function useGraficos() {
    const [loading,       setLoading]       = useState(true);
    const [sinEmpresa,    setSinEmpresa]    = useState(false);
    const [conteosEstado, setConteosEstado] = useState([0, 0, 0, 0, 0]);
    const [totalInformes, setTotalInformes] = useState(0);
    const [novedadesPend, setNovedadesPend] = useState(0);
    const [pieData,       setPieData]       = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setSinEmpresa(false);

            const { data: { user }, error: authError } = await authService.getUser();
            if (authError || !user) { setSinEmpresa(true); return; }

            const result = await graficosService.getDashboardData(user.id);

            if (result.sinEmpresa) { setSinEmpresa(true); return; }

            setConteosEstado(result.conteosEstado);
            setTotalInformes(result.totalInformes);
            setNovedadesPend(result.novedadesPend);
            setPieData(TIPOS_NOVEDAD.map(t => ({
                name:            t.label,
                population:      result.novedadesPorTipo.filter(n => n.tipo === t.key).length,
                color:           t.color,
                legendFontColor: COLORS.textLight,
                legendFontSize:  13,
            })));
        } catch (error) {
            console.error('useGraficos:', error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { loading, sinEmpresa, conteosEstado, totalInformes, novedadesPend, pieData };
}
