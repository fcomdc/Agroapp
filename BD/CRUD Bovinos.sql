--Procedimiento para guardar 

CREATE OR ALTER PROCEDURE sp_Bovino_Guardar
    @Codigo NVARCHAR(50),
    @Nombre NVARCHAR(100) = NULL,
    @Sexo CHAR(1),
    @FechaNacimiento DATE,
    @Raza NVARCHAR(100) = NULL,
    @Color NVARCHAR(50) = NULL,
    @Foto NVARCHAR(500) = NULL,
    @IdUbicacion INT = NULL,
    @Estado NVARCHAR(30) = 'Activo',
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Bovinos
    (
        Codigo,
        Nombre,
        Sexo,
        FechaNacimiento,
        Raza,
        Color,
        Foto,
        IdUbicacion,
        Estado,
        Observaciones
    )
    VALUES
    (
        @Codigo,
        @Nombre,
        @Sexo,
        @FechaNacimiento,
        @Raza,
        @Color,
        @Foto,
        @IdUbicacion,
        @Estado,
        @Observaciones
    );

    SELECT SCOPE_IDENTITY() AS IdBovino;
END;
GO

--Procedimiento para buscar 
CREATE OR ALTER PROCEDURE sp_Bovino_Buscar
    @Busqueda NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        B.IdBovino,
        B.Codigo,
        B.Nombre,
        B.Sexo,
        B.FechaNacimiento,
        B.Raza,
        B.Color,
        B.Foto,
        B.IdUbicacion,
        U.Nombre AS NombreUbicacion,
        U.Tipo AS TipoUbicacion,
        B.Estado,
        B.Observaciones,
        B.FechaRegistro
    FROM Bovinos B
    LEFT JOIN Ubicaciones U
        ON B.IdUbicacion = U.IdUbicacion
    WHERE
        B.Codigo LIKE '%' + @Busqueda + '%'
        OR B.Nombre LIKE '%' + @Busqueda + '%'
    ORDER BY B.Nombre;
END;
GO

--Procedimiento para Actualizar
CREATE OR ALTER PROCEDURE sp_Bovino_Actualizar
    @IdBovino INT,
    @Codigo NVARCHAR(50),
    @Nombre NVARCHAR(100) = NULL,
    @Sexo CHAR(1),
    @FechaNacimiento DATE,
    @Raza NVARCHAR(100) = NULL,
    @Color NVARCHAR(50) = NULL,
    @Foto NVARCHAR(500) = NULL,
    @IdUbicacion INT = NULL,
    @Estado NVARCHAR(30),
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Bovinos
    SET
        Codigo = @Codigo,
        Nombre = @Nombre,
        Sexo = @Sexo,
        FechaNacimiento = @FechaNacimiento,
        Raza = @Raza,
        Color = @Color,
        Foto = @Foto,
        IdUbicacion = @IdUbicacion,
        Estado = @Estado,
        Observaciones = @Observaciones
    WHERE IdBovino = @IdBovino;
END;
GO

--Procedimiento para Eliminar 
CREATE OR ALTER PROCEDURE sp_Bovino_Eliminar
    @IdBovino INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Bovinos
    SET Estado = 'Fallecido o Vendida '
    WHERE IdBovino = @IdBovino;
END;
GO

--Procedimiento para Listar 
CREATE OR ALTER PROCEDURE sp_Bovino_Listar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        B.IdBovino,
        B.Codigo,
        B.Nombre,
        B.Sexo,
        B.FechaNacimiento,
        B.Raza,
        B.Color,
        B.Foto,
        B.IdUbicacion,
        U.Nombre AS NombreUbicacion,
        U.Tipo AS TipoUbicacion,
        B.Estado,
        B.Observaciones,
        B.FechaRegistro
    FROM Bovinos B
    LEFT JOIN Ubicaciones U
        ON B.IdUbicacion = U.IdUbicacion
    ORDER BY B.IdBovino DESC;
END;
GO