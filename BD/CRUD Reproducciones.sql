
-- Procedimineto para guardar
CREATE OR ALTER PROCEDURE sp_Reproduccion_Guardar
    @IdBovino INT,
    @FechaMonta DATE = NULL,
    @TipoReproduccion NVARCHAR(50),
    @FechaInseminacion DATE = NULL,
    @Resultado NVARCHAR(50) = NULL,
    @FechaConfirmacion DATE = NULL,
    @FechaProbableParto DATE = NULL,
    @Observaciones NVARCHAR(500) = NULL,
    @IdUsuario INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Reproducciones
    (
        IdBovino,
        FechaMonta,
        TipoReproduccion,
        FechaInseminacion,
        Resultado,
        FechaConfirmacion,
        FechaProbableParto,
        Observaciones,
        IdUsuario
    )
    VALUES
    (
        @IdBovino,
        @FechaMonta,
        @TipoReproduccion,
        @FechaInseminacion,
        @Resultado,
        @FechaConfirmacion,
        @FechaProbableParto,
        @Observaciones,
        @IdUsuario
    );

    SELECT SCOPE_IDENTITY() AS IdReproduccion;
END;
GO

--Procemineto para Buscar 
CREATE OR ALTER PROCEDURE sp_Reproduccion_BuscarTodos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.IdReproduccion,
        r.IdBovino,
        b.Nombre AS NombreBovino,
        r.FechaMonta,
        r.TipoReproduccion,
        r.FechaInseminacion,
        r.Resultado,
        r.FechaConfirmacion,
        r.FechaProbableParto,
        r.Observaciones,
        r.IdUsuario,
        u.NombreCompleto AS UsuarioRegistro,
        r.FechaRegistro
    FROM Reproducciones r
    INNER JOIN Bovinos b
        ON r.IdBovino = b.IdBovino
    LEFT JOIN Usuarios u
        ON r.IdUsuario = u.IdUsuario
    ORDER BY r.IdReproduccion DESC;
END;
GO


--Procedimiento para Actualizar 
CREATE OR ALTER PROCEDURE sp_Reproduccion_Actualizar
    @IdReproduccion INT,
    @IdBovino INT,
    @FechaMonta DATE = NULL,
    @TipoReproduccion NVARCHAR(50),
    @FechaInseminacion DATE = NULL,
    @Resultado NVARCHAR(50) = NULL,
    @FechaConfirmacion DATE = NULL,
    @FechaProbableParto DATE = NULL,
    @Observaciones NVARCHAR(500) = NULL,
    @IdUsuario INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reproducciones
    SET
        IdBovino = @IdBovino,
        FechaMonta = @FechaMonta,
        TipoReproduccion = @TipoReproduccion,
        FechaInseminacion = @FechaInseminacion,
        Resultado = @Resultado,
        FechaConfirmacion = @FechaConfirmacion,
        FechaProbableParto = @FechaProbableParto,
        Observaciones = @Observaciones,
        IdUsuario = @IdUsuario
    WHERE IdReproduccion = @IdReproduccion;

    SELECT
        @IdReproduccion AS IdReproduccion;
END;
GO
--Procedimiento para Eliminar 
CREATE OR ALTER PROCEDURE sp_Reproduccion_Eliminar
    @IdReproduccion INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Reproducciones
    WHERE IdReproduccion = @IdReproduccion;

    SELECT
        @IdReproduccion AS IdReproduccion;
END;
GO

