import { Platform, TurboModuleRegistry } from "react-native";
let scanning = false;
let generation = 0;
let activeManager: typeof import("react-native-nfc-manager").default | null =
  null;
let requesting = false;
export async function readTagUid(): Promise<string> {
  if (!TurboModuleRegistry.get("NfcManager"))
    throw new Error(
      "No se pudo iniciar la lectura. Busca el bovino por su nombre o código."
    );
  if (scanning) throw new Error("Ya hay una lectura en curso.");
  scanning = true;
  const current = ++generation;
  let attempted = false;
  const ensureActive = () => {
    if (current !== generation) throw new Error("Lectura cancelada.");
  };
  try {
    const { default: manager, NfcTech } =
      await import("react-native-nfc-manager");
    activeManager = manager;
    if (!(await manager.isSupported()))
      throw new Error("Este teléfono no cuenta con un lector NFC compatible.");
    await manager.start();
    if (Platform.OS === "android" && !(await manager.isEnabled()))
      throw new Error(
        "Activa NFC en los ajustes del teléfono y vuelve a intentar."
      );
    ensureActive();
    attempted = true;
    requesting = true;
    await manager.requestTechnology(
      Platform.OS === "android"
        ? [NfcTech.NfcA, NfcTech.NfcV, NfcTech.Ndef]
        : [NfcTech.MifareIOS, NfcTech.Iso15693IOS, NfcTech.Ndef],
      { alertMessage: "Acerca el teléfono a la etiqueta del bovino." }
    );
    ensureActive();
    const tag = await manager.getTag();
    ensureActive();
    if (!tag?.id) throw new Error("No se pudo leer el código de la etiqueta.");
    return tag.id;
  } finally {
    try {
      if (attempted && activeManager)
        await activeManager.cancelTechnologyRequest();
    } catch {
      /* A cancelled native session may already have been released. */
    } finally {
      activeManager = null;
      requesting = false;
      scanning = false;
    }
  }
}
export async function cancelNfcScan() {
  generation++;
  if (activeManager && requesting)
    await activeManager.cancelTechnologyRequest();
}
