
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities;

public class Pesos
{
    [Key]
    public int IdPeso { get; set; }

    [Required]
    public int IdBovino { get; set; }

    [Required]
    [Column(TypeName = "decimal(6,2)")]
    [Range(0.01, 9999.99)]
    public decimal Peso { get; set; }

    [Required]
    public DateTime FechaPeso { get; set; }

    public int? IdUsuario { get; set; }

    [StringLength(500)]
    public string? Observaciones { get; set; }

    public DateTime FechaRegistro { get; set; }

    [ForeignKey(nameof(IdBovino))]
    public Bovino? Bovino { get; set; }

    [ForeignKey(nameof(IdUsuario))]
    public Usuario? Usuario { get; set; }
}
