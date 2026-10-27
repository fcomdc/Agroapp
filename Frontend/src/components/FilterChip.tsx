import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { palette } from '../theme/tokens';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
}
export default function FilterChip({ label, selected, onPress, icon }: Props) {
  const color = selected ? palette.paper : palette.green;
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ selected }} onPress={onPress}
    style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && { opacity: 0.7 }]}>
    {icon ? <Ionicons name={icon} size={17} color={color} /> : null}
    <Text style={[styles.label, { color }]}>{label}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  chip: { minHeight: 44, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 14, backgroundColor: palette.pale, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  selected: { backgroundColor: palette.forest },
  label: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
});
