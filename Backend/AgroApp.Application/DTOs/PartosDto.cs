using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs;

public class PartosDto
{
    public int IdParto { get; set; }

    [Required(ErrorMessage = "Debe seleccionar la madre.")]
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione una madre válida.")]
    public int IdMadre { get; set; }

    [Required(ErrorMessage = "La fecha del parto es obligatoria.")]
    public DateTime FechaParto { get; set; }

    [RegularExpression("^(Normal|Asistido|Cesarea|Aborto)$", ErrorMessage = "El tipo de parto debe ser Normal, Asistido, Cesarea o Aborto.")]
    public string? TipoParto { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad de crías debe ser mayor que cero.")]
    public int CantidadCrias { get; set; } = 1;

    [StringLength(1000, ErrorMessage = "Las observaciones no pueden superar los 1000 caracteres.")]
    public string? Observaciones { get; set; }

    public int? IdUsuario { get; set; }

    public DateTime FechaRegistro { get; set; }
}
