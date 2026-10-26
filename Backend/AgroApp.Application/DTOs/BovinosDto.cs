
using System;
using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs;

public class BovinosDto
{
    public int IdBovino { get; set; }

    [Required(ErrorMessage = "El código del bovino es obligatorio.")]
    [StringLength(50)]
    public string Codigo { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Nombre { get; set; }

    [Required(ErrorMessage = "El sexo es obligatorio.")]
    [RegularExpression("^[MH]$", ErrorMessage = "El sexo debe ser M o H.")]
    public string Sexo { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
    public DateTime FechaNacimiento { get; set; }

    [StringLength(100)]
    public string? Raza { get; set; }

    [StringLength(50)]
    public string? Color { get; set; }

    [StringLength(500)]
    public string? Foto { get; set; }

    public int? IdUbicacion { get; set; }

    [Required(ErrorMessage = "El estado es obligatorio.")]
    [RegularExpression(
        "^(Activo|Vendido|Fallecido|Trasladado)$",
        ErrorMessage = "El estado debe ser Activo, Vendido, Fallecido o Trasladado.")]
    public string Estado { get; set; } = "Activo";

    [StringLength(500)]
    public string? Observaciones { get; set; }

    public DateTime? FechaRegistro { get; set; }
}
