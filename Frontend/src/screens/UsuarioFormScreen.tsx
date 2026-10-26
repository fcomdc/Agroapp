import type { Role } from '../types/models';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../utils/constants';
import { UsuariosDB } from '../database/UsuariosDB';

const ROLES: Role[] = ['Administrador', 'Trabajador', 'Veterinario'];

export default function UsuarioFormScreen() {
  const navigation = useNavigation();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState<Role>('Trabajador');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombreCompleto.trim()) {
      Alert.alert('Validación', 'El nombre completo es obligatorio');
      return;
    }
    if (!usuario.trim()) {
      Alert.alert('Validación', 'El nombre de usuario para inicio de sesión es obligatorio');
      return;
    }
    if (!contrasena.trim() || contrasena.length < 4) {
      Alert.alert('Validación', 'La contraseña debe tener al menos 4 caracteres');
      return;
    }

    try {
      setLoading(true);
      await UsuariosDB.create({
        NombreCompleto: nombreCompleto.trim(),
        Usuario: usuario.trim().toLowerCase(),
        Contrasena: contrasena.trim(),
        Rol: rol,
        Estado: 1,
      });

      Alert.alert('Éxito', `Usuario @${usuario.trim().toLowerCase()} creado con éxito`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear el usuario. Es probable que el nombre de usuario ya esté registrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Nombre Completo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Juan Pérez García"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
      />

      <Text style={styles.label}>Usuario de Acceso *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. juanp"
        autoCapitalize="none"
        value={usuario}
        onChangeText={setUsuario}
      />

      <Text style={styles.label}>Contraseña *</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 4 caracteres"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <Text style={styles.label}>Rol en la Finca *</Text>
      <View style={styles.rolesRow}>
        {ROLES.map((r) => {
          const isSelected = rol === r;
          return (
            <TouchableOpacity
              key={r}
              style={[styles.rolBtn, isSelected && styles.rolBtnActive]}
              onPress={() => setRol(r)}
            >
              <Text style={[styles.rolText, isSelected && styles.rolTextActive]}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Permisos del Rol:</Text>
        <Text style={styles.infoDesc}>
          {rol === 'Administrador' && '• Acceso total a usuarios, configuración, reportes y registros.'}
          {rol === 'Veterinario' && '• Diagnósticos médicos, recetas, atención de urgencias y sanidad.'}
          {rol === 'Trabajador' && '• Registro de pesajes, alimentación, reportes de síntomas y partos.'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.btnDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitBtnText}>Crear Usuario</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  label: { fontSize: 14, fontWeight: '600', color: Colors.TEXT, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  rolesRow: { flexDirection: 'row', marginBottom: 16 },
  rolBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  rolBtnActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  rolText: { fontSize: 12, fontWeight: 'bold', color: Colors.TEXT_LIGHT },
  rolTextActive: { color: '#FFF' },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  infoTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 4 },
  infoDesc: { fontSize: 13, color: Colors.TEXT, lineHeight: 18 },
  submitBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

