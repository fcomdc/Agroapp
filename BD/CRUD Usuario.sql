--Procedimiento para Guardar 
CREATE OR ALTER PROCEDURE sp_Usuario_Guardar
    @NombreCompleto NVARCHAR(150),
    @Usuario NVARCHAR(100),
    @Contrasena NVARCHAR(255),
    @Rol NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    -- Verificar si el nombre de usuario ya existe
    IF EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE Usuario = @Usuario
    )
    BEGIN
        RAISERROR('El nombre de usuario ya existe.', 16, 1);
        RETURN;
    END;

    -- Insertar usuario
    INSERT INTO Usuarios
    (
        NombreCompleto,
        Usuario,
        Contrasena,
        Rol
    )
    VALUES
    (
        @NombreCompleto,
        @Usuario,
        @Contrasena,
        @Rol
    );

    -- Retornar el ID generado
    SELECT SCOPE_IDENTITY() AS IdUsuario;
END;
GO

--Procedimiento para buscar 
CREATE OR ALTER PROCEDURE sp_Usuario_Buscar
    @NombreCompleto NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdUsuario,
        NombreCompleto,
        Usuario,
        Contrasena,
        Rol,
        Estado,
        FechaRegistro
    FROM Usuarios
    WHERE NombreCompleto LIKE '%' + @NombreCompleto + '%'
    ORDER BY NombreCompleto ASC;
END;
GO

--Procedimiento para actualizar 
CREATE OR ALTER PROCEDURE sp_Usuario_Actualizar
    @IdUsuario INT,
    @NombreCompleto NVARCHAR(150),
    @Usuario NVARCHAR(100),
    @Contrasena NVARCHAR(255),
    @Rol NVARCHAR(30),
    @Estado BIT
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar que el usuario exista
    IF NOT EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE IdUsuario = @IdUsuario
    )
    BEGIN
        RAISERROR('El usuario no existe.', 16, 1);
        RETURN;
    END;

    -- Verificar que el nuevo nombre de usuario no pertenezca a otro usuario
    IF EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE Usuario = @Usuario
          AND IdUsuario <> @IdUsuario
    )
    BEGIN
        RAISERROR('El nombre de usuario ya está siendo utilizado.', 16, 1);
        RETURN;
    END;

    UPDATE Usuarios
    SET
        NombreCompleto = @NombreCompleto,
        Usuario = @Usuario,
        Contrasena = @Contrasena,
        Rol = @Rol,
        Estado = @Estado
    WHERE IdUsuario = @IdUsuario;
END;
GO

--Procedimiento para Eliminar
CREATE OR ALTER PROCEDURE sp_Usuario_Eliminar
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE IdUsuario = @IdUsuario
    )
    BEGIN
        RAISERROR('El usuario no existe.', 16, 1);
        RETURN;
    END;

    UPDATE Usuarios
    SET Estado = 0
    WHERE IdUsuario = @IdUsuario;
END;
GO