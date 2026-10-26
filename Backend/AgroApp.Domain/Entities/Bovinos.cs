
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
 

namespace AgroApp.Domain.Entities;

public class Bovino
{
    [Key]
    public int IdBovino { get; set; }

    [Required]
    [StringLength(50)]
    public string Codigo { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Nombre { get; set; }

    [Required]
    [StringLength(1)]
    [RegularExpression("^[MH]$",
        ErrorMessage = "El sexo debe ser M o H.")]
    public string Sexo { get; set; } = string.Empty;

    [Required]
    public DateTime FechaNacimiento { get; set; }

    [StringLength(100)]
    public string? Raza { get; set; }

    [StringLength(50)]
    public string? Color { get; set; }

    [StringLength(500)]
    public string? Foto { get; set; }

    public int? IdUbicacion { get; set; }

    [Required]
    [StringLength(30)]
    public string Estado { get; set; } = "Activo";

    [StringLength(500)]
    public string? Observaciones { get; set; }

    public DateTime FechaRegistro { get; set; }

    // Relación con Ubicaciones
    [ForeignKey(nameof(IdUbicacion))]
    public Ubicaciones? Ubicacion { get; set; }

    //Relacion con nfc 
    public ICollection<NFC> NFCs { get; set; } = new List<NFC>();
}
