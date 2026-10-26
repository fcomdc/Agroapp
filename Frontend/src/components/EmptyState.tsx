import type { ComponentProps } from 'react';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/constants';

type IconName = ComponentProps<typeof Ionicons>['name'];
interface Props { icon?: IconName; title?: string; message?: string; description?: string; iconSize?: number; iconColor?: string; }





/**
 * Componente reutilizable para mostrar un estado vacío
 * @param {string} icon - Nombre del icono de Ionicons
 * @param {string} title - Título del mensaje
 * @param {string} message - Mensaje descriptivo
 * @param {number} iconSize - Tamaño del icono (por defecto 80)
 * @param {string} iconColor - Color del icono (por defecto Colors.LIGHT)
 */
const EmptyState = ({
  icon = 'file-tray-outline',
  title = 'Sin datos',
  message,
  description,
  iconSize = 80,
  iconColor = Colors.LIGHT,
}: Props) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message ?? description ?? 'No se encontraron registros'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.TEXT,
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;

