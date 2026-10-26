namespace AgroApp.Application.DTOs;

public class ReproduccionDto
{
    public int IdReproduccion { get; set; }
    public int IdBovino { get; set; }
    public DateTime? FechaMonta { get; set; }
    public string TipoReproduccion { get; set; } = null!;
    public DateTime? FechaInseminacion { get; set; }
    public string? Resultado { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public DateTime? FechaProbableParto { get; set; }
    public string? Observaciones { get; set; }
    public int? IdUsuario { get; set; }
    public DateTime FechaRegistro { get; set; }
}
