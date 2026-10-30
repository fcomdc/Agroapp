import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, type PropsWithChildren } from "react";
import {
  initialWindowMetrics,
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, Text } from "react-native";
import { useAuthStore } from "../store/authStore";
import { palette } from "../theme/tokens";
import Button from "../components/Button";
import BrandMark from "../components/BrandMark";
import Screen from "../components/Screen";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.cream,
    card: palette.cream,
    primary: palette.forest,
    text: palette.ink,
    border: palette.line,
  },
};

function RootSafeArea({ children }: PropsWithChildren) {
  const insets = useContext(SafeAreaInsetsContext);
  // Expo Router supplies the root provider. Keep a fallback for isolated rendering.
  return insets ? (
    children
  ) : (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {children}
    </SafeAreaProvider>
  );
}

export { ErrorBoundary } from "expo-router";
function AppRoutes() {
  const { user, isLoading, error, initialize } = useAuthStore();
  useEffect(() => {
    void initialize();
  }, [initialize]);
  if (isLoading || error)
    return (
      <Screen
        contentStyle={{
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 24,
        }}
      >
        <BrandMark size={140} />
        {error ? (
          <>
            <Text style={{ color: palette.danger, textAlign: "center" }}>
              {error}
            </Text>
            <Button
              label="Volver a intentar"
              onPress={() => void initialize()}
            />
          </>
        ) : (
          <ActivityIndicator color={palette.forest} />
        )}
      </Screen>
    );
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.cream },
      }}
    >
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(private)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.cream }}>
      <RootSafeArea>
        <ThemeProvider value={theme}>
          <StatusBar style="dark" />
          <AppRoutes />
        </ThemeProvider>
      </RootSafeArea>
    </GestureHandlerRootView>
  );
}
