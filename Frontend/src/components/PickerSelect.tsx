import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

/** Selector de opciones con valores y callbacks del mismo tipo. */
interface Props<T extends string | number | null> {
  options?: { label: string; value: T }[];
  selectedValue: T;
  onValueChange: (value: T) => void;
}
export default function PickerSelect<T extends string | number | null>({ options = [], selectedValue, onValueChange }: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = String(selectedValue) === String(opt.value);
        return (
          <TouchableOpacity
            key={String(opt.value)}
            style={[styles.optionBtn, isSelected && styles.optionBtnActive]}
            onPress={() => onValueChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 4,
  },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
    marginBottom: 8,
  },
  optionBtnActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  optionText: {
    fontSize: 13,
    color: Colors.TEXT,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

