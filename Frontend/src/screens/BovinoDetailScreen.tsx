import type { ComponentProps, ReactNode } from 'react';
import type { Bovino } from '../types/models';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import { calcularEdad } from '../utils/helpers';
import { BovinosDB } from '../database/BovinosDB';

const STATUS_COLORS: Record<string, string> = {
  Activo: COLORS.PRIMARY,
  Vendido: COLORS.INFO,
  Fallecido: COLORS.DANGER,
  Trasladado: COLORS.WARNING,
};

export default function BovinoDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'BovinoDetail'>>();
  const id = route.params?.id;
  const [bovino, setBovino] = useState<Bovino | null>(null);

  const loadBovino = useCallback(async () => {
    try {
      const data = await BovinosDB.getById(id);
      setBovino(data);
    } catch (e) {
      console.log('Error loading bovino:', e);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadBovino();
    }, [loadBovino])
  );

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de que desea eliminar este bovino? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await BovinosDB.delete(id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el bovino');
            }
          },
        },
      ]
    );
  };

  const sectionButtons: { title: string; icon: ComponentProps<typeof Ionicons>['name']; screen: 'Pesos' | 'VacunacionesList' | 'ReportesSaludList' | 'Reproducciones' | 'Nfc'; params: { IdBovino: number; codigo?: string } }[] = [
    { title: 'Pesos', icon: 'scale', screen: 'Pesos', params: { IdBovino: id, codigo: bovino?.Codigo } },
    { title: 'Vacunas', icon: 'medkit', screen: 'VacunacionesList', params: { IdBovino: id } },
    { title: 'Salud', icon: 'heart', screen: 'ReportesSaludList', params: { IdBovino: id } },
    { title: 'Reproducción', icon: 'git-merge', screen: 'Reproducciones', params: { IdBovino: id } },
    { title: 'NFC Tags', icon: 'radio', screen: 'Nfc', params: { IdBovino: id, codigo: bovino?.Codigo } },
  ];

  if (!bovino) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const edad = bovino.FechaNacimiento ? calcularEdad(bovino.FechaNacimiento) : 'Desconocida';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Main Info Card */}
      <View style={styles.mainCard}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="paw" size={36} color={COLORS.PRIMARY} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.codigo}>{bovino.Codigo}</Text>
            {bovino.Nombre ? <Text style={styles.nombre}>{bovino.Nombre}</Text> : null}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: (STATUS_COLORS[bovino.Estado] || COLORS.TEXT_LIGHT) + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: STATUS_COLORS[bovino.Estado] || COLORS.TEXT_LIGHT },
              ]}
            >
              {bovino.Estado || 'Activo'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <InfoRow icon="male-female" label="Sexo" value={bovino.Sexo === 'M' ? 'Macho' : 'Hembra'} />
          <InfoRow icon="calendar" label="Fecha Nacimiento" value={bovino.FechaNacimiento || 'No registrada'} />
          <InfoRow icon="time" label="Edad" value={edad} />
          <InfoRow icon="pricetag" label="Raza" value={bovino.Raza || 'No especificada'} />
          <InfoRow icon="color-palette" label="Color" value={bovino.Color || 'No especificado'} />
          <InfoRow icon="location" label="Ubicación" value={bovino.NombreUbicacion || bovino.IdUbicacion || 'No asignada'} />
        </View>

        {bovino.Observaciones ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.obsLabel}>Observaciones</Text>
            <Text style={styles.obsText}>{bovino.Observaciones}</Text>
          </>
        ) : null}
      </View>

      {/* Section Buttons */}
      <Text style={styles.sectionTitle}>Gestión</Text>
      <View style={styles.sectionsGrid}>
        {sectionButtons.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sectionButton}
            onPress={() => navigation.navigate(section.screen, section.params)}
            activeOpacity={0.7}
          >
            <Ionicons name={section.icon} size={24} color={COLORS.PRIMARY} />
            <Text style={styles.sectionButtonText}>{section.title}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('BovinoForm', { bovino })}
          activeOpacity={0.7}
        >
          <Ionicons name="create" size={20} color={COLORS.WHITE} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={20} color={COLORS.DANGER} />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: ComponentProps<typeof Ionicons>['name']; label: string; value: ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.SECONDARY} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
  },
  mainCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerInfo: {
    flex: 1,
  },
  codigo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  nombre: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  infoGrid: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIcon: {
    marginRight: 8,
    width: 22,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    width: 130,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontWeight: '500',
    flex: 1,
  },
  obsLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
    marginBottom: 4,
  },
  obsText: {
    fontSize: 14,
    color: COLORS.TEXT,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionsGrid: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionButtonText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT,
    marginLeft: 14,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  editButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.DANGER,
  },
  deleteButtonText: {
    color: COLORS.DANGER,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

