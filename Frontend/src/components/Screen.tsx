import { useContext } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { HeaderShownContext } from 'expo-router/react-navigation';
import { BottomTabBarHeightContext } from 'expo-router/js-tabs';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';
import { ui } from '../theme/tokens';

interface Props extends SafeAreaViewProps {
  includeBottomInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function Screen({ children, style, contentStyle, edges, includeBottomInset = true, ...props }: Props) {
  const headerShown = useContext(HeaderShownContext);
  const tabBarHeight = useContext(BottomTabBarHeightContext);

  return <SafeAreaView {...props} style={[ui.page, style]} edges={edges ?? {
    top: headerShown ? 'off' : 'additive',
    bottom: includeBottomInset && tabBarHeight === undefined ? 'additive' : 'off',
    left: 'additive',
    right: 'additive',
  }}>
    <View style={[styles.content, contentStyle]}>{children}</View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ content: { flex: 1, minHeight: 0 } });
