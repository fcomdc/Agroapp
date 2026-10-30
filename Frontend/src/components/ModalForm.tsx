import { useState, type PropsWithChildren } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { router, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FormHeaderHeightContext } from "../context/FormLayoutContext";
import { palette } from "../theme/tokens";
import Screen from "./Screen";

interface Props extends PropsWithChildren {
  title: string;
  fallback: Href;
}
export default function ModalForm({ title, fallback, children }: Props) {
  const [headerHeight, setHeaderHeight] = useState(64);
  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  };
  return (
    <Screen style={styles.container} includeBottomInset={false}>
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Text style={styles.title}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar formulario"
          onPress={close}
          hitSlop={6}
          style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="close" size={23} color={palette.forest} />
        </Pressable>
      </View>
      <FormHeaderHeightContext.Provider value={headerHeight}>
        {children}
      </FormHeaderHeightContext.Provider>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  header: {
    minHeight: 64,
    paddingLeft: 22,
    paddingRight: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderColor: palette.line,
  },
  title: { flex: 1, color: palette.ink, fontSize: 17, fontWeight: "600" },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.pale,
    alignItems: "center",
    justifyContent: "center",
  },
});
