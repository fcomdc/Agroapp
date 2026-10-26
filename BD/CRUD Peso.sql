--Procedimiento para guardar
CREATE OR ALTER PROCEDURE sp_Peso_Guardar
    @IdBovino INT,
    @Peso DECIMAL(6,2),
    @FechaPeso DATE,
    @IdUsuario INT = NULL,
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Pesos
    (
        IdBovino,
        Peso,
        FechaPeso,
        IdUsuario,
        Observaciones
    )
    VALUES
    (
        @IdBovino,
        @Peso,
        @FechaPeso,
        @IdUsuario,
        @Observaciones
    );

    SELECT SCOPE_IDENTITY() AS IdPeso;
END;
GO

--Procedimiento para Listar
CREATE OR ALTER PROCEDURE sp_Peso_Listar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.IdPeso,
        P.IdBovino,
        B.Codigo,
        B.Nombre AS NombreBovino,
        P.Peso,
        P.FechaPeso,
        P.IdUsuario,
        U.NombreCompleto AS UsuarioRegistro,
        P.Observaciones,
        P.FechaRegistro
    FROM Pesos P
    INNER JOIN Bovinos B
        ON P.IdBovino = B.IdBovino
    LEFT JOIN Usuarios U
        ON P.IdUsuario = U.IdUsuario
    ORDER BY P.FechaPeso DESC, P.IdPeso DESC;
END;
GO

--Procedimiento para Buscar 
CREATE OR ALTER PROCEDURE sp_Peso_BuscarPorNombre
    @Nombre NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.IdPeso,
        P.IdBovino,
        B.Codigo,
        B.Nombre AS NombreBovino,
        P.Peso,
        P.FechaPeso,
        P.IdUsuario,
        U.NombreCompleto AS UsuarioRegistro,
        P.Observaciones,
        P.FechaRegistro
    FROM Pesos P
    INNER JOIN Bovinos B
        ON P.IdBovino = B.IdBovino
    LEFT JOIN Usuarios U
        ON P.IdUsuario = U.IdUsuario
    WHERE B.Nombre LIKE '%' + @Nombre + '%'
    ORDER BY P.FechaPeso DESC;
END;
GO

--Procedimento para Actualizar
CREATE OR ALTER PROCEDURE sp_Peso_Actualizar
    @IdPeso INT,
    @IdBovino INT,
    @Peso DECIMAL(6,2),
    @FechaPeso DATE,
    @IdUsuario INT = NULL,
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Pesos
    SET
        IdBovino = @IdBovino,
        Peso = @Peso,
        FechaPeso = @FechaPeso,
        IdUsuario = @IdUsuario,
        Observaciones = @Observaciones
    WHERE IdPeso = @IdPeso;
END;
GO

--Procedimento para Eliminar 
CREATE OR ALTER PROCEDURE sp_Peso_Eliminar
    @IdPeso INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Pesos
    WHERE IdPeso = @IdPeso;
END;
GO
