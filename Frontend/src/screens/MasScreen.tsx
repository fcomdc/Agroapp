import type { ComponentProps } from 'react';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const MenuItem = ({ icon, title, subtitle, onPress, color = Colors.PRIMARY }: { icon: ComponentProps<typeof Ionicons>['name']; title: string; subtitle?: string; onPress: () => void; color?: string }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
  </TouchableOpacity>
);

export default function MasScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const isAdmin = user?.rol === 'Administrador' || user?.Rol === 'Administrador';

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro de que desea salir de su cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Perfil del Usuario */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#FFF" />
        </View>
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={styles.userName}>{user?.NombreCompleto || user?.nombre_completo || 'Usuario AgroApp'}</Text>
          <Text style={styles.userRole}>Rol: {user?.Rol || user?.rol || 'Trabajador'}</Text>
          <Text style={styles.userNick}>@{user?.Usuario || user?.usuario || 'usuario'}</Text>
        </View>
      </View>

      {/* Sección Gestión */}
      <Text style={styles.sectionHeader}>Gestión de Campo</Text>
      <View style={styles.sectionCard}>
        <MenuItem
          icon="location-outline"
          title="Ubicaciones y Potreros"
          subtitle="Corrales, lotes, pasturas y establos"
          onPress={() => navigation.navigate('Ubicaciones')}
        />
        <View style={styles.divider} />
        <MenuItem
          icon="heart-outline"
          title="Reproducción Bovina"
          subtitle="Montas naturales e inseminaciones"
          onPress={() => navigation.navigate('Reproducciones')}
        />
        <View style={styles.divider} />
        <MenuItem
          icon="leaf-outline"
          title="Control de Partos y Crías"
          subtitle="Registro de nacimientos y crías"
          onPress={() => navigation.navigate('Partos')}
        />
      </View>

      {/* Sección Administración */}
      {isAdmin && (
        <>
          <Text style={styles.sectionHeader}>Administración del Sistema</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="people-outline"
              title="Gestión de Usuarios"
              subtitle="Cuentas de administradores, trabajadores y veterinarios"
              onPress={() => navigation.navigate('Usuarios')}
            />
          </View>
        </>
      )}

      {/* Sesión */}
      <Text style={styles.sectionHeader}>Cuenta</Text>
      <View style={styles.sectionCard}>
        <MenuItem
          icon="log-out-outline"
          title="Cerrar Sesión"
          subtitle="Salir de la aplicación en este dispositivo"
          color={Colors.DANGER}
          onPress={handleLogout}
        />
      </View>

      {/* Tarjeta Acerca de */}
      <View style={styles.aboutCard}>
        <Ionicons name="leaf" size={36} color={Colors.PRIMARY} style={{ marginBottom: 6 }} />
        <Text style={styles.aboutTitle}>AgroApp</Text>
        <Text style={styles.aboutDesc}>Gestión Ganadera Inteligente con Tecnología NFC</Text>
        <Text style={styles.versionText}>Versión 1.0.0 • SQLite Offline</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  aboutCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    elevation: 2,
  },
  aboutLogo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  aboutDesc: {
    fontSize: 12,
    color: Colors.TEXT_LIGHT,
    marginTop: 2,
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 17, fontWeight: 'bold', color: Colors.TEXT },
  userRole: { fontSize: 13, color: Colors.PRIMARY, fontWeight: '600', marginTop: 2 },
  userNick: { fontSize: 12, color: Colors.TEXT_LIGHT, marginTop: 1 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.TEXT_LIGHT,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: Colors.TEXT },
  menuSubtitle: { fontSize: 12, color: Colors.TEXT_LIGHT, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 68 },
  versionText: { textAlign: 'center', color: '#9E9E9E', fontSize: 12, marginTop: 10, marginBottom: 20 },
});

