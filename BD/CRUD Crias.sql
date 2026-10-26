--Procedimiento Guardar
CREATE OR ALTER PROCEDURE sp_CriaParto_Guardar
    @IdParto INT,
    @IdBovino INT = NULL,
    @Sexo CHAR(1),
    @Nombre NVARCHAR(100) = NULL,
    @PesoNacimiento DECIMAL(6,2) = NULL,
    @EstadoCria NVARCHAR(50) = NULL,
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO CriasParto
    (
        IdParto,
        IdBovino,
        Sexo,
        Nombre,
        PesoNacimiento,
        EstadoCria,
        Observaciones
    )
    VALUES
    (
        @IdParto,
        @IdBovino,
        @Sexo,
        @Nombre,
        @PesoNacimiento,
        @EstadoCria,
        @Observaciones
    );

    SELECT SCOPE_IDENTITY() AS IdCria;
END;
GO

--Procedimineto Buscar
CREATE OR ALTER PROCEDURE sp_CriaParto_BuscarTodos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdCria,
        IdParto,
        IdBovino,
        Sexo,
        Nombre,
        PesoNacimiento,
        EstadoCria,
        Observaciones
    FROM CriasParto
    ORDER BY IdCria DESC;
END;
GO

--Procemineto Actualizar
CREATE OR ALTER PROCEDURE sp_CriaParto_Actualizar
    @IdCria INT,
    @IdParto INT,
    @IdBovino INT = NULL,
    @Sexo CHAR(1),
    @Nombre NVARCHAR(100) = NULL,
    @PesoNacimiento DECIMAL(6,2) = NULL,
    @EstadoCria NVARCHAR(50) = NULL,
    @Observaciones NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE CriasParto
    SET
        IdParto = @IdParto,
        IdBovino = @IdBovino,
        Sexo = @Sexo,
        Nombre = @Nombre,
        PesoNacimiento = @PesoNacimiento,
        EstadoCria = @EstadoCria,
        Observaciones = @Observaciones
    WHERE IdCria = @IdCria;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO


--Procedimiento Eliminar
CREATE OR ALTER PROCEDURE sp_CriaParto_Eliminar
    @IdCria INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM CriasParto
    WHERE IdCria = @IdCria;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO
