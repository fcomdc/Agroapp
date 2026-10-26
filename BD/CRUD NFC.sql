--Procedimineto para Listar 
CREATE OR ALTER PROCEDURE sp_NFC_Listar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        N.IdNFC,
        N.IdBovino,
        B.Codigo,
        B.Nombre AS NombreBovino,
        N.UID_NFC,
        N.TipoTag,
        N.Estado,
        N.FechaAsignacion
    FROM NFC N
    INNER JOIN Bovinos B
        ON N.IdBovino = B.IdBovino
    ORDER BY N.IdNFC DESC;
END;
GO
--Procedimiento para Actualizar
CREATE OR ALTER PROCEDURE sp_NFC_Actualizar
    @IdNFC INT,
    @IdBovino INT,
    @UID_NFC NVARCHAR(100),
    @TipoTag NVARCHAR(50) = NULL,
    @Estado BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE NFC
    SET
        IdBovino = @IdBovino,
        UID_NFC = @UID_NFC,
        TipoTag = @TipoTag,
        Estado = @Estado
    WHERE IdNFC = @IdNFC;
END;
GO

--Procedimiento para buscar 
CREATE OR ALTER PROCEDURE sp_NFC_BuscarPorNombre
    @Nombre NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        N.IdNFC,
        N.IdBovino,
        B.Codigo,
        B.Nombre AS NombreBovino,
        N.UID_NFC,
        N.TipoTag,
        N.Estado,
        N.FechaAsignacion
    FROM NFC N
    INNER JOIN Bovinos B
        ON N.IdBovino = B.IdBovino
    WHERE B.Nombre LIKE '%' + @Nombre + '%'
    ORDER BY B.Nombre;
END;
GO

-- Procediminento para guardar 
CREATE OR ALTER PROCEDURE sp_NFC_Guardar
    @IdBovino INT,
    @UID_NFC NVARCHAR(100),
    @TipoTag NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO NFC
    (
        IdBovino,
        UID_NFC,
        TipoTag,
        Estado
    )
    VALUES
    (
        @IdBovino,
        @UID_NFC,
        @TipoTag,
        1
    );

    SELECT SCOPE_IDENTITY() AS IdNFC;
END;
GO

-- Procedimiento para eliminar/desactivar
CREATE OR ALTER PROCEDURE sp_NFC_Eliminar
    @IdNFC INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE NFC
    SET Estado = 0
    WHERE IdNFC = @IdNFC;
END;
GO