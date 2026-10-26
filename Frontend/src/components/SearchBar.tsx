import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/constants';

interface Props { value?: string; onChangeText: (value: string) => void; placeholder?: string; onClear?: () => void; }





/**
 * Componente reutilizable de barra de búsqueda
 * @param {string} value - Valor actual del campo de búsqueda
 * @param {Function} onChangeText - Función al cambiar el texto
 * @param {string} placeholder - Texto de placeholder
 * @param {Function} onClear - Función al limpiar el campo (opcional)
 */
const SearchBar = ({
  value = '',
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
}: Props) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={Colors.TEXT_LIGHT} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.TEXT_LIGHT}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={Colors.TEXT_LIGHT} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.TEXT,
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default SearchBar;

