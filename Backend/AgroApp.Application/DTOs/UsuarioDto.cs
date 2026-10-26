
namespace AgroApp.Application.DTOs.Usuarios;

public class UsuarioResponseDto
{
    public int IdUsuario { get; set; }

    public string NombreCompleto { get; set; } = string.Empty;

    public string Usuario { get; set; } = string.Empty;

    public string Rol { get; set; } = string.Empty;

    public bool Estado { get; set; }

    public DateTime FechaRegistro { get; set; }
}
