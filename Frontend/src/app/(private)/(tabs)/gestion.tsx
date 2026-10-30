import { useState, type ComponentProps } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Screen from '../../../components/Screen';
import { router, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/authStore';
import { useFarmStore } from '../../../store/farmStore';
import { ui, palette } from '../../../theme/tokens';
import ScreenHeading from '../../../components/ScreenHeading';
import Button from '../../../components/Button';

export default function MasScreen() {
  const { user, logout } = useAuthStore();
  const { name, location } = useFarmStore();
  const [error, setError] = useState('');
  const isAdmin = user?.Rol === 'Administrador';
  const items: {
    title: string;
    hint: string;
    icon: ComponentProps<typeof Ionicons>['name'];
    href: Href;
  }[] = [
    {
      title: 'Potreros y ubicaciones',
      hint: 'Dónde está cada animal',
      icon: 'map-outline',
      href: '/ubicaciones',
    },
    {
      title: 'Reproducción',
      hint: 'Montas, inseminación y seguimiento',
      icon: 'git-merge-outline',
      href: '/reproduccion',
    },
    {
      title: 'Partos y crías',
      hint: 'Nacimientos de la finca',
      icon: 'sparkles-outline',
      href: '/partos',
    },
    {
      title: 'Vacunaciones',
      hint: 'Aplicaciones y próximos refuerzos',
      icon: 'medical-outline',
      href: '/vacunas',
    },
    {
      title: 'Registros del teléfono',
      hint: 'Guardado local y envíos pendientes',
      icon: 'phone-portrait-outline',
      href: '/sincronizacion',
    },
    ...(isAdmin
      ? [
          {
            title: 'Equipo de la finca',
            hint: 'Usuarios y permisos',
            icon: 'people-outline' as const,
            href: '/usuarios' as Href,
          },
          {
            title: 'Datos de la finca',
            hint: 'Nombre y ubicación',
            icon: 'leaf-outline' as const,
            href: '/finca' as Href,
          },
        ]
      : []),
  ];
  return (
    <Screen>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeading
          eyebrow="ORGANIZACIÓN DEL CAMPO"
          title="Todo en su lugar"
          subtitle="Las herramientas y las personas de tu finca."
        />
        <View style={[ui.card, { backgroundColor: palette.forest, gap: 6 }]}>
          <Text style={[ui.eyebrow, { color: palette.lime }]}>MI FINCA</Text>
          <Text style={[ui.title, { color: palette.paper, fontSize: 29 }]}>
            {name}
          </Text>
          <Text style={[ui.subtitle, { color: '#C7D8CC' }]}>{location}</Text>
        </View>
        <View style={[ui.row, { gap: 14 }]}>
          <View
            style={{
              backgroundColor: palette.pale,
              padding: 16,
              borderRadius: 18,
            }}
          >
            <Ionicons name="person-outline" size={25} color={palette.green} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[ui.section, { fontSize: 16 }]}>
              {user?.NombreCompleto}
            </Text>
            <Text style={ui.subtitle}>{user?.Rol}</Text>
          </View>
        </View>
        <View>
          {items.map((item) => (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              onPress={() => router.push(item.href)}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingVertical: 18,
                  borderBottomWidth: 1,
                  borderColor: palette.line,
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Ionicons name={item.icon} size={23} color={palette.green} />
              <View style={{ flex: 1, gap: 5 }}>
                <Text
                  style={{
                    color: palette.ink,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                >
                  {item.title}
                </Text>
                <Text style={[ui.subtitle, { fontSize: 11 }]}>{item.hint}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={palette.muted}
              />
            </Pressable>
          ))}
        </View>
        {error ? <Text style={ui.error}>{error}</Text> : null}
        <Button
          label="Cerrar sesión"
          icon="log-out-outline"
          variant="secondary"
          onPress={() => {
            logout().catch(() =>
              setError('No se pudo cerrar la sesión. Inténtalo de nuevo.'),
            );
          }}
        />
        <Text style={[ui.eyebrow, { textAlign: 'center' }]}>
          AGROAPP · VERSIÓN 1.1.1
        </Text>
      </ScrollView>
    </Screen>
  );
}
