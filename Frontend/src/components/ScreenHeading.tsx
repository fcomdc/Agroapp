import { View, Text } from 'react-native';
import { ui } from '../theme/tokens';
import type { ReactNode } from 'react';
export default function ScreenHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <View style={{ gap: 8 }}><Text style={ui.eyebrow}>{eyebrow}</Text><View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={[ui.title, { flex: 1 }]}>{title}</Text>{action}</View>{subtitle ? <Text style={ui.subtitle}>{subtitle}</Text> : null}</View>;
}
