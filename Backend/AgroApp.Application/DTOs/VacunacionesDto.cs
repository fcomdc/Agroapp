using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs
{
    public class VacunacionesDto
    {
        public int IdVacunacion { get; set; }

        [Required]
        public int IdBovino { get; set; }

        [Required]
        public DateTime FechaAplicacion { get; set; }

        public DateTime? ProximaAplicacion { get; set; }

        [StringLength(100)]
        public string? Dosis { get; set; }

        [StringLength(100)]
        public string? Lote { get; set; }

        public int? IdUsuario { get; set; }

        [StringLength(500)]
        public string? Observaciones { get; set; }

        public DateTime FechaRegistro { get; set; }
    }
}
