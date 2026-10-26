import type { Bovino, Ubicacion } from './models';

type BovineParams = { IdBovino?: number; idBovino?: number; id?: number; codigo?: string } | undefined;
export type RootStackParamList = {
  Login: undefined; HomeScreen: undefined;
  BovinosList: undefined; BovinosListScreen: undefined;
  BovinoDetail: { id: number }; BovinoDetailScreen: { id: number };
  BovinoForm: { bovino?: Bovino } | undefined; BovinoFormScreen: { bovino?: Bovino } | undefined;
  Pesos: BovineParams; PesosScreen: BovineParams; PesoForm: BovineParams; PesoFormScreen: BovineParams;
  Nfc: BovineParams; NfcScreen: BovineParams;
  SaludHome: BovineParams; ReportesSaludList: BovineParams; ReporteSaludForm: BovineParams;
  ReporteSaludDetail: { idReporte: number };
  VacunacionesList: BovineParams; VacunacionForm: BovineParams;
  MasHome: undefined; Ubicaciones: undefined;
  UbicacionForm: { ubicacion?: Ubicacion } | undefined;
  Reproducciones: BovineParams; ReproduccionForm: BovineParams;
  Partos: undefined; PartoForm: undefined; Usuarios: undefined; UsuarioForm: undefined;
};
export type TabParamList = { Inicio: undefined; Bovinos: undefined; Salud: undefined; Más: undefined };

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- React Navigation registers routes by merging this global interface.
    interface RootParamList extends RootStackParamList {}
  }
}

