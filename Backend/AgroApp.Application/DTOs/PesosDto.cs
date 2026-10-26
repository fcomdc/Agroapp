using System;
using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs;

public class PesosDto
{
    public int IdPeso { get; set; }

    [Required(ErrorMessage = "Debe seleccionar un bovino.")]
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un bovino válido.")]
    public int IdBovino { get; set; }

    [Required(ErrorMessage = "El peso es obligatorio.")]
    [Range(0.01, 9999.99, ErrorMessage = "El peso debe ser mayor que cero.")]
    public decimal Peso { get; set; }

    [Required(ErrorMessage = "La fecha del peso es obligatoria.")]
    public DateTime FechaPeso { get; set; }

    public int? IdUsuario { get; set; }

    [StringLength(500, ErrorMessage = "Las observaciones no pueden superar los 500 caracteres.")]
    public string? Observaciones { get; set; }

    public DateTime? FechaRegistro { get; set; }
}