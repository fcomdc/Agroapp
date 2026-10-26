namespace AgroApp.Application.DTOs
{
    public class UbicacionesDto
    {
        public int IdUbicacion { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Tipo { get; set; }

        public string? Descripcion { get; set; }

        public bool Estado { get; set; } = true;
    }
}
