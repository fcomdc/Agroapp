using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities;

public class Usuario
{
    public int IdUsuario { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;

    // La columna en SQL se llama "Usuario", pero en C# usamos "NombreUsuario" para evitar conflictos con el nombre de la clase
    [Column("Usuario")]
    public string NombreUsuario { get; set; } = string.Empty;

    public string Contrasena { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool Estado { get; set; } = true;
    public DateTime FechaRegistro { get; set; }
}
