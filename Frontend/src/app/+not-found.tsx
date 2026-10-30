import { Link } from "expo-router";
import { Text } from "react-native";
import Screen from "../components/Screen";
import { ui } from "../theme/tokens";
export default function NotFound() {
  return (
    <Screen contentStyle={{ justifyContent: "center", padding: 24, gap: 20 }}>
      <Text style={ui.title}>No encontramos esta pantalla</Text>
      <Link href="/" style={ui.section}>
        Volver a mi finca
      </Link>
    </Screen>
  );
}
