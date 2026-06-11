import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    ActivityIndicator, Dimensions, TouchableOpacity,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

const screenWidth = Dimensions.get('window').width;

const ESTADOS        = ['pendiente', 'en_proceso', 'completado', 'aprobado', 'rechazado'];
const LABELS_DISPLAY = ['Pend.', 'En proc.', 'Complet.', 'Aprobado', 'Rechaz.'];
const COLORES_ESTADO = ['#ef4444', '#f59e0b', '#10b981', '#2456ee', '#8b5cf6'];

const TIPOS_NOVEDAD = [
    { key: 'novedad', label: 'Novedad', color: '#2456ee' },
    { key: 'tarea',   label: 'Tarea',   color: '#f59e0b' },
    { key: 'aviso',   label: 'Aviso',   color: '#10b981' },
];

export default function GraficosScreen({ navigation }) {
    const { userData, loading: userLoading } = useUser();

    const [loading, setLoading]             = useState(true);
    const [sinEmpresa, setSinEmpresa]       = useState(false);
    const [exportando, setExportando]       = useState(false);
    const [conteosEstado, setConteosEstado] = useState([0, 0, 0, 0, 0]);
    const [totalInformes, setTotalInformes] = useState(0);
    const [novedadesPend, setNovedadesPend] = useState(0);
    const [pieData, setPieData]             = useState([]);

    useEffect(() => {
        if (!userLoading) fetchData();
    }, [userLoading]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setSinEmpresa(false);

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) { setSinEmpresa(true); return; }

            const { data: perfil } = await supabase
                .from('profiles')
                .select('empresa_id')
                .eq('id', user.id)
                .maybeSingle();

            const empresaId = perfil?.empresa_id;
            if (!empresaId) { setSinEmpresa(true); return; }

            const { data: perfiles, error: errPerf } = await supabase
                .from('profiles')
                .select('id')
                .eq('empresa_id', empresaId);

            if (errPerf) throw errPerf;

            const userIds = perfiles.map((p) => p.id);
            let counts = [0, 0, 0, 0, 0];
            let totalInf = 0;

            if (userIds.length > 0) {
                const { data: informes, error: errInf } = await supabase
                    .from('informes')
                    .select('estado')
                    .in('user_id', userIds);

                if (errInf) throw errInf;

                counts  = ESTADOS.map((e) => informes.filter((i) => i.estado === e).length);
                totalInf = informes.length;
            }

            setConteosEstado(counts);
            setTotalInformes(totalInf);

            const { data: novedades, error: errNov } = await supabase
                .from('novedades')
                .select('tipo')
                .eq('empresa_id', empresaId);

            if (errNov) throw errNov;

            const pie = TIPOS_NOVEDAD.map((t) => ({
                name:            t.label,
                population:      novedades.filter((n) => n.tipo === t.key).length,
                color:           t.color,
                legendFontColor: '#5b5b5b',
                legendFontSize:  13,
            }));
            setPieData(pie);

            if (userData?.id) {
                const { data: vistas, error: errPend } = await supabase
                    .from('novedades_vistas')
                    .select('completada')
                    .eq('empleado_id', userData.id)
                    .eq('completada', false);

                if (errPend) throw errPend;
                setNovedadesPend(vistas?.length ?? 0);
            }

        } catch (error) {
            console.error('Error fetchData Graficos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const exportarPdf = async () => {
        try {
            setExportando(true);

            const empresa = userData?.nombre ?? 'Aurora Dossier';
            const fecha   = new Date().toLocaleDateString('es-CO', {
                day: 'numeric', month: 'long', year: 'numeric',
            });
            const hora = new Date().toLocaleTimeString('es-CO');

            const filasEstado = ESTADOS.map((estado, i) => {
                const pct = totalInformes > 0
                    ? Math.round((conteosEstado[i] / totalInformes) * 100)
                    : 0;
                return `
                  <tr>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
                      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;
                        background:${COLORES_ESTADO[i]};margin-right:8px;"></span>
                      ${LABELS_DISPLAY[i]}
                    </td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;
                      font-weight:600;">${conteosEstado[i]}</td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;
                      color:#2456ee;">${pct}%</td>
                  </tr>`;
            }).join('');

            const filasNovedad = pieData.map((d) => `
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;
                    background:${d.color};margin-right:8px;"></span>
                  ${d.name}
                </td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;
                  font-weight:600;">${d.population}</td>
              </tr>`).join('');

            const html = `
              <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333;
                           line-height: 1.5; font-size: 13px; }
                    .header { display: flex; align-items: center;
                              border-bottom: 3px solid #2456ee;
                              padding-bottom: 15px; margin-bottom: 25px; }
                    .logo-circle { width: 56px; height: 56px; background: #2456ee;
                                   border-radius: 50%; display: flex; align-items: center;
                                   justify-content: center; margin-right: 14px; flex-shrink: 0; }
                    .logo-text { color: white; font-size: 18px; font-weight: bold; }
                    .company-name { font-size: 20px; font-weight: bold; color: #2456ee; }
                    .company-sub  { font-size: 11px; color: #666; }
                    .meta { background: #f3f4f6; border-radius: 10px; padding: 14px 18px;
                            margin-bottom: 24px; font-size: 13px; color: #5b5b5b; }
                    .meta strong { color: #1a1a1a; }
                    .kpi-row { display: flex; gap: 16px; margin-bottom: 24px; }
                    .kpi { flex: 1; border-radius: 12px; padding: 18px; text-align: center; }
                    .kpi-num { font-size: 36px; font-weight: bold; color: white; }
                    .kpi-lbl { font-size: 12px; color: rgba(255,255,255,0.85); margin-top: 4px; }
                    h2 { font-size: 15px; font-weight: 600; color: #1a1a1a;
                         margin: 0 0 10px 0; border-left: 4px solid #2456ee;
                         padding-left: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                    th { background: #2456ee; color: white; padding: 10px 12px;
                         text-align: left; font-size: 12px; }
                    .footer { margin-top: 30px; border-top: 1px solid #ddd;
                              padding-top: 10px; font-size: 10px; color: #999;
                              text-align: center; }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <div class="logo-circle">
                      <span class="logo-text">AD</span>
                    </div>
                    <div>
                      <div class="company-name">Aurora Dossier</div>
                      <div class="company-sub">Sistema de Gestión Empresarial</div>
                    </div>
                  </div>

                  <div class="meta">
                    <strong>Reporte:</strong> Dashboard — Métricas Aurora Dossier<br>
                    <strong>Empresa:</strong> ${empresa}<br>
                    <strong>Generado:</strong> ${fecha} a las ${hora}
                  </div>

                  <div class="kpi-row">
                    <div class="kpi" style="background:#2456ee;">
                      <div class="kpi-num">${totalInformes}</div>
                      <div class="kpi-lbl">Total informes</div>
                    </div>
                    <div class="kpi" style="background:#f59e0b;">
                      <div class="kpi-num">${novedadesPend}</div>
                      <div class="kpi-lbl">Novedades pendientes</div>
                    </div>
                  </div>

                  <h2>Informes por estado</h2>
                  <table>
                    <tr>
                      <th>Estado</th>
                      <th style="text-align:center;">Cantidad</th>
                      <th style="text-align:center;">Porcentaje</th>
                    </tr>
                    ${filasEstado}
                  </table>

                  <h2>Novedades por tipo</h2>
                  <table>
                    <tr>
                      <th>Tipo</th>
                      <th style="text-align:center;">Cantidad</th>
                    </tr>
                    ${filasNovedad}
                  </table>

                  <div class="footer">
                    Documento generado por Aurora Dossier · ${fecha}
                  </div>
                </body>
              </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);

        } catch (err) {
            console.error('Error exportando PDF:', err.message);
        } finally {
            setExportando(false);
        }
    };

    const barData = {
        labels: LABELS_DISPLAY,
        datasets: [{ data: conteosEstado }],
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo:   '#ffffff',
        decimalPlaces: 0,
        color:      (opacity = 1) => `rgba(36, 86, 238, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(91, 91, 91, ${opacity})`,
        style: { borderRadius: 12 },
        propsForBars: { rx: 4 },
    };

    if (userLoading || loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color='#2456ee' />
                <Text style={styles.loadingText}>Cargando datos...</Text>
            </View>
        );
    }

    if (sinEmpresa) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No hay empresa vinculada a tu cuenta.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Métricas de tu empresa</Text>
            </View>

            {/* Tarjetas métricas tocables */}
            <View style={styles.metricsRow}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.metricCard, { backgroundColor: '#2456ee' }]}
                    onPress={() => navigation.navigate('Informes')}
                >
                    <Text style={styles.metricNumber}>{totalInformes}</Text>
                    <Text style={styles.metricLabel}>Total{'\n'}informes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.metricCard, { backgroundColor: '#f59e0b' }]}
                    onPress={() => navigation.navigate('Novedades')}
                >
                    <Text style={styles.metricNumber}>{novedadesPend}</Text>
                    <Text style={styles.metricLabel}>Novedades{'\n'}pendientes</Text>
                </TouchableOpacity>
            </View>

            {/* Gráfico barras — Informes por estado */}
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Informes por estado</Text>
                {totalInformes === 0 ? (
                    <View style={styles.emptyPie}>
                        <Text style={styles.emptyText}>Sin informes registrados</Text>
                    </View>
                ) : (
                    <BarChart
                        data={barData}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={chartConfig}
                        style={styles.chart}
                        showValuesOnTopOfBars={true}
                        fromZero={true}
                        withInnerLines={false}
                    />
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Informes')}
                    style={styles.linkBtn}
                >
                    <Text style={styles.linkBtnText}>Ver informes →</Text>
                </TouchableOpacity>
            </View>

            {/* Gráfico circular — Novedades por tipo */}
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Novedades por tipo</Text>
                {pieData.every((d) => d.population === 0) ? (
                    <View style={styles.emptyPie}>
                        <Text style={styles.emptyText}>Sin novedades registradas</Text>
                    </View>
                ) : (
                    <PieChart
                        data={pieData}
                        width={screenWidth - 48}
                        height={200}
                        chartConfig={chartConfig}
                        accessor='population'
                        backgroundColor='transparent'
                        paddingLeft='16'
                        style={styles.chart}
                    />
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Novedades')}
                    style={styles.linkBtn}
                >
                    <Text style={styles.linkBtnText}>Ver novedades →</Text>
                </TouchableOpacity>
            </View>

            {/* Leyenda detallada — estados */}
            <View style={styles.legendCard}>
                <Text style={styles.chartTitle}>Detalle por estado</Text>
                {ESTADOS.map((estado, i) => (
                    <View key={estado} style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: COLORES_ESTADO[i] }]} />
                        <Text style={styles.legendLabel}>{LABELS_DISPLAY[i]}</Text>
                        <Text style={styles.legendCount}>{conteosEstado[i]}</Text>
                        <Text style={styles.legendPercent}>
                            {totalInformes > 0
                                ? `${Math.round((conteosEstado[i] / totalInformes) * 100)}%`
                                : '0%'}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Botón exportar PDF */}
            <TouchableOpacity
                style={styles.exportBtn}
                activeOpacity={0.85}
                onPress={exportarPdf}
                disabled={exportando}
            >
                {exportando ? (
                    <ActivityIndicator color='#ffffff' size='small' />
                ) : (
                    <>
                        <MaterialCommunityIcons name='file-pdf-box' size={20} color='#ffffff' />
                        <Text style={styles.exportBtnText}>Exportar reporte PDF</Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    },
    loadingText: {
        marginTop: 12,
        color: '#5b5b5b',
        fontSize: 14,
    },
    header: {
        marginBottom: 20,
        marginTop: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#5b5b5b',
        marginTop: 4,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    metricCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    metricNumber: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    metricLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
        textAlign: 'center',
    },
    chartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    chart: {
        borderRadius: 12,
    },
    emptyPie: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#5b5b5b',
        fontSize: 14,
    },
    linkBtn: {
        alignSelf: 'flex-end',
        paddingTop: 8,
    },
    linkBtnText: {
        color: '#2456ee',
        fontSize: 13,
        fontWeight: '600',
    },
    legendCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    legendLabel: {
        flex: 1,
        fontSize: 14,
        color: '#5b5b5b',
    },
    legendCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginRight: 12,
        minWidth: 20,
        textAlign: 'right',
    },
    legendPercent: {
        fontSize: 13,
        color: '#2456ee',
        minWidth: 36,
        textAlign: 'right',
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2456ee',
        borderRadius: 12,
        paddingVertical: 14,
        marginBottom: 8,
        shadowColor: '#2456ee',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    exportBtnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
});
