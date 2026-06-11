import {
    Modal, View, Text, TouchableOpacity,
    StyleSheet, Dimensions, Animated,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { authService } from '../../services/authService';
import { useUser }     from '../../context/UserContext';
import { COLORS }      from '../../constants/colors';
import { ROUTES }      from '../../constants/routes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;
const BTN_W        = 40;

const ROL_LABEL = {
    admin:      'Administrador',
    supervisor: 'Supervisor',
    empleado:   'Empleado',
};

const MENU_ITEMS = [
    { label: 'Home',          icon: 'home-outline',   route: ROUTES.HOME          },
    { label: 'Editar datos',  icon: 'pencil-outline', route: ROUTES.EDITAR_DATOS  },
    { label: 'Subscripcion',  icon: 'star-outline',   route: ROUTES.SUSCRIPCION   },
    { label: 'Configuracion', icon: 'cog-outline',    route: ROUTES.CONFIGURACION },
];

export default function DrawerMenu({ visible, onClose, navigation }) {
    const { userData } = useUser();
    const slideAnim   = useRef(new Animated.Value(-(DRAWER_WIDTH + BTN_W))).current;

    useEffect(() => {
        if (visible) {
            slideAnim.setValue(-(DRAWER_WIDTH + BTN_W));
            Animated.spring(slideAnim, {
                toValue: 0, tension: 80, friction: 12, useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: -(DRAWER_WIDTH + BTN_W), duration: 220, useNativeDriver: true,
        }).start(() => onClose());
    };

    const handleNavigate = (route) => {
        handleClose();
        setTimeout(() => navigation.navigate(route), 240);
    };

    const handleLogout = async () => {
        handleClose();
        await authService.logout();
        setTimeout(() => navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] }), 240);
    };

    const nombre   = userData?.nombre ?? 'Usuario';
    const rolLabel = ROL_LABEL[userData?.rol] ?? userData?.rol ?? '';
    const email    = userData?.email ?? '';

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    onPress={handleClose}
                    activeOpacity={1}
                />
                <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.drawerContent}>
                        <View style={styles.drawerHeader}>
                            <MaterialCommunityIcons name="account-circle" size={80} color={COLORS.primary} />
                            <Text style={styles.userName}  numberOfLines={2}>{nombre}</Text>
                            <View style={styles.rolBadge}>
                                <Text style={styles.rolText}>{rolLabel}</Text>
                            </View>
                            <Text style={styles.userEmail} numberOfLines={1}>{email}</Text>
                        </View>

                        <View style={styles.menuList}>
                            {MENU_ITEMS.map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemDivider]}
                                    onPress={() => handleNavigate(item.route)}
                                >
                                    <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.primary} />
                                    <Text style={styles.menuItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <MaterialCommunityIcons name="exit-to-app" size={24} color={COLORS.danger} />
                            <Text style={styles.logoutText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                        <MaterialCommunityIcons name="chevron-left" size={22} color={COLORS.textLight} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
    drawer:        { position: 'absolute', left: 0, top: 0, bottom: 0, width: DRAWER_WIDTH + BTN_W, flexDirection: 'row' },
    drawerContent: { width: DRAWER_WIDTH, backgroundColor: COLORS.surface },

    drawerHeader: {
        backgroundColor: COLORS.background, paddingVertical: 28, paddingHorizontal: 20,
        alignItems: 'center', borderBottomWidth: 2, borderBottomColor: COLORS.primary,
    },
    userName:  { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginTop: 8, textAlign: 'center' },
    userEmail: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
    rolBadge:  { backgroundColor: COLORS.primaryLight, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
    rolText:   { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

    menuList:        { flex: 1, paddingTop: 6 },
    menuItem:        { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 20 },
    menuItemDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
    menuItemText:    { fontSize: 15, color: COLORS.textLight },

    logoutBtn:  { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
    logoutText: { fontSize: 15, color: COLORS.danger },

    closeBtn: {
        width: BTN_W, alignSelf: 'center', backgroundColor: COLORS.surface,
        borderTopRightRadius: 10, borderBottomRightRadius: 10,
        paddingVertical: 20, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
    },
});
