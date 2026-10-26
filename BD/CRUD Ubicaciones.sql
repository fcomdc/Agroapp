--Procemiento para Guardar 
CREATE OR ALTER PROCEDURE sp_Guardar_Ubi
@Nombre NVARCHAR (100),
@Tipo NVARCHAR (50),
@Descripcion NVARCHAR (255)

AS BEGIN 
SET NOCOUNT ON;

INSERT INTO Ubicaciones
(
Nombre,
Tipo,
Descripcion,
Estado
)
VALUES
(
@Nombre,
@Tipo,
@Descripcion,
1
);

SELECT SCOPE_IDENTITY() AS  IdUbicacion 
END;

GO

--Procedimiento Para Buscar
CREATE OR ALTER PROCEDURE sp_Buscar_Ubi
@Nombre NVARCHAR(100)

AS BEGIN
SET NOCOUNT ON;

SELECT 
IdUbicacion,
Nombre,
tipo,
Descripcion,
Estado 
FROM Ubicaciones WHERE Nombre LIKE '%' + @Nombre + '%'
ORDER BY Nombre;
END 
GO 

CREATE OR ALTER PROCEDURE sp_Actualizar_Ubi
@IdUbicacion INT,
@Nombre NVARCHAR(100),
@Tipo NVARCHAR (50),
@Descripcion NVARCHAR(255) = NULL,
@Estado BIT

AS BEGIN 
SET NOCOUNT ON;

UPDATE Ubicaciones
SET
Nombre = @Nombre,
Tipo = @Tipo,
Descripcion = @Descripcion,
Estado = @Estado
WHERE IdUbicacion = @IdUbicacion;
END 
GO

--Procedimiento Eliminar 
CREATE OR ALTER PROCEDURE sp_Eliminar_Ubi
@IdUbicacion INT 

AS BEGIN
SET NOCOUNT ON;

UPDATE Ubicaciones
SET Estado= 0
WHERE IdUbicacion = @IdUbicacion;
END;
GO 

