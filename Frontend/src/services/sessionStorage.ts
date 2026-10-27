import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'agroapp.session.v2';
// Browser preview stores only the local user ID for this tab.
// Native sessions use Keychain/Keystore, never AsyncStorage.
export const sessionStorage = {
  get: async (): Promise<string | null> => Platform.OS === 'web'
    ? sessionStorageWeb()?.getItem(KEY) ?? null : SecureStore.getItemAsync(KEY),
  set: async (value: string): Promise<void> => {
    if (Platform.OS === 'web') sessionStorageWeb()?.setItem(KEY, value);
    else await SecureStore.setItemAsync(KEY, value);
  },
  clear: async (): Promise<void> => {
    if (Platform.OS === 'web') sessionStorageWeb()?.removeItem(KEY);
    else {
      await SecureStore.deleteItemAsync(KEY);
      await SecureStore.deleteItemAsync('agroapp.api.token');
    }
  },
};
function sessionStorageWeb() {
  try { return globalThis.sessionStorage; } catch { return undefined; }
}
