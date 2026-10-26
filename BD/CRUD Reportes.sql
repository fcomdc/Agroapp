--Procedimineto para guardar
CREATE OR ALTER PROCEDURE sp_ReporteSalud_Guardar
    @IdBovino INT,
    @IdUsuario INT,
    @Sintomas NVARCHAR(1000),
    @Observaciones NVARCHAR(1000) = NULL,
    @Gravedad NVARCHAR(30),
    @Estado NVARCHAR(30) = 'Pendiente',
    @Diagnostico NVARCHAR(1000) = NULL,
    @Tratamiento NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ReportesSalud
    (
        IdBovino,
        IdUsuario,
        Sintomas,
        Observaciones,
        Gravedad,
        Estado,
        Diagnostico,
        Tratamiento
    )
    VALUES
    (
        @IdBovino,
        @IdUsuario,
        @Sintomas,
        @Observaciones,
        @Gravedad,
        @Estado,
        @Diagnostico,
        @Tratamiento
    );

    SELECT
        SCOPE_IDENTITY() AS IdReporte;
END;
GO

--Procedimineto para buscar 
CREATE OR ALTER PROCEDURE sp_ReporteSalud_BuscarPorBovino
    @IdBovino INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdReporte,
        IdBovino,
        IdUsuario,
        FechaReporte,
        Sintomas,
        Observaciones,
        Gravedad,
        Estado,
        FechaAtencion,
        Diagnostico,
        Tratamiento
    FROM ReportesSalud
    WHERE IdBovino = @IdBovino
    ORDER BY FechaReporte DESC;
END;
GO

--Procemineto para Buscar o leer todos
CREATE OR ALTER PROCEDURE sp_ReporteSalud_BuscarTodos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdReporte,
        IdBovino,
        IdUsuario,
        FechaReporte,
        Sintomas,
        Observaciones,
        Gravedad,
        Estado,
        FechaAtencion,
        Diagnostico,
        Tratamiento
    FROM ReportesSalud
    ORDER BY FechaReporte DESC;
END;
GO


--Procedimento para Actualizar 
CREATE OR ALTER PROCEDURE sp_ReporteSalud_Actualizar
    @IdReporte INT,
    @IdBovino INT,
    @IdUsuario INT,
    @Sintomas NVARCHAR(1000),
    @Observaciones NVARCHAR(1000) = NULL,
    @Gravedad NVARCHAR(30),
    @Estado NVARCHAR(30),
    @Diagnostico NVARCHAR(1000) = NULL,
    @Tratamiento NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE ReportesSalud
    SET
        IdBovino = @IdBovino,
        IdUsuario = @IdUsuario,
        Sintomas = @Sintomas,
        Observaciones = @Observaciones,
        Gravedad = @Gravedad,
        Estado = @Estado,
        FechaAtencion =
            CASE
                WHEN @Estado IN ('Atendido', 'Cerrado')
                     AND FechaAtencion IS NULL
                THEN GETDATE()
                WHEN @Estado NOT IN ('Atendido', 'Cerrado')
                THEN NULL
                ELSE FechaAtencion
            END,
        Diagnostico = @Diagnostico,
        Tratamiento = @Tratamiento
    WHERE IdReporte = @IdReporte;

    SELECT
        @@ROWCOUNT AS FilasAfectadas;
END;
GO


--Procedimiento para Eliminar 
CREATE OR ALTER PROCEDURE sp_ReporteSalud_Eliminar
    @IdReporte INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM ReportesSalud
    WHERE IdReporte = @IdReporte;

    SELECT
        @@ROWCOUNT AS FilasAfectadas;
END;
GO