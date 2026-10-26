import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

interface Props { message?: string; size?: 'small' | 'large'; color?: string; fullScreen?: boolean; }




/**
 * Componente reutilizable de indicador de carga
 * @param {string} message - Mensaje a mostrar debajo del spinner
 * @param {string} size - Tamaño del spinner ('small' o 'large')
 * @param {string} color - Color del spinner
 * @param {boolean} fullScreen - Si ocupa toda la pantalla
 */
const LoadingSpinner = ({
  message = 'Cargando...',
  size = 'large',
  color = Colors.PRIMARY,
  fullScreen = true,
}: Props) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
  },
});

export default LoadingSpinner;

