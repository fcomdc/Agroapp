

-- Procedimiento para Guardar

CREATE OR ALTER PROCEDURE sp_Vacunacion_Guardar
    @IdBovino INT,
    @FechaAplicacion DATE,
    @ProximaAplicacion DATE = NULL,
    @Dosis NVARCHAR(100) = NULL,
    @Lote NVARCHAR(100) = NULL,
    @IdUsuario INT = NULL,
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Vacunaciones
    (
        IdBovino,
        FechaAplicacion,
        ProximaAplicacion,
        Dosis,
        Lote,
        IdUsuario,
        Observaciones
    )
    VALUES
    (
        @IdBovino,
        @FechaAplicacion,
        @ProximaAplicacion,
        @Dosis,
        @Lote,
        @IdUsuario,
        @Observaciones
    );

    SELECT SCOPE_IDENTITY() AS IdVacunacion;
END;
GO


-- 2.Procedimineto para Buscar 

CREATE OR ALTER PROCEDURE sp_Vacunacion_BuscarTodos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        V.IdVacunacion,
        V.IdBovino,
        B.Nombre AS NombreBovino,
        V.FechaAplicacion,
        V.ProximaAplicacion,
        V.Dosis,
        V.Lote,
        V.IdUsuario,
        U.NombreCompleto AS NombreUsuario,
        V.Observaciones,
        V.FechaRegistro
    FROM Vacunaciones V
    INNER JOIN Bovinos B
        ON V.IdBovino = B.IdBovino
    LEFT JOIN Usuarios U
        ON V.IdUsuario = U.IdUsuario
    ORDER BY V.IdVacunacion DESC;
END;
GO



-- 4. Procedimiento para Buscar por bovino

CREATE OR ALTER PROCEDURE sp_Vacunacion_BuscarPorBovino
    @IdBovino INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        V.IdVacunacion,
        V.IdBovino,
        B.Nombre AS NombreBovino,
        V.FechaAplicacion,
        V.ProximaAplicacion,
        V.Dosis,
        V.Lote,
        V.IdUsuario,
        U.NombreCompleto AS NombreUsuario,
        V.Observaciones,
        V.FechaRegistro
    FROM Vacunaciones V
    INNER JOIN Bovinos B
        ON V.IdBovino = B.IdBovino
    LEFT JOIN Usuarios U
        ON V.IdUsuario = U.IdUsuario
    WHERE V.IdBovino = @IdBovino
    ORDER BY V.FechaAplicacion DESC;
END;
GO



-- Procedimiento para Actualizar 
CREATE OR ALTER PROCEDURE sp_Vacunacion_Actualizar
    @IdVacunacion INT,
    @IdBovino INT,
    @FechaAplicacion DATE,
    @ProximaAplicacion DATE = NULL,
    @Dosis NVARCHAR(100) = NULL,
    @Lote NVARCHAR(100) = NULL,
    @IdUsuario INT = NULL,
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Vacunaciones
    SET
        IdBovino = @IdBovino,
        FechaAplicacion = @FechaAplicacion,
        ProximaAplicacion = @ProximaAplicacion,
        Dosis = @Dosis,
        Lote = @Lote,
        IdUsuario = @IdUsuario,
        Observaciones = @Observaciones
    WHERE IdVacunacion = @IdVacunacion;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO



-- Procedimiento para Eliminar

CREATE OR ALTER PROCEDURE sp_Vacunacion_Eliminar
    @IdVacunacion INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Vacunaciones
    WHERE IdVacunacion = @IdVacunacion;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO
