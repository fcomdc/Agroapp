import type { ComponentProps } from 'react';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/constants';

type IconName = ComponentProps<typeof Ionicons>['name'];
interface Props { icon?: IconName; title?: string; value?: string | number; color?: string; onPress?: () => void; }





/**
 * Componente de tarjeta de estadísticas para el dashboard
 * @param {string} icon - Nombre del icono de Ionicons
 * @param {string} title - Título de la estadística
 * @param {string|number} value - Valor de la estadística
 * @param {string} color - Color del icono y acentos
 * @param {Function} onPress - Función al presionar la tarjeta (opcional)
 */
const StatCard = ({
  icon = 'stats-chart',
  title = '',
  value = '0',
  color = Colors.PRIMARY,
  onPress,
}: Props) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.TEXT,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 17,
  },
});

export default StatCard;

