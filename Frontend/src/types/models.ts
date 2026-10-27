

export type Role = 'Administrador' | 'Trabajador' | 'Veterinario';
export type Sex = 'M' | 'H';
export interface Usuario {
  IdUsuario: number; NombreCompleto: string; Usuario: string; Rol: Role;
  Estado: number; FechaRegistro: string;
}
export type UsuarioInput = Omit<Usuario, 'IdUsuario' | 'FechaRegistro' | 'Estado'> & { Contrasena: string; Estado?: number };
export interface SessionUser extends Usuario {
  id: number; usuario: string; nombre_completo: string; rol: Role;
}
export interface Ubicacion {
  IdUbicacion: number; Nombre: string; Tipo: string | null;
  Descripcion: string | null; Estado: number;
}
export interface Bovino {
  IdBovino: number; Codigo: string; Nombre: string | null; Sexo: Sex;
  FechaNacimiento: string | null; Raza: string | null; Color: string | null;
  Foto: string | null; IdUbicacion: number | null; NombreUbicacion?: string | null;
  Estado: string; Observaciones: string | null; FechaRegistro: string;
}
interface BovinoRecord {
  IdBovino: number; CodigoBovino?: string; NombreBovino?: string | null;
  NombreUsuario?: string | null; IdUsuario: number | null;
  Observaciones: string | null;
}
export interface Peso extends BovinoRecord {
  IdPeso: number; Peso: number; FechaPeso: string; FechaRegistro: string;
  Perimetros?: string | null; Longitudes?: string | null; Metodo?: string | null;
}
export interface Vacunacion extends BovinoRecord {
  IdVacunacion: number; FechaAplicacion: string; ProximaAplicacion: string | null;
  Dosis: string | null; Lote: string | null; FechaRegistro: string;
}
export interface ReporteSalud extends BovinoRecord {
  IdReporte: number; FechaReporte: string; Sintomas: string; Gravedad: string;
  Estado: string; Diagnostico: string | null; Tratamiento: string | null; FechaAtencion: string | null;
}
export interface Reproduccion extends BovinoRecord {
  IdReproduccion: number; FechaMonta: string | null; TipoReproduccion: string;
  FechaInseminacion: string | null; Resultado: string; FechaConfirmacion: string | null;
  FechaProbableParto: string | null; FechaRegistro: string;
}
export interface Parto {
  IdParto: number; IdMadre: number; FechaParto: string; TipoParto: string;
  CantidadCrías: number; Observaciones: string | null; IdUsuario: number | null;
  FechaRegistro: string; CodigoMadre?: string; NombreMadre?: string | null; NombreUsuario?: string | null;
}
export interface CriaParto {
  IdCria: number; IdParto: number; IdBovino: number | null; Sexo: Sex;
  Nombre: string | null; PesoNacimiento: number | null; EstadoCria: string | null;
  Observaciones: string | null; FechaParto?: string; TipoParto?: string;
  CodigoBovino?: string; NombreBovino?: string | null; CodigoMadre?: string; NombreMadre?: string | null;
}
export interface NfcTag {
  IdNFC: number; IdBovino: number; UID_NFC: string; TipoTag: string | null;
  Estado: number; FechaAsignacion: string; CodigoBovino?: string; NombreBovino?: string | null;
}
export type NewBovino = Pick<Bovino, 'Codigo' | 'Sexo'> & Partial<Omit<Bovino, 'IdBovino'>>;
export type NewUbicacion = Pick<Ubicacion, 'Nombre'> & Partial<Omit<Ubicacion, 'IdUbicacion'>>;
export type NewPeso = Pick<Peso, 'IdBovino' | 'Peso' | 'FechaPeso'> & Partial<Omit<Peso, 'IdPeso'>>;
export type NewVacunacion = Pick<Vacunacion, 'IdBovino' | 'FechaAplicacion'> & Partial<Omit<Vacunacion, 'IdVacunacion'>>;
export type NewReporteSalud = Pick<ReporteSalud, 'IdBovino' | 'IdUsuario' | 'Sintomas' | 'Gravedad'> & Partial<Omit<ReporteSalud, 'IdReporte'>>;
export type NewReproduccion = Pick<Reproduccion, 'IdBovino' | 'TipoReproduccion'> & Partial<Omit<Reproduccion, 'IdReproduccion'>>;
export type NewParto = Pick<Parto, 'IdMadre' | 'FechaParto' | 'TipoParto'> & Partial<Omit<Parto, 'IdParto'>>;
export type NewCriaParto = Pick<CriaParto, 'IdParto' | 'Sexo'> & Partial<Omit<CriaParto, 'IdCria'>>;
export type NewNfcTag = Pick<NfcTag, 'IdBovino' | 'UID_NFC'> & Partial<Omit<NfcTag, 'IdNFC'>>;

