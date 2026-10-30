import { Tabs } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, palette, tabPalette } from "../../../theme/tokens";
import type { ComponentProps } from "react";

const icons: Record<string, ComponentProps<typeof Ionicons>["name"]> = {
  index: "home-outline",
  ganado: "albums-outline",
  salud: "heart-outline",
  gestion: "options-outline",
};
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const bottomPadding = Math.max(insets.bottom, 8);
  const contentHeight = Math.ceil(
    56 + 18 * Math.min(Math.max(fontScale, 1), 1.5)
  );

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: palette.cream },
        tabBarActiveTintColor: tabPalette.active,
        tabBarInactiveTintColor: tabPalette.inactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: tabPalette.background,
          borderTopColor: palette.line,
          height: contentHeight + bottomPadding,
          paddingTop: 6,
          paddingBottom: bottomPadding,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: styles.item,
        tabBarIconStyle: styles.iconSlot,
        tabBarIcon: ({ focused }) => (
          <View style={[styles.indicator, focused && styles.selected]}>
            <Ionicons
              name={icons[route.name]}
              size={24}
              color={focused ? tabPalette.active : tabPalette.inactive}
            />
          </View>
        ),
        tabBarLabel: ({ color, children }) => (
          <Text maxFontSizeMultiplier={1.5} style={[styles.label, { color }]}>
            {children}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Mi finca" }} />
      <Tabs.Screen name="ganado" options={{ title: "Ganado" }} />
      <Tabs.Screen
        name="salud"
        options={{
          title: "Salud",
          headerShown: true,
          headerTitle: "Cuaderno de salud",
          headerStyle: { backgroundColor: palette.cream },
          headerTintColor: palette.forest,
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen name="gestion" options={{ title: "Gestión" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  item: { paddingHorizontal: 0, opacity: 1 },
  iconSlot: { width: 60, height: 34 },
  indicator: {
    width: 56,
    height: 34,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { backgroundColor: tabPalette.indicator },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 3,
    flexShrink: 1,
  },
});
