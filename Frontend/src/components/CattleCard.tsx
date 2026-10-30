import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { palette } from "../theme/tokens";
import type { Bovino } from "../types/models";

export default function CattleCard({
  bovino,
  index = 0,
}: {
  bovino: Bovino;
  index?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ficha de ${bovino.Nombre || bovino.Codigo}`}
      onPress={() =>
        router.push({
          pathname: "/bovinos/[id]",
          params: { id: bovino.IdBovino },
        })
      }
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: index % 2 ? palette.sand : palette.pale },
        ]}
      >
        <MaterialCommunityIcons
          name="cow"
          size={34}
          color={index % 2 ? palette.clay : palette.green}
        />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.code}>{bovino.Codigo}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {bovino.Nombre || "Sin nombre"}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {bovino.Sexo === "H" ? "Hembra" : "Macho"} ·{" "}
          {bovino.Raza || "Raza sin registrar"}
        </Text>
        {bovino.NombreUbicacion ? (
          <Text style={styles.location} numberOfLines={1}>
            <Ionicons name="location-outline" size={11} />{" "}
            {bovino.NombreUbicacion}
          </Text>
        ) : null}
      </View>
      <View style={{ alignItems: "flex-end", gap: 15 }}>
        <View
          style={[
            styles.dot,
            bovino.Estado !== "Activo" && { backgroundColor: palette.clay },
          ]}
        />
        <Ionicons name="arrow-forward" color={palette.muted} size={18} />
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderColor: palette.line,
  },
  avatar: {
    width: 68,
    height: 76,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    color: palette.muted,
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "600",
  },
  name: { color: palette.ink, fontSize: 18, fontWeight: "600" },
  meta: { color: palette.muted, fontSize: 12 },
  location: { color: palette.green, fontSize: 11, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.green },
});
