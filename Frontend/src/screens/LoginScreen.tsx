import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('admin');
  const [contrasena, setContrasena] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!usuario.trim()) {
      setError('Ingrese su usuario');
      return;
    }
    if (!contrasena.trim()) {
      setError('Ingrese su contraseña');
      return;
    }
    setLoading(true);
    try {
      const res = await login(usuario.trim(), contrasena);
      if (!res || !res.success) {
        setError(res?.message || 'Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Encabezado */}
          <View style={styles.topSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="leaf" size={54} color={COLORS.WHITE} />
            </View>
            <Text style={styles.appTitle}>AgroApp</Text>
            <Text style={styles.appSubtitle}>Gestión Ganadera Inteligente</Text>
          </View>

          {/* Tarjeta de Formulario */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>Iniciar Sesión</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={COLORS.DANGER} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Usuario</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.TEXT_LIGHT} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Usuario (ej: admin)"
                placeholderTextColor={COLORS.TEXT_LIGHT}
                value={usuario}
                onChangeText={(text) => { setUsuario(text); setError(''); }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.TEXT_LIGHT} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.TEXT_LIGHT}
                value={contrasena}
                onChangeText={(text) => { setContrasena(text); setError(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.TEXT_LIGHT} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={22} color={COLORS.WHITE} style={{ marginRight: 8 }} />
                  <Text style={styles.loginButtonText}>Ingresar</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>Credenciales demo: admin / admin123</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  formSection: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 18,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.DANGER,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT,
  },
  eyeIcon: {
    padding: 6,
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.TEXT_LIGHT,
    fontSize: 12,
    marginTop: 20,
  },
});

