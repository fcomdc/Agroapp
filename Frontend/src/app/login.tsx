import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import FormScreen from '../components/FormScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useFarmStore } from '../store/farmStore';
import { palette, fonts, ui } from '../theme/tokens';
import Button from '../components/Button';
import BrandMark from '../components/BrandMark';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const farm = useFarmStore((s) => s.name);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Detectar cuando aparece o desaparece el teclado
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';

    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });

    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Iniciar sesión
  const submit = async () => {
    if (loading) return;

    if (!username.trim() || !password) {
      setError('Escribe tu usuario y tu contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);

      if (!result.success) {
        setError(result.message || 'No se pudo ingresar.');
      } else {
        Keyboard.dismiss();
      }
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError('Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: keyboardVisible ? 'flex-start' : 'center',
        paddingHorizontal: 24,
        paddingTop: keyboardVisible ? 16 : 32,
        paddingBottom: keyboardVisible ? 80 : 60,
      }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {/* Logo y presentación */}
      {!keyboardVisible && (
        <>
          <BrandMark size={112} />

          <View style={styles.hero}>
            <Text style={styles.kicker}>CUADERNO DE CAMPO DIGITAL</Text>

            <Text style={styles.heroTitle}>Más cerca{'\n'}de tu ganado.</Text>

            <View style={styles.land}>
              <MaterialCommunityIcons
                name="cow"
                color={palette.lime}
                size={58}
              />

              <Ionicons name="leaf-outline" color="#779B70" size={38} />
            </View>

            <Text style={styles.farm}>{farm.toLocaleUpperCase('es-NI')}</Text>
          </View>
        </>
      )}

      {/* Encabezado del login */}
      <View style={styles.heading}>
        <Text style={[ui.title, { fontSize: 29 }]}>Volvamos a la finca</Text>

        <Text style={ui.subtitle}>Consulta y registra, incluso sin señal.</Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Usuario */}
        <View>
          <Text style={ui.label}>Usuario</Text>

          <TextInput
            accessibilityLabel="Usuario"
            style={ui.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            placeholder="Tu usuario"
            placeholderTextColor={palette.muted}
            editable={!loading}
            returnKeyType="next"
          />
        </View>

        {/* Contraseña */}
        <View>
          <Text style={ui.label}>Contraseña</Text>

          <View style={styles.password}>
            <TextInput
              accessibilityLabel="Contraseña"
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!visible}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              placeholderTextColor={palette.muted}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={() => void submit()}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                visible ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              onPress={() => setVisible(!visible)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={visible ? 'eye-off-outline' : 'eye-outline'}
                color={palette.muted}
                size={20}
              />
            </Pressable>
          </View>
        </View>

        {/* Mensaje de error */}
        {error ? (
          <Text accessibilityRole="alert" style={ui.error}>
            {error}
          </Text>
        ) : null}

        {/* Botón de inicio de sesión */}
        <Button
          label="Entrar a mi finca"
          icon="arrow-forward"
          loading={loading}
          onPress={() => void submit()}
        />
      </View>

      {/* Mensaje inferior */}
      {!keyboardVisible && (
        <View style={styles.footer}>
          <Ionicons
            name="phone-portrait-outline"
            size={13}
            color={palette.muted}
          />

          <Text style={styles.footerText}>
            La información del campo permanece contigo
          </Text>
        </View>
      )}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F1',
  },

  hero: {
    backgroundColor: palette.forest,
    padding: 26,
    borderRadius: 25,
    overflow: 'hidden',
  },

  kicker: {
    color: palette.lime,
    fontSize: 9,
    letterSpacing: 1.6,
    fontWeight: '600',
  },

  heroTitle: {
    fontFamily: fonts.heading,
    color: palette.paper,
    fontSize: 37,
    lineHeight: 43,
    marginTop: 16,
  },

  land: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 22,
    marginVertical: 10,
  },

  farm: {
    color: '#C4D3C3',
    letterSpacing: 2,
    fontSize: 10,
  },

  heading: {
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },

  form: {
    gap: 16,
  },

  password: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    paddingLeft: 14,
    borderRadius: 12,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 50,
    color: palette.ink,
  },

  eyeButton: {
    padding: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },

  footerText: {
    fontSize: 11,
    color: palette.muted,
  },
});
