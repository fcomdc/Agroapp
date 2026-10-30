import { Image } from "react-native";

export default function BrandMark({ size = 88 }: { size?: number }) {
  return (
    <Image
      source={require("../../assets/logo.png")}
      resizeMode="contain"
      accessibilityLabel="Logotipo de AgroApp"
      accessible
      style={{ width: size, height: size }}
    />
  );
}
