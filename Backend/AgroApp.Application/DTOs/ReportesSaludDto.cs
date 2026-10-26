using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs;

public class ReportesSaludDto
{
    public int IdReporte { get; set; }

    [Required(ErrorMessage = "Debe seleccionar un bovino.")]
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un bovino válido.")]
    public int IdBovino { get; set; }

    [Required(ErrorMessage = "Debe seleccionar un usuario.")]
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un usuario válido.")]
    public int IdUsuario { get; set; }

    public DateTime FechaReporte { get; set; }

    [Required(ErrorMessage = "Los síntomas son obligatorios.")]
    [StringLength(1000, ErrorMessage = "Los síntomas no pueden superar los 1000 caracteres.")]
    public string Sintomas { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Las observaciones no pueden superar los 1000 caracteres.")]
    public string? Observaciones { get; set; }

    [Required(ErrorMessage = "La gravedad es obligatoria.")]
    [RegularExpression("^(Baja|Media|Alta|Critica)$", ErrorMessage = "La gravedad debe ser Baja, Media, Alta o Critica.")]
    public string Gravedad { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estado es obligatorio.")]
    [RegularExpression("^(Pendiente|EnRevision|Atendido|Cerrado)$", ErrorMessage = "El estado debe ser Pendiente, EnRevision, Atendido o Cerrado.")]
    public string Estado { get; set; } = "Pendiente";

    public DateTime? FechaAtencion { get; set; }

    [StringLength(1000, ErrorMessage = "El diagnóstico no puede superar los 1000 caracteres.")]
    public string? Diagnostico { get; set; }

    [StringLength(1000, ErrorMessage = "El tratamiento no puede superar los 1000 caracteres.")]
    public string? Tratamiento { get; set; }
}
