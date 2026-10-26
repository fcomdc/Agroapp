using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs;

public class CriasPartoDto
{
    public int IdCria { get; set; }

    [Required(ErrorMessage = "Debe seleccionar el parto.")]
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un parto válido.")]
    public int IdParto { get; set; }

    public int? IdBovino { get; set; }

    [Required(ErrorMessage = "El sexo es obligatorio.")]
    [RegularExpression("^[MH]$", ErrorMessage = "El sexo debe ser M o H.")]
    public string Sexo { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
    public string? Nombre { get; set; }

    [Range(0.01, 9999.99, ErrorMessage = "El peso de nacimiento debe ser mayor que cero.")]
    public decimal? PesoNacimiento { get; set; }

    [StringLength(50, ErrorMessage = "El estado de la cría no puede superar los 50 caracteres.")]
    public string? EstadoCria { get; set; }

    [StringLength(500, ErrorMessage = "Las observaciones no pueden superar los 500 caracteres.")]
    public string? Observaciones { get; set; }
}
