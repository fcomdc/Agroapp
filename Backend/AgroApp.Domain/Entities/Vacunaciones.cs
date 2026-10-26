using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroApp.Domain.Entities
{
    public class Vacunaciones
    {
        [Key]
        public int IdVacunacion { get; set; }

        [Required]
        public int IdBovino { get; set; }

        [Required]
        [Column(TypeName = "date")]
        public DateTime FechaAplicacion { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ProximaAplicacion { get; set; }

        [StringLength(100)]
        public string? Dosis { get; set; }

        [StringLength(100)]
        public string? Lote { get; set; }

        public int? IdUsuario { get; set; }

        [StringLength(500)]
        public string? Observaciones { get; set; }

        public DateTime FechaRegistro { get; set; }

        [ForeignKey(nameof(IdBovino))]
        public Bovino? Bovino { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        public Usuario? Usuario { get; set; }
    }
}
