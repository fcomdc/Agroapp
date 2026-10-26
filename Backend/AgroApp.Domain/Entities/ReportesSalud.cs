using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities;

[Table("ReportesSalud")]
public class ReportesSalud
{
    [Key]
    public int IdReporte { get; set; }

    [Required]
    public int IdBovino { get; set; }

    [Required]
    public int IdUsuario { get; set; }

    public DateTime FechaReporte { get; set; }

    [Required]
    [StringLength(1000)]
    public string Sintomas { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Observaciones { get; set; }

    [Required]
    [StringLength(30)]
    public string Gravedad { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string Estado { get; set; } = "Pendiente";

    public DateTime? FechaAtencion { get; set; }

    [StringLength(1000)]
    public string? Diagnostico { get; set; }

    [StringLength(1000)]
    public string? Tratamiento { get; set; }

    [ForeignKey(nameof(IdBovino))]
    public Bovino? Bovino { get; set; }

    [ForeignKey(nameof(IdUsuario))]
    public Usuario? Usuario { get; set; }
}
