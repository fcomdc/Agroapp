using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities;

[Table("CriasParto")]
public class CriasParto
{
    [Key]
    public int IdCria { get; set; }

    [Required]
    public int IdParto { get; set; }

    public int? IdBovino { get; set; }

    [Required]
    [StringLength(1)]
    public string Sexo { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Nombre { get; set; }

    [Column(TypeName = "decimal(6,2)")]
    public decimal? PesoNacimiento { get; set; }

    [StringLength(50)]
    public string? EstadoCria { get; set; }

    [StringLength(500)]
    public string? Observaciones { get; set; }

    [ForeignKey(nameof(IdParto))]
    public Partos? Parto { get; set; }

    [ForeignKey(nameof(IdBovino))]
    public Bovino? Bovino { get; set; }
}
