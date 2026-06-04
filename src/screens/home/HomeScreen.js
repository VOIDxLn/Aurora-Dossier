import {
    View, Text, StyleSheet, TextInput,
    SafeAreaView, StatusBar, ActivityIndicator, ScrollView, TouchableOpacity
} from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { useUser } from '../../context/UserContext';
import NavCard from '../../components/NavCard';
import BottomNavItem from '../../components/BottomNavItem';
import { MENU_CARDS, BOTTOM_NAV_CONFIG } from '../../config/navigationConfig';

export default function HomeScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { userData, loading: userLoading } = useUser();
    const [activeNav, setActiveNav] = useState(null);

    if (userLoading || !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color="#2456ee" />
            </SafeAreaView>
        );
    }

    const userRole = userData.tipo || 'empleado';
    const userPermisos = userData.permisos || {};

    const visibleCards = MENU_CARDS.filter(card => {
        if (!card.roles.includes(userRole)) return false;
        if (userRole === 'admin') return true;
        if (card.permiso) {
            return userPermisos[card.permiso] === true;
        }
        return true;
    });

    const bottomNavItems = BOTTOM_NAV_CONFIG[userRole] || [];

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

                {/* Saludo */}
                <Text style={styles.greeting}>
                    Hola, <Text style={styles.greetingHighlight}>{userData.nombre}</Text>
                </Text>
                <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>

                {/* Barra de búsqueda */}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                        placeholderTextColor="#9CA3AF"
                    />
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                </View>

                {/* Grid */}
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
                            <NavCard
                                key={i}
                                card={card}
                                onPress={() => {
                                    if (card.route) {
                                        navigation.navigate(card.route);
                                    }
                                }}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {bottomNavItems.map((item, i) => (
                    <BottomNavItem
                        key={i}
                        item={item}
                        active={activeNav === i || (activeNav === null && item.route === 'Home')}
                        onPress={() => {
                            setActiveNav(i);
                            if (item.route) {
                                navigation.navigate(item.route);
                            }
                        }}
                    />
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
        backgroundColor: '#FFFFFF', borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        paddingHorizontal: 14, height: 50, marginBottom: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    searchInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

    noAccessBox: { alignItems: 'center', marginTop: 60, gap: 12 },
    noAccessText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },

    bottomNav: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E5E7EB',
        paddingTop: 12, paddingBottom: 28, paddingHorizontal: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 10,
    },
});
