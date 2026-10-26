using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities;

[Table("Partos")]
public class Partos
{
    [Key]
    public int IdParto { get; set; }

    [Required]
    public int IdMadre { get; set; }

    [Required]
    [Column(TypeName = "date")]
    public DateTime FechaParto { get; set; }

    [StringLength(50)]
    public string? TipoParto { get; set; }

    [Required]
    [Column("CantidadCrías")]
    public int CantidadCrias { get; set; } = 1;

    [StringLength(1000)]
    public string? Observaciones { get; set; }

    public int? IdUsuario { get; set; }

    public DateTime FechaRegistro { get; set; }

    [ForeignKey(nameof(IdMadre))]
    public Bovino? Madre { get; set; }

    [ForeignKey(nameof(IdUsuario))]
    public Usuario? Usuario { get; set; }
}
