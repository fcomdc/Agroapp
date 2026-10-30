import { palette } from "../theme/tokens";
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value?: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

/**
 * Componente reutilizable de barra de búsqueda
 * @param {string} value - Valor actual del campo de búsqueda
 * @param {Function} onChangeText - Función al cambiar el texto
 * @param {string} placeholder - Texto de placeholder
 * @param {Function} onClear - Función al limpiar el campo (opcional)
 */
const SearchBar = ({
  value = "",
  onChangeText,
  placeholder = "Buscar...",
  onClear,
}: Props) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText("");
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color={palette.muted}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={[
            styles.clearButton,
            {
              minHeight: 44,
              minWidth: 40,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          accessibilityLabel="Limpiar búsqueda"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={20} color={palette.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.line,
    marginHorizontal: 22,
    marginVertical: 10,
    paddingHorizontal: 12,
    minHeight: 52,
    elevation: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    fontSize: 15,
    color: palette.ink,
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default SearchBar;
