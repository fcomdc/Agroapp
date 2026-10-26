

-- Procedimiento Guardar


CREATE OR ALTER PROCEDURE sp_Parto_Guardar
    @IdMadre INT,
    @FechaParto DATE,
    @TipoParto NVARCHAR(50) = NULL,
    @CantidadCrías INT = 1,
    @Observaciones NVARCHAR(1000) = NULL,
    @IdUsuario INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Partos
    (
        IdMadre,
        FechaParto,
        TipoParto,
        CantidadCrías,
        Observaciones,
        IdUsuario
    )
    VALUES
    (
        @IdMadre,
        @FechaParto,
        @TipoParto,
        @CantidadCrías,
        @Observaciones,
        @IdUsuario
    );

    SELECT SCOPE_IDENTITY() AS IdParto;
END;
GO

--Procedimiento Buscar 
CREATE OR ALTER PROCEDURE sp_Parto_BuscarTodos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.IdParto,
        p.IdMadre,
        b.Nombre AS NombreMadre,
        p.FechaParto,
        p.TipoParto,
        p.CantidadCrías,
        p.Observaciones,
        p.IdUsuario,
        u.NombreCompleto AS UsuarioRegistro,
        p.FechaRegistro
    FROM Partos p
    INNER JOIN Bovinos b
        ON p.IdMadre = b.IdBovino
    LEFT JOIN Usuarios u
        ON p.IdUsuario = u.IdUsuario
    ORDER BY p.FechaParto DESC, p.IdParto DESC;
END;
GO


--BUSCAR PARTOS POR MADRE

CREATE OR ALTER PROCEDURE sp_Parto_BuscarPorMadre
    @IdMadre INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.IdParto,
        p.IdMadre,
        b.Nombre AS NombreMadre,
        p.FechaParto,
        p.TipoParto,
        p.CantidadCrías,
        p.Observaciones,
        p.IdUsuario,
        u.NombreCompleto AS UsuarioRegistro,
        p.FechaRegistro
    FROM Partos p
    INNER JOIN Bovinos b
        ON p.IdMadre = b.IdBovino
    LEFT JOIN Usuarios u
        ON p.IdUsuario = u.IdUsuario
    WHERE p.IdMadre = @IdMadre
    ORDER BY p.FechaParto DESC;
END;
GO

--Procedimineto Actualizar
CREATE OR ALTER PROCEDURE sp_Parto_Actualizar
    @IdParto INT,
    @IdMadre INT,
    @FechaParto DATE,
    @TipoParto NVARCHAR(50) = NULL,
    @CantidadCrías INT = 1,
    @Observaciones NVARCHAR(1000) = NULL,
    @IdUsuario INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Partos
    SET
        IdMadre = @IdMadre,
        FechaParto = @FechaParto,
        TipoParto = @TipoParto,
        CantidadCrías = @CantidadCrías,
        Observaciones = @Observaciones,
        IdUsuario = @IdUsuario
    WHERE IdParto = @IdParto;

    SELECT
        @IdParto AS IdParto;
END;
GO

--Procedimiento Eliminar 
CREATE OR ALTER PROCEDURE sp_Parto_Eliminar
    @IdParto INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Partos
    WHERE IdParto = @IdParto;

    SELECT
        @IdParto AS IdParto;
END;
GO

