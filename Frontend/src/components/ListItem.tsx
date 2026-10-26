import type { ComponentProps } from 'react';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/constants';

type IconName = ComponentProps<typeof Ionicons>['name'];
interface Props { title: string; subtitle?: string; rightText?: string; icon?: IconName; iconColor?: string; showArrow?: boolean; onPress?: () => void; badge?: string; badgeColor?: string; }





/**
 * Componente reutilizable de elemento de lista
 * @param {string} title - Título principal
 * @param {string} subtitle - Subtítulo o descripción
 * @param {string} rightText - Texto a la derecha (opcional)
 * @param {string} icon - Nombre del icono izquierdo (opcional)
 * @param {string} iconColor - Color del icono izquierdo
 * @param {boolean} showArrow - Mostrar flecha derecha
 * @param {Function} onPress - Función al presionar
 * @param {string} badge - Texto de badge/etiqueta (opcional)
 * @param {string} badgeColor - Color de fondo del badge
 */
const ListItem = ({
  title,
  subtitle,
  rightText,
  icon,
  iconColor = Colors.PRIMARY,
  showArrow = true,
  onPress,
  badge,
  badgeColor = Colors.SECONDARY,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.rightSection}>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        {rightText ? (
          <Text style={styles.rightText}>{rightText}</Text>
        ) : null}
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color={Colors.TEXT_LIGHT} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.TEXT,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.TEXT_LIGHT,
    marginTop: 3,
    lineHeight: 18,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    fontSize: 13,
    color: Colors.TEXT_LIGHT,
    marginRight: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.WHITE,
  },
});

export default ListItem;

