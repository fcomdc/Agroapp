
CREATE DATABASE AgroAppDB;
GO

USE AgroAppDB;
GO


  --1TABLA USUARIOS

CREATE TABLE Usuarios
(
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(150) NOT NULL,
    Usuario NVARCHAR(100) NOT NULL UNIQUE,
    Contrasena NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(30) NOT NULL CHECK (Rol IN ('Administrador', 'Trabajador', 'Veterinario')),
    Estado BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO
--Ubicaciones 
CREATE TABLE Ubicaciones
(
    IdUbicacion INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Tipo NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(255) NULL,
    Estado BIT NOT NULL DEFAULT 1
);
GO

   --TABLA BOVINOS

CREATE TABLE Bovinos
(
    IdBovino INT IDENTITY(1,1) PRIMARY KEY,
    Codigo NVARCHAR(50) NOT NULL UNIQUE,
    Nombre NVARCHAR(100) NULL,
    Sexo CHAR(1) NOT NULL CHECK (Sexo IN ('M', 'H')),
    FechaNacimiento DATE NOT NULL,
    Raza NVARCHAR(100) NULL,
    Color NVARCHAR(50) NULL,
    Foto NVARCHAR(500) NULL,
    IdUbicacion INT NULL,
    Estado NVARCHAR(30) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Vendido', 'Fallecido', 'Trasladado')),
    Observaciones NVARCHAR(500) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Bovinos_Ubicaciones FOREIGN KEY (IdUbicacion) REFERENCES Ubicaciones(IdUbicacion)
);
GO


  --TABLA NFC
CREATE TABLE NFC
(
    IdNFC INT IDENTITY(1,1) PRIMARY KEY,
    IdBovino INT NOT NULL,
    UID_NFC NVARCHAR(100) NOT NULL UNIQUE,
    TipoTag NVARCHAR(50) NULL,
    Estado BIT NOT NULL DEFAULT 1,
    FechaAsignacion DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_NFC_Bovinos FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino)
);
GO
   --TABLA PESOS
CREATE TABLE Pesos
(
    IdPeso INT IDENTITY(1,1) PRIMARY KEY,
    IdBovino INT NOT NULL,
    Peso DECIMAL(6,2) NOT NULL CHECK (Peso > 0),
    FechaPeso DATE NOT NULL,
    IdUsuario INT NULL,
    Observaciones NVARCHAR(500) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Pesos_Bovinos FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
    CONSTRAINT FK_Pesos_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);
GO

--Vacunaciones

CREATE TABLE Vacunaciones
(
    IdVacunacion INT IDENTITY(1,1) PRIMARY KEY,
    IdBovino INT NOT NULL,
    FechaAplicacion DATE NOT NULL,
    ProximaAplicacion DATE NULL,
    Dosis NVARCHAR(100) NULL,
    Lote NVARCHAR(100) NULL,
    IdUsuario INT NULL,
    Observaciones NVARCHAR(500) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Vacunaciones_Bovinos FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
    CONSTRAINT FK_Vacunaciones_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);
GO
  -- TABLA REPORTES DE SALUD

CREATE TABLE ReportesSalud
(
    IdReporte INT IDENTITY(1,1) PRIMARY KEY,
    IdBovino INT NOT NULL,
    IdUsuario INT NOT NULL,
    FechaReporte DATETIME NOT NULL DEFAULT GETDATE(),
    Sintomas NVARCHAR(1000) NOT NULL,
    Observaciones NVARCHAR(1000) NULL,
    Gravedad NVARCHAR(30) NOT NULL CHECK (Gravedad IN ('Baja', 'Media', 'Alta', 'Critica')),
    Estado NVARCHAR(30) NOT NULL DEFAULT 'Pendiente' CHECK (Estado IN ('Pendiente', 'EnRevision', 'Atendido', 'Cerrado')),
    FechaAtencion DATETIME NULL,
    Diagnostico NVARCHAR(1000) NULL,
    Tratamiento NVARCHAR(1000) NULL,

    CONSTRAINT FK_ReportesSalud_Bovinos FOREIGN KEY (IdBovino)  REFERENCES Bovinos(IdBovino),
    CONSTRAINT FK_ReportesSalud_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);
GO
  -- . TABLA REPRODUCCIONES 
CREATE TABLE Reproducciones
(
    IdReproduccion INT IDENTITY(1,1) PRIMARY KEY,
    IdBovino INT NOT NULL,
    FechaMonta DATE NULL,
    TipoReproduccion NVARCHAR(50) NOT NULL  CHECK (TipoReproduccion IN  ('Monta Natural', 'Inseminacion Artificial')),
    FechaInseminacion DATE NULL,
    Resultado NVARCHAR(50) NULL CHECK (Resultado IN ('Pendiente', 'Preñada', 'No Preñada')),
    FechaConfirmacion DATE NULL,
    FechaProbableParto DATE NULL,
    Observaciones NVARCHAR(500) NULL,
    IdUsuario INT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Reproducciones_Bovinos FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
   CONSTRAINT FK_Reproducciones_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);
Go

 --  . TABLA PARTOS
CREATE TABLE Partos
(
    IdParto INT IDENTITY(1,1) PRIMARY KEY,
    IdMadre INT NOT NULL,
    FechaParto DATE NOT NULL,
    TipoParto NVARCHAR(50) NULL CHECK (TipoParto IN ('Normal', 'Asistido', 'Cesarea', 'Aborto')),
    CantidadCrías INT NOT NULL DEFAULT 1 CHECK (CantidadCrías > 0),
    Observaciones NVARCHAR(1000) NULL,
    IdUsuario INT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Partos_Madre FOREIGN KEY (IdMadre) REFERENCES Bovinos(IdBovino),
    CONSTRAINT FK_Partos_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);
GO
   -- TABLA CRIAS DE PARTOS
CREATE TABLE CriasParto
(
    IdCria INT IDENTITY(1,1) PRIMARY KEY,
    IdParto INT NOT NULL,
    IdBovino INT NULL,
    Sexo CHAR(1) NOT NULL CHECK (Sexo IN ('M', 'H')),
    Nombre NVARCHAR(100) NULL,
    PesoNacimiento DECIMAL(6,2) NULL,
    EstadoCria NVARCHAR(50) NULL,
    Observaciones NVARCHAR(500) NULL,

    CONSTRAINT FK_CriasParto_Partos FOREIGN KEY (IdParto) REFERENCES Partos(IdParto),
    CONSTRAINT FK_CriasParto_Bovinos FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino)
);
GO


  -- ÍNDICES

CREATE INDEX IX_Bovinos_Codigo
ON Bovinos(Codigo);
GO

CREATE INDEX IX_Bovinos_Nombre
ON Bovinos(Nombre);
GO

CREATE INDEX IX_NFC_UID
ON NFC(UID_NFC);
GO

CREATE INDEX IX_Pesos_Bovino
ON Pesos(IdBovino);
GO

CREATE INDEX IX_Vacunaciones_Bovino
ON Vacunaciones(IdBovino);
GO

CREATE INDEX IX_ReportesSalud_Bovino
ON ReportesSalud(IdBovino);
GO

CREATE INDEX IX_ReportesSalud_Estado
ON ReportesSalud(Estado);
GO

CREATE INDEX IX_Reproducciones_Bovino
ON Reproducciones(IdBovino);
GO

CREATE INDEX IX_Partos_Madre
ON Partos(IdMadre);
GO

