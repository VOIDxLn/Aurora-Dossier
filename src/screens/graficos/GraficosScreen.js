import {
    View, Text, StyleSheet, ScrollView,
    ActivityIndicator, Dimensions, TouchableOpacity,
} from 'react-native';
import { BarChart, PieChart }     from 'react-native-chart-kit';
import { SafeAreaView }           from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useGraficos }  from './hooks/useGraficos';
import { pdfService }   from '../../services/pdfService';
import { COLORS }       from '../../constants/colors';
import { ROUTES }       from '../../constants/routes';
import { useState }     from 'react';

const screenWidth = Dimensions.get('window').width;

const ESTADOS        = ['pendiente', 'en_proceso', 'completado', 'aprobado', 'rechazado'];
const LABELS_DISPLAY = ['Pend.', 'En proc.', 'Complet.', 'Aprobado', 'Rechaz.'];
const COLORES_ESTADO = ['#ef4444', '#f59e0b', '#10b981', COLORS.primary, '#8b5cf6'];

const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo:   COLORS.surface,
    decimalPlaces: 0,
    color:      (opacity = 1) => `rgba(36, 86, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(91, 91, 91, ${opacity})`,
    style: { borderRadius: 12 },
    propsForBars: { rx: 4 },
};

export default function GraficosScreen({ navigation }) {
    const { loading, sinEmpresa, conteosEstado, totalInformes, novedadesPend, pieData } = useGraficos();
    const [exportando, setExportando] = useState(false);

    const exportarPdf = async () => {
        try {
            setExportando(true);
            const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
            const hora  = new Date().toLocaleTimeString('es-CO');

            const filasEstado = ESTADOS.map((estado, i) => {
                const pct = totalInformes > 0 ? Math.round((conteosEstado[i] / totalInformes) * 100) : 0;
                return `<tr>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
                      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${COLORES_ESTADO[i]};margin-right:8px;"></span>
                      ${LABELS_DISPLAY[i]}
                    </td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${conteosEstado[i]}</td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:${COLORS.primary};">${pct}%</td>
                  </tr>`;
            }).join('');

            const filasNovedad = pieData.map(d => `<tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d.color};margin-right:8px;"></span>
                  ${d.name}
                </td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${d.population}</td>
              </tr>`).join('');

            const html = `<html><head><meta charset="utf-8"><style>
              body{font-family:Arial,sans-serif;padding:40px;color:#333;line-height:1.5;font-size:13px;}
              .header{display:flex;align-items:center;border-bottom:3px solid ${COLORS.primary};padding-bottom:15px;margin-bottom:25px;}
              .logo-circle{width:56px;height:56px;background:${COLORS.primary};border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:14px;flex-shrink:0;}
              .logo-text{color:white;font-size:18px;font-weight:bold;}
              .company-name{font-size:20px;font-weight:bold;color:${COLORS.primary};}
              .company-sub{font-size:11px;color:#666;}
              .meta{background:#f3f4f6;border-radius:10px;padding:14px 18px;margin-bottom:24px;font-size:13px;color:#5b5b5b;}
              .meta strong{color:#1a1a1a;}
              .kpi-row{display:flex;gap:16px;margin-bottom:24px;}
              .kpi{flex:1;border-radius:12px;padding:18px;text-align:center;}
              .kpi-num{font-size:36px;font-weight:bold;color:white;}
              .kpi-lbl{font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px;}
              h2{font-size:15px;font-weight:600;color:#1a1a1a;margin:0 0 10px 0;border-left:4px solid ${COLORS.primary};padding-left:10px;}
              table{width:100%;border-collapse:collapse;margin-bottom:24px;}
              th{background:${COLORS.primary};color:white;padding:10px 12px;text-align:left;font-size:12px;}
              .footer{margin-top:30px;border-top:1px solid #ddd;padding-top:10px;font-size:10px;color:#999;text-align:center;}
            </style></head><body>
              <div class="header">
                <div class="logo-circle"><span class="logo-text">AD</span></div>
                <div><div class="company-name">Aurora Dossier</div><div class="company-sub">Sistema de Gestión Empresarial</div></div>
              </div>
              <div class="meta">
                <strong>Reporte:</strong> Dashboard — Métricas Aurora Dossier<br>
                <strong>Generado:</strong> ${fecha} a las ${hora}
              </div>
              <div class="kpi-row">
                <div class="kpi" style="background:${COLORS.primary};"><div class="kpi-num">${totalInformes}</div><div class="kpi-lbl">Total informes</div></div>
                <div class="kpi" style="background:#f59e0b;"><div class="kpi-num">${novedadesPend}</div><div class="kpi-lbl">Novedades pendientes</div></div>
              </div>
              <h2>Informes por estado</h2>
              <table><tr><th>Estado</th><th style="text-align:center;">Cantidad</th><th style="text-align:center;">Porcentaje</th></tr>${filasEstado}</table>
              <h2>Novedades por tipo</h2>
              <table><tr><th>Tipo</th><th style="text-align:center;">Cantidad</th></tr>${filasNovedad}</table>
              <div class="footer">Documento generado por Aurora Dossier · ${fecha}</div>
            </body></html>`;

            await pdfService.generateAndShare(html);
        } catch (err) {
            console.error('GraficosScreen.exportarPdf:', err.message);
        } finally {
            setExportando(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando datos...</Text>
            </SafeAreaView>
        );
    }

    if (sinEmpresa) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={styles.emptyText}>No hay empresa vinculada a tu cuenta.</Text>
            </SafeAreaView>
        );
    }

    const barData = { labels: LABELS_DISPLAY, datasets: [{ data: conteosEstado }] };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Métricas de tu empresa</Text>
            </View>

            <View style={styles.metricsRow}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.metricCard, { backgroundColor: COLORS.primary }]}
                    onPress={() => navigation.navigate(ROUTES.INFORMES)}
                >
                    <Text style={styles.metricNumber}>{totalInformes}</Text>
                    <Text style={styles.metricLabel}>Total{'\n'}informes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.metricCard, { backgroundColor: '#f59e0b' }]}
                    onPress={() => navigation.navigate(ROUTES.NOVEDADES)}
                >
                    <Text style={styles.metricNumber}>{novedadesPend}</Text>
                    <Text style={styles.metricLabel}>Novedades{'\n'}pendientes</Text>
                </TouchableOpacity>
            </View>

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
                        showValuesOnTopOfBars
                        fromZero
                        withInnerLines={false}
                    />
                )}
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.INFORMES)} style={styles.linkBtn}>
                    <Text style={styles.linkBtnText}>Ver informes →</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Novedades por tipo</Text>
                {pieData.every(d => d.population === 0) ? (
                    <View style={styles.emptyPie}>
                        <Text style={styles.emptyText}>Sin novedades registradas</Text>
                    </View>
                ) : (
                    <PieChart
                        data={pieData}
                        width={screenWidth - 48}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="16"
                        style={styles.chart}
                    />
                )}
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.NOVEDADES)} style={styles.linkBtn}>
                    <Text style={styles.linkBtnText}>Ver novedades →</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.legendCard}>
                <Text style={styles.chartTitle}>Detalle por estado</Text>
                {ESTADOS.map((estado, i) => (
                    <View key={estado} style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: COLORES_ESTADO[i] }]} />
                        <Text style={styles.legendLabel}>{LABELS_DISPLAY[i]}</Text>
                        <Text style={styles.legendCount}>{conteosEstado[i]}</Text>
                        <Text style={styles.legendPercent}>
                            {totalInformes > 0 ? `${Math.round((conteosEstado[i] / totalInformes) * 100)}%` : '0%'}
                        </Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.exportBtn} activeOpacity={0.85} onPress={exportarPdf} disabled={exportando}>
                {exportando ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                    <>
                        <MaterialCommunityIcons name="file-pdf-box" size={20} color="#ffffff" />
                        <Text style={styles.exportBtnText}>Exportar reporte PDF</Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:     { flex: 1, backgroundColor: COLORS.background, padding: 16 },
    centered:      { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    loadingText:   { marginTop: 12, color: COLORS.textLight, fontSize: 14 },
    header:        { marginBottom: 20, marginTop: 8 },
    title:         { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
    subtitle:      { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
    metricsRow:    { flexDirection: 'row', gap: 12, marginBottom: 16 },
    metricCard:    { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
    metricNumber:  { fontSize: 40, fontWeight: 'bold', color: '#ffffff' },
    metricLabel:   { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: 'center' },
    chartCard:     { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3, alignItems: 'center' },
    chartTitle:    { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 16, alignSelf: 'flex-start' },
    chart:         { borderRadius: 12 },
    emptyPie:      { height: 120, justifyContent: 'center', alignItems: 'center' },
    emptyText:     { color: COLORS.textLight, fontSize: 14 },
    linkBtn:       { alignSelf: 'flex-end', paddingTop: 8 },
    linkBtnText:   { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
    legendCard:    { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
    legendRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
    legendDot:     { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
    legendLabel:   { flex: 1, fontSize: 14, color: COLORS.textLight },
    legendCount:   { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginRight: 12, minWidth: 20, textAlign: 'right' },
    legendPercent: { fontSize: 13, color: COLORS.primary, minWidth: 36, textAlign: 'right' },
    exportBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, marginBottom: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    exportBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});
