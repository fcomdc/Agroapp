import { useCallback, useContext, useRef, useSyncExternalStore, type ComponentRef, type PropsWithChildren } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, type ScrollViewProps } from 'react-native';
import { HeaderShownContext, useHeaderHeight } from 'expo-router/react-navigation';
import { BottomTabBarHeightContext } from 'expo-router/js-tabs';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormHeaderHeightContext } from '../context/FormLayoutContext';
import Screen from './Screen';

function subscribeKeyboard(onChange: () => void) {
  const show = Keyboard.addListener('keyboardDidShow', onChange);
  const hide = Keyboard.addListener('keyboardDidHide', onChange);
  return () => { show.remove(); hide.remove(); };
}
const getKeyboardVisible = () => Keyboard.isVisible();
const getServerKeyboardVisible = () => false;

export default function FormScreen({ children, contentContainerStyle, style, ...props }: PropsWithChildren<ScrollViewProps>) {
  const headerHeight = useHeaderHeight();
  const headerShown = useContext(HeaderShownContext);
  const customHeaderHeight = useContext(FormHeaderHeightContext);
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const insets = useSafeAreaInsets();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const keyboardVisible = useSyncExternalStore(subscribeKeyboard, getKeyboardVisible, getServerKeyboardVisible);
  const isSheet = customHeaderHeight > 0;
  const content = StyleSheet.flatten(contentContainerStyle);
  const spacing = content?.paddingBottom ?? content?.paddingVertical ?? content?.padding;
  const bottomPadding = Math.max(typeof spacing === 'number' ? spacing : 0, 32);

  useFocusEffect(useCallback(() => {
    if (Platform.OS !== 'android') return;
    let frame = 0;
    const show = Keyboard.addListener('keyboardDidShow', () => {
      frame = requestAnimationFrame(() => {
        const input = TextInput.State.currentlyFocusedInput();
        if (input) scroll.current?.scrollResponderScrollNativeHandleToKeyboard(input, 20, true);
      });
    });
    return () => { show.remove(); cancelAnimationFrame(frame); };
  }, []));

  return <Screen includeBottomInset={false} edges={isSheet ? [] : undefined}>
    <KeyboardAvoidingView style={styles.fill}
      behavior={Platform.OS === 'ios' && !isSheet ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight + (!headerShown && !isSheet ? insets.top : 0)}>
      <ScrollView {...props} ref={scroll} style={[styles.fill, style]}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="never" automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios' && isSheet}
        contentContainerStyle={[styles.content, contentContainerStyle, { paddingBottom: bottomPadding + (tabBarHeight === undefined && !keyboardVisible ? insets.bottom : 0) }]}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </Screen>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0 },
  content: { width: '100%', maxWidth: 880, alignSelf: 'center' },
});
