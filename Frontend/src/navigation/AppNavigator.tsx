import type { RootStackParamList, TabParamList } from '../types/navigation';
import type { ComponentProps } from 'react';
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../utils/constants';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import BovinosListScreen from '../screens/BovinosListScreen';
import BovinoDetailScreen from '../screens/BovinoDetailScreen';
import BovinoFormScreen from '../screens/BovinoFormScreen';
import PesosScreen from '../screens/PesosScreen';
import PesoFormScreen from '../screens/PesoFormScreen';
import NfcScreen from '../screens/NfcScreen';
import VacunacionesListScreen from '../screens/VacunacionesListScreen';
import VacunacionFormScreen from '../screens/VacunacionFormScreen';
import ReportesSaludListScreen from '../screens/ReportesSaludListScreen';
import ReporteSaludFormScreen from '../screens/ReporteSaludFormScreen';
import ReporteSaludDetailScreen from '../screens/ReporteSaludDetailScreen';
import MasScreen from '../screens/MasScreen';
import UbicacionesScreen from '../screens/UbicacionesScreen';
import UbicacionFormScreen from '../screens/UbicacionFormScreen';
import ReproduccionesScreen from '../screens/ReproduccionesScreen';
import ReproduccionFormScreen from '../screens/ReproduccionFormScreen';
import PartosScreen from '../screens/PartosScreen';
import PartoFormScreen from '../screens/PartoFormScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import UsuarioFormScreen from '../screens/UsuarioFormScreen';

// Auth Screens


// Home Screens


// Bovinos Screens







// Salud Screens






// Más Screens










const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const commonScreenOptions: import('@react-navigation/stack').StackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.PRIMARY,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTintColor: Colors.WHITE,
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
};

// =====================================================
// Auth Stack
// =====================================================
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// =====================================================
// Home Stack
// =====================================================
const HomeStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: 'AgroApp' }}
    />
    <Stack.Screen
      name="BovinosList"
      component={BovinosListScreen}
      options={{ title: 'Bovinos' }}
    />
    <Stack.Screen
      name="BovinoForm"
      component={BovinoFormScreen}
      options={{ title: 'Nuevo Bovino' }}
    />
    <Stack.Screen
      name="ReporteSaludForm"
      component={ReporteSaludFormScreen}
      options={{ title: 'Nuevo Reporte de Salud' }}
    />
    <Stack.Screen name="BovinoDetail" component={BovinoDetailScreen} />
    <Stack.Screen name="Pesos" component={PesosScreen} />
    <Stack.Screen name="PesoForm" component={PesoFormScreen} />
    <Stack.Screen name="Nfc" component={NfcScreen} />
    <Stack.Screen name="VacunacionesList" component={VacunacionesListScreen} />
    <Stack.Screen name="VacunacionForm" component={VacunacionFormScreen} />
    <Stack.Screen name="ReportesSaludList" component={ReportesSaludListScreen} />
    <Stack.Screen name="ReporteSaludDetail" component={ReporteSaludDetailScreen} />
    <Stack.Screen name="Reproducciones" component={ReproduccionesScreen} />
    <Stack.Screen name="ReproduccionForm" component={ReproduccionFormScreen} />
  </Stack.Navigator>
);

// =====================================================
// Bovinos Stack
// =====================================================
const BovinosStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen
      name="BovinosList"
      component={BovinosListScreen}
      options={{ title: 'Inventario Bovino' }}
    />
    <Stack.Screen
      name="BovinosListScreen"
      component={BovinosListScreen}
      options={{ title: 'Inventario Bovino' }}
    />
    <Stack.Screen
      name="BovinoDetail"
      component={BovinoDetailScreen}
      options={{ title: 'Ficha del Bovino' }}
    />
    <Stack.Screen
      name="BovinoDetailScreen"
      component={BovinoDetailScreen}
      options={{ title: 'Ficha del Bovino' }}
    />
    <Stack.Screen
      name="BovinoForm"
      component={BovinoFormScreen}
      options={({ route }) => ({
        title: route.params?.bovino ? 'Editar Bovino' : 'Registrar Bovino',
      })}
    />
    <Stack.Screen
      name="BovinoFormScreen"
      component={BovinoFormScreen}
      options={({ route }) => ({
        title: route.params?.bovino ? 'Editar Bovino' : 'Registrar Bovino',
      })}
    />
    <Stack.Screen
      name="Pesos"
      component={PesosScreen}
      options={{ title: 'Control de Pesos' }}
    />
    <Stack.Screen
      name="PesosScreen"
      component={PesosScreen}
      options={{ title: 'Control de Pesos' }}
    />
    <Stack.Screen
      name="PesoForm"
      component={PesoFormScreen}
      options={{ title: 'Registrar Peso' }}
    />
    <Stack.Screen
      name="PesoFormScreen"
      component={PesoFormScreen}
      options={{ title: 'Registrar Peso' }}
    />
    <Stack.Screen
      name="Nfc"
      component={NfcScreen}
      options={{ title: 'Identificación NFC' }}
    />
    <Stack.Screen
      name="NfcScreen"
      component={NfcScreen}
      options={{ title: 'Identificación NFC' }}
    />
    <Stack.Screen
      name="VacunacionesList"
      component={VacunacionesListScreen}
      options={{ title: 'Vacunaciones' }}
    />
    <Stack.Screen
      name="ReportesSaludList"
      component={ReportesSaludListScreen}
      options={{ title: 'Historial de Salud' }}
    />
    <Stack.Screen
      name="Reproducciones"
      component={ReproduccionesScreen}
      options={{ title: 'Reproducciones' }}
    />
    <Stack.Screen name="VacunacionForm" component={VacunacionFormScreen} />
    <Stack.Screen name="ReporteSaludForm" component={ReporteSaludFormScreen} />
    <Stack.Screen name="ReporteSaludDetail" component={ReporteSaludDetailScreen} />
    <Stack.Screen name="ReproduccionForm" component={ReproduccionFormScreen} />
  </Stack.Navigator>
);

// =====================================================
// Salud Stack
// =====================================================
const SaludStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen
      name="SaludHome"
      component={ReportesSaludListScreen}
      options={{ title: 'Salud y Sanidad' }}
    />
    <Stack.Screen
      name="ReportesSaludList"
      component={ReportesSaludListScreen}
      options={{ title: 'Reportes de Salud' }}
    />
    <Stack.Screen
      name="ReporteSaludForm"
      component={ReporteSaludFormScreen}
      options={{ title: 'Reportar Síntomas' }}
    />
    <Stack.Screen
      name="ReporteSaludDetail"
      component={ReporteSaludDetailScreen}
      options={{ title: 'Detalle Clínico' }}
    />
    <Stack.Screen
      name="VacunacionesList"
      component={VacunacionesListScreen}
      options={{ title: 'Vacunas y Fármacos' }}
    />
    <Stack.Screen
      name="VacunacionForm"
      component={VacunacionFormScreen}
      options={{ title: 'Aplicar Vacuna' }}
    />
  </Stack.Navigator>
);

// =====================================================
// Más Stack
// =====================================================
const MasStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen
      name="MasHome"
      component={MasScreen}
      options={{ title: 'Opciones y Ajustes' }}
    />
    <Stack.Screen
      name="Ubicaciones"
      component={UbicacionesScreen}
      options={{ title: 'Ubicaciones y Potreros' }}
    />
    <Stack.Screen
      name="UbicacionForm"
      component={UbicacionFormScreen}
      options={({ route }) => ({
        title: route.params?.ubicacion ? 'Editar Ubicación' : 'Nueva Ubicación',
      })}
    />
    <Stack.Screen
      name="Reproducciones"
      component={ReproduccionesScreen}
      options={{ title: 'Control Reproductivo' }}
    />
    <Stack.Screen
      name="ReproduccionForm"
      component={ReproduccionFormScreen}
      options={{ title: 'Registrar Reproducción' }}
    />
    <Stack.Screen
      name="Partos"
      component={PartosScreen}
      options={{ title: 'Partos y Alumbramientos' }}
    />
    <Stack.Screen
      name="PartoForm"
      component={PartoFormScreen}
      options={{ title: 'Registrar Parto y Cría' }}
    />
    <Stack.Screen
      name="Usuarios"
      component={UsuariosScreen}
      options={{ title: 'Gestión de Personal' }}
    />
    <Stack.Screen
      name="UsuarioForm"
      component={UsuarioFormScreen}
      options={{ title: 'Crear Usuario' }}
    />
  </Stack.Navigator>
);

// =====================================================
// Main Tabs
// =====================================================
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: ComponentProps<typeof Ionicons>['name'];

        switch (route.name) {
          case 'Inicio':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Bovinos':
            iconName = focused ? 'paw' : 'paw-outline';
            break;
          case 'Salud':
            iconName = focused ? 'medkit' : 'medkit-outline';
            break;
          case 'Más':
            iconName = focused ? 'menu' : 'menu-outline';
            break;
          default:
            iconName = 'ellipse-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarInactiveTintColor: '#888',
      tabBarStyle: {
        backgroundColor: Colors.WHITE,
        borderTopColor: '#E0E0E0',
        elevation: 8,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Inicio" component={HomeStack} />
    <Tab.Screen name="Bovinos" component={BovinosStack} />
    <Tab.Screen name="Salud" component={SaludStack} />
    <Tab.Screen name="Más" component={MasStack} />
  </Tab.Navigator>
);

// =====================================================
// App Navigator (Raíz)
// =====================================================
export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
  },
});

