
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities;

public class NFC
{
    [Key]
    public int IdNFC { get; set; }

    [Required]
    public int IdBovino { get; set; }

    [Required]
    [StringLength(100)]
    public string UID_NFC { get; set; } = string.Empty;

    [StringLength(50)]
    public string? TipoTag { get; set; }

    public bool Estado { get; set; } = true;

    public DateTime FechaAsignacion { get; set; }

    // Relación con el bovino
    [ForeignKey(nameof(IdBovino))]
    public Bovino? Bovino { get; set; }
}
