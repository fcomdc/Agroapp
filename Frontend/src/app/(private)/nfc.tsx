import { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useRecordParams } from '../../hooks/useRecordParams';
import { useAuthStore } from '../../store/authStore';
import { NfcDB } from '../../database/repositories/NfcDB';
import { BovinosDB } from '../../database/repositories/BovinosDB';
import type { NfcTag } from '../../types/models';
import { readTagUid, cancelNfcScan } from '../../services/nfcService';
import { palette, ui } from '../../theme/tokens';
import ScreenHeading from '../../components/ScreenHeading';
import FormScreen from '../../components/FormScreen';
import Button from '../../components/Button';
import { normalizeUid } from '../../utils/nfc';

export default function NfcScreen() {
  const { idBovino } = useRecordParams();
  const isAdmin = useAuthStore((s) => s.user?.Rol === 'Administrador');
  const [tags, setTags] = useState<NfcTag[]>([]);
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const load = useCallback(async () => {
    try {
      const [all, animal] = await Promise.all([
        idBovino ? NfcDB.getByBovino(idBovino) : NfcDB.getAll(),
        idBovino ? BovinosDB.getById(idBovino) : Promise.resolve(null),
      ]);
      setTags(all);
      setName(animal?.Nombre || animal?.Codigo || '');
    } catch {
      setMessage('No se pudieron consultar las etiquetas.');
    }
  }, [idBovino]);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  useEffect(
    () => () => {
      void cancelNfcScan().catch(() => {});
    },
    [],
  );
  const find = async (value: string) => {
    const all = await NfcDB.getAll();
    const tag = all.find(
      (t) => t.Estado === 1 && normalizeUid(t.UID_NFC) === normalizeUid(value),
    );
    if (tag)
      router.push({ pathname: '/bovinos/[id]', params: { id: tag.IdBovino } });
    else
      setMessage(
        'Esta etiqueta aún no está asociada. Un administrador puede vincularla desde la ficha del bovino.',
      );
  };
  const scan = async () => {
    if (scanning) return;
    setScanning(true);
    setMessage('Acerca el teléfono a la etiqueta…');
    try {
      const code = normalizeUid(await readTagUid());
      setUid(code);
      setMessage('Etiqueta leída.');
      if (!idBovino) await find(code);
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'La lectura terminó. Puedes volver a intentar.',
      );
    } finally {
      setScanning(false);
    }
  };
  const associate = async () => {
    if (!isAdmin || !idBovino || !uid.trim() || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const all = await NfcDB.getAll();
      if (all.some((t) => normalizeUid(t.UID_NFC) === normalizeUid(uid))) {
        setMessage(
          'Este código ya está registrado. Revisa la etiqueta asociada antes de sustituirla.',
        );
        return;
      }
      await NfcDB.create({
        IdBovino: idBovino,
        UID_NFC: normalizeUid(uid),
        TipoTag: 'Etiqueta NFC',
        Estado: 1,
      });
      setUid('');
      setMessage('La etiqueta quedó asociada a esta ficha.');
      await load();
    } catch {
      setMessage(
        'No se pudo asociar la etiqueta. El código podría estar en uso.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <FormScreen style={ui.page} contentContainerStyle={ui.content}>
      <ScreenHeading
        eyebrow="IDENTIFICACIÓN POR PROXIMIDAD"
        title={name || 'Acercar y reconocer'}
        subtitle="Abre la ficha correcta al acercar tu teléfono a la etiqueta del bovino."
      />
      <View
        style={[
          ui.card,
          {
            alignItems: 'center',
            backgroundColor: palette.pale,
            gap: 14,
            paddingVertical: 30,
          },
        ]}
      >
        <View
          style={{
            padding: 25,
            borderRadius: 35,
            backgroundColor: palette.lime,
          }}
        >
          <Ionicons name="scan-outline" size={52} color={palette.forest} />
        </View>
        <Text style={ui.section}>Acerca la parte trasera del teléfono</Text>
        <Text style={[ui.subtitle, { textAlign: 'center' }]}>
          Mantén la etiqueta cerca unos segundos.
        </Text>
      </View>
      <Button
        label={scanning ? 'Esperando etiqueta…' : 'Leer etiqueta NFC'}
        icon="scan-outline"
        loading={scanning}
        onPress={() => void scan()}
      />
      {scanning ? (
        <Button
          label="Cancelar lectura"
          variant="secondary"
          onPress={() => {
            void cancelNfcScan().catch(() => {});
          }}
        />
      ) : null}
      <View>
        <Text style={ui.label}>Código de la etiqueta</Text>
        <TextInput
          accessibilityLabel="Código de etiqueta NFC"
          style={ui.input}
          value={uid}
          onChangeText={setUid}
          autoCapitalize="characters"
          placeholder="Puedes escribirlo manualmente"
        />
      </View>
      {idBovino && isAdmin ? (
        <Button
          label="Asociar etiqueta a esta ficha"
          variant="secondary"
          disabled={!uid.trim() || scanning}
          loading={busy}
          onPress={() => void associate()}
        />
      ) : !idBovino ? (
        <Button
          label="Buscar etiqueta registrada"
          variant="secondary"
          disabled={!uid.trim()}
          onPress={() => {
            find(uid).catch(() => setMessage('No se pudo buscar la etiqueta.'));
          }}
        />
      ) : null}
      {message ? (
        <Text accessibilityRole="alert" style={ui.subtitle}>
          {message}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/ganado')}
        style={{ paddingVertical: 10 }}
      >
        <Text style={[ui.label, { color: palette.green }]}>
          Buscar bovino por nombre o código →
        </Text>
      </Pressable>
      {idBovino ? (
        <>
          <Text style={ui.section}>Etiquetas de esta ficha</Text>
          {tags.length ? (
            tags.map((t) => (
              <View style={[ui.card, { gap: 9 }]} key={t.IdNFC}>
                <Text style={ui.label}>{t.UID_NFC}</Text>
                <Text style={ui.subtitle}>
                  {t.Estado ? 'Activa' : 'Inactiva'}
                </Text>
                {isAdmin ? (
                  <Button
                    label={
                      t.Estado ? 'Desactivar etiqueta' : 'Reactivar etiqueta'
                    }
                    variant={t.Estado ? 'danger' : 'secondary'}
                    onPress={() => {
                      NfcDB.update(t.IdNFC, { Estado: t.Estado ? 0 : 1 })
                        .then(load)
                        .catch(() =>
                          setMessage(
                            'No se pudo cambiar el estado de la etiqueta.',
                          ),
                        );
                    }}
                  />
                ) : null}
              </View>
            ))
          ) : (
            <Text style={ui.subtitle}>Todavía no hay etiquetas asociadas.</Text>
          )}
        </>
      ) : null}
    </FormScreen>
  );
}
