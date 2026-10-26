using System;
using System.Collections.Generic;
using System.Text;

namespace AgroApp.Domain.Entities
{
    public class Ubicaciones
    {
        public int IdUbicacion { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Tipo { get; set; }

        public string? Descripcion { get; set; }

        public bool Estado { get; set; } = true;

        // Relación con los bovinos
        public ICollection<Bovino> Bovinos { get; set; } = new List<Bovino>();
    }
}
