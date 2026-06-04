import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, ScrollView,
    StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { useUser } from '../../context/UserContext';

const NAV_CARDS = [
    { label: 'Consultar\ninformes',  icon: 'file-document-outline',    color: '#EF5350', route: 'Carpetas',     permiso: 'ver_informes'   },
    { label: 'Consultar\nusuarios',  icon: 'account-group-outline',    color: '#4CAF50', route: 'Usuarios',     permiso: 'ver_usuarios'   },
    { label: 'Crear\nusuarios',      icon: 'account-plus-outline',     color: '#2456ee', route: 'CrearUsuario', permiso: 'crear_usuarios' },
    { label: 'Novedades',            icon: 'newspaper-variant-outline', color: '#F59E0B', route: 'Novedades',    permiso: 'ver_novedades'  },
    { label: 'Gráficos',             icon: 'chart-bar',                color: '#FF9800', route: 'Graficos',     permiso: 'ver_graficos'   },
    { label: 'Crear\ninforme',       icon: 'file-plus-outline',        color: '#2456ee', route: 'CrearInforme', permiso: 'crear_informes' },
];

const BOTTOM_NAV = [
    { icon: 'account-outline', active: true,  route: 'Home' },
    { icon: 'cog-outline',     active: false, route: 'Configuracion' },
    { icon: 'bell-outline',    active: false, route: 'Novedades' },
    { icon: 'folder-outline',  active: false, route: 'Carpetas' },
];

export default function HomeScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { userData, loading: userLoading } = useUser();

    const isAdmin      = userData?.tipo === 'admin';
    const visibleCards = NAV_CARDS.filter(card =>
        isAdmin || userData?.permisos?.[card.permiso] === true
    );

    if (userLoading || !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color="#2456ee" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                        <MaterialCommunityIcons name="menu" size={40} color="#5b5b5b" />
                    </TouchableOpacity>
                    <View style={styles.avatarWrapper}>
                        <Logo width={38} height={38} />
                    </View>
                </View>

                {/* Saludo con nombre real */}
                <Text style={styles.greeting}>
                    Hola, <Text style={styles.greetingHighlight}>{userData.nombre}</Text>
                </Text>
                <Text style={styles.subtitle}>Que deseas hacer?</Text>

                {/* Barra de búsqueda */}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                        placeholderTextColor="#9CA3AF"
                    />
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                </View>

                {/* Grid filtrado por permisos */}
                {visibleCards.length === 0 ? (
                    <View style={styles.noAccessBox}>
                        <MaterialCommunityIcons name="lock-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.noAccessText}>
                            No tienes funciones habilitadas.{'\n'}Contacta al administrador.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {visibleCards.map((card, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.card}
                                onPress={() => navigation.navigate(card.route)}
                                activeOpacity={0.75}
                            >
                                <MaterialCommunityIcons name={card.icon} size={46} color={card.color} />
                                <Text style={styles.cardLabel}>{card.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {BOTTOM_NAV.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.navItem}
                        onPress={() => {
                            if (item.route) {
                                navigation.navigate(item.route);
                            }
                        }}
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={28}
                            color={item.active ? '#2456ee' : '#5b5b5b'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:  { flex: 1, backgroundColor: '#f3f4f6' },
    centered:  { justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
    },
    avatarWrapper: {
        width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
        borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    },

    greeting:         { fontSize: 26, color: '#1A1A2E', marginBottom: 4 },
    greetingHighlight: { color: '#2456ee', fontWeight: 'bold' },
    subtitle:         { fontSize: 16, color: '#5b5b5b', marginBottom: 20 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 10,
        borderWidth: 1.5, borderColor: '#D1D5DB',
        paddingHorizontal: 14, height: 50, marginBottom: 24,
    },
    searchInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: {
        width: '47.5%', backgroundColor: '#FFFFFF',
        borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB',
        alignItems: 'center', justifyContent: 'center',
        paddingVertical: 22, paddingHorizontal: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    cardLabel: { marginTop: 10, fontSize: 12, color: '#374151', textAlign: 'center', lineHeight: 18 },

    noAccessBox: { alignItems: 'center', marginTop: 60, gap: 12 },
    noAccessText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },

    bottomNav: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E5E7EB',
        paddingTop: 12, paddingBottom: 28, paddingHorizontal: 20,
    },
    navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
