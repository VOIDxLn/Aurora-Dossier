import {
    View, Text, StyleSheet, TextInput, StatusBar, Pressable,
    Animated, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { useUser } from '../../context/UserContext';

/* ─── Cards del empleado (según Figma) ─── */
const CARDS = [
    {
        label: 'Crear informe',
        icon: 'file-plus-outline',
        color: '#2456ee',
        bg: '#EFF6FF',
        route: 'CrearInforme',
    },
    {
        label: 'Gestionar\ninforme',
        icon: 'paperclip',
        color: '#EF5350',
        bg: '#FFF5F5',
        route: 'Carpetas',
    },
    {
        label: 'Historial',
        icon: 'folder-open-outline',
        color: '#F59E0B',
        bg: '#FFFBEB',
        route: 'Carpetas',
    },
    {
        label: 'Pendientes',
        icon: 'clipboard-list-outline',
        color: '#FF9800',
        bg: '#FFF8F0',
        route: 'Novedades',
    },
];

/* ─── Bottom nav (según Figma) ─── */
const BOTTOM_NAV = [
    { icon: 'account-outline',    label: 'Perfil',         route: 'Configuracion' },
    { icon: 'cog-outline',        label: 'Configuración',  route: 'Configuracion' },
    { icon: 'bell-outline',       label: 'Notificaciones', route: null            },
    { icon: 'folder-outline',     label: 'Archivos',       route: 'Carpetas'      },
];

/* ─── Card con animación de press ─── */
function NavCard({ card, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.94,
            useNativeDriver: true,
            speed: 40,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}
        >
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <View style={[styles.iconWrapper, { backgroundColor: card.bg }]}>
                    <MaterialCommunityIcons name={card.icon} size={36} color={card.color} />
                </View>
                <Text style={styles.cardLabel}>{card.label}</Text>
            </Animated.View>
        </Pressable>
    );
}

/* ─── Bottom nav item con animación ─── */
function BottomNavItem({ item, active, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50 }),
            Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 25, bounciness: 10 }),
        ]).start();
        onPress?.();
    };

    return (
        <Pressable style={styles.navItem} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
                <MaterialCommunityIcons
                    name={item.icon}
                    size={26}
                    color={active ? '#2456ee' : '#9CA3AF'}
                />
            </Animated.View>
        </Pressable>
    );
}

/* ─── Pantalla principal ─── */
export default function HomeEmpleadoScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [activeNav, setActiveNav]         = useState(0);
    const { userData, loading: userLoading } = useUser();

    const handleCardPress = useCallback((route) => {
        if (route) navigation.navigate(route);
    }, [navigation]);

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

            {/* ── Contenido scrollable ── */}
            <View style={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => setDrawerVisible(true)}
                        style={({ pressed }) => pressed && styles.headerBtnPressed}
                    >
                        <MaterialCommunityIcons name="menu" size={38} color="#5b5b5b" />
                    </Pressable>
                    <View style={styles.avatarWrapper}>
                        <Logo width={36} height={36} />
                    </View>
                </View>

                {/* Saludo */}
                <Text style={styles.greeting}>
                    Hola, <Text style={styles.greetingHighlight}>{userData.nombre}</Text>
                </Text>
                <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>

                {/* Buscador */}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                        placeholderTextColor="#9CA3AF"
                    />
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                </View>

                {/* Grid 2×2 */}
                <View style={styles.grid}>
                    {CARDS.map((card, i) => (
                        <NavCard
                            key={i}
                            card={card}
                            onPress={() => handleCardPress(card.route)}
                        />
                    ))}
                </View>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {BOTTOM_NAV.map((item, i) => (
                    <BottomNavItem
                        key={i}
                        item={item}
                        active={activeNav === i}
                        onPress={() => {
                            setActiveNav(i);
                            if (item.route) navigation.navigate(item.route);
                        }}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

/* ─── Estilos ─── */
const styles = StyleSheet.create({
    safeArea:  { flex: 1, backgroundColor: '#f3f4f6' },
    centered:  { justifyContent: 'center', alignItems: 'center' },

    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 90,      // espacio para la barra inferior
    },

    /* Header */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },
    avatarWrapper: {
        width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
        borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff',
    },
    headerBtnPressed: { opacity: 0.5 },

    /* Saludo */
    greeting:          { fontSize: 26, color: '#1A1A2E', marginBottom: 2 },
    greetingHighlight: { color: '#2456ee', fontWeight: 'bold' },
    subtitle:          { fontSize: 15, color: '#5b5b5b', marginBottom: 20 },

    /* Buscador */
    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        paddingHorizontal: 14, height: 50, marginBottom: 28,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    searchInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

    /* Grid */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },

    /* Card */
    cardPressable: { width: '47.5%' },
    cardPressed:   {},
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 26,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    iconWrapper: {
        width: 64, height: 64, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 19,
    },

    /* Bottom Navigation */
    bottomNav: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E5E7EB',
        paddingTop: 12, paddingBottom: 28, paddingHorizontal: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 10,
    },
    navItem: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
    },
});
