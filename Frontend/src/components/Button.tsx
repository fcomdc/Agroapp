import { ActivityIndicator, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { palette } from '../theme/tokens';
interface Props {
  label: string; onPress: () => void; icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger';
}
export default function Button({ label, onPress, icon, loading, disabled, variant = 'primary' }: Props) {
  const light = variant !== 'primary';
  const color = variant === 'danger' ? palette.danger : light ? palette.forest : palette.paper;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={loading || disabled}
    onPress={onPress} style={({ pressed }) => [styles.button, light && styles.secondary, { opacity: pressed || disabled || loading ? 0.6 : 1 }]}>
    {loading ? <ActivityIndicator color={color} /> : icon ? <Ionicons name={icon} color={color} size={19} /> : null}
    <Text style={[styles.label, { color }]}>{label}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  button: { minHeight: 52, paddingVertical: 13, paddingHorizontal: 18, borderRadius: 14, backgroundColor: palette.forest, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9 },
  secondary: { backgroundColor: palette.pale, borderWidth: 1, borderColor: palette.line },
  label: { fontSize: 14, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
});
