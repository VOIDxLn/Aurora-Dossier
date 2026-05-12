import {
    Modal, View, Text, TouchableOpacity,
    StyleSheet, Dimensions, Animated,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;
const BTN_W = 40;

const ROL_LABEL = {
    admin:      'Administrador',
    supervisor: 'Supervisor',
    empleado:   'Empleado',
};

const MENU_ITEMS = [
    { label: 'Home',          icon: 'home-outline',   route: 'Home'         },
    { label: 'Editar datos',  icon: 'pencil-outline', route: 'EditarDatos'  },
    { label: 'Subscripcion',  icon: 'star-outline',   route: 'Suscripcion'  },
    { label: 'Configuracion', icon: 'cog-outline',    route: 'Configuracion'},
];

export default function DrawerMenu({ visible, onClose, navigation }) {
    const { userData } = useUser();
    const slideAnim   = useRef(new Animated.Value(-(DRAWER_WIDTH + BTN_W))).current;

    useEffect(() => {
        if (visible) {
            slideAnim.setValue(-(DRAWER_WIDTH + BTN_W));
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 80,
                friction: 12,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: -(DRAWER_WIDTH + BTN_W),
            duration: 220,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const handleNavigate = (route) => {
        handleClose();
        setTimeout(() => navigation.navigate(route), 240);
    };

    const handleLogout = async () => {
        handleClose();
        await supabase.auth.signOut();
        setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }), 240);
    };

    const nombre   = userData?.nombre ?? 'Usuario';
    const rolLabel = ROL_LABEL[userData?.rol] ?? userData?.rol ?? '';
    const email    = userData?.email ?? '';

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
            <View style={styles.overlay}>

                {/* Panel */}
                <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>

                    <View style={styles.drawerContent}>
                        {/* Cabecera */}
                        <View style={styles.drawerHeader}>
                            <MaterialCommunityIcons name="account-circle" size={80} color="#2456ee" />
                            <Text style={styles.userName} numberOfLines={2}>{nombre}</Text>
                            <View style={styles.rolBadge}>
                                <Text style={styles.rolText}>{rolLabel}</Text>
                            </View>
                            <Text style={styles.userEmail} numberOfLines={1}>{email}</Text>
                        </View>

                        {/* Opciones */}
                        <View style={styles.menuList}>
                            {MENU_ITEMS.map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.menuItem,
                                        i < MENU_ITEMS.length - 1 && styles.menuItemDivider,
                                    ]}
                                    onPress={() => handleNavigate(item.route)}
                                >
                                    <MaterialCommunityIcons name={item.icon} size={24} color="#2456ee" />
                                    <Text style={styles.menuItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Cerrar sesión */}
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <MaterialCommunityIcons name="exit-to-app" size={24} color="#EF5350" />
                            <Text style={styles.logoutText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botón "<" lateral */}
                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                        <MaterialCommunityIcons name="chevron-left" size={22} color="#5b5b5b" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Overlay oscuro */}
                <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} activeOpacity={1} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
    drawer:  { flexDirection: 'row' },

    drawerContent: { width: DRAWER_WIDTH, backgroundColor: '#fff' },

    drawerHeader: {
        backgroundColor: '#f3f4f6',
        paddingVertical: 28, paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 2, borderBottomColor: '#2456ee',
    },
    userName:  { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginTop: 8, textAlign: 'center' },
    userEmail: { fontSize: 11, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
    rolBadge:  { backgroundColor: '#EFF6FF', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
    rolText:   { fontSize: 12, color: '#2456ee', fontWeight: '600' },

    menuList: { flex: 1, paddingTop: 6 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        gap: 14, paddingVertical: 15, paddingHorizontal: 20,
    },
    menuItemDivider: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    menuItemText:    { fontSize: 15, color: '#5b5b5b' },

    logoutBtn: {
        flexDirection: 'row', alignItems: 'center',
        gap: 14, paddingVertical: 18, paddingHorizontal: 20,
        borderTopWidth: 1, borderTopColor: '#F3F4F6',
    },
    logoutText: { fontSize: 15, color: '#EF5350' },

    closeBtn: {
        width: BTN_W, alignSelf: 'center',
        backgroundColor: '#fff',
        borderTopRightRadius: 10, borderBottomRightRadius: 10,
        paddingVertical: 20, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
    },
});
