using System;
using System.ComponentModel.DataAnnotations;

namespace AgroApp.Application.DTOs;

public class NfcDto
{
    public int IdNFC { get; set; }

    [Required(ErrorMessage = "El bovino es obligatorio.")]
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un bovino válido.")]
    public int IdBovino { get; set; }

    [Required(ErrorMessage = "El UID de la etiqueta NFC es obligatorio.")]
    [StringLength(100, ErrorMessage = "El UID no puede superar los 100 caracteres.")]
    public string UID_NFC { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "El tipo de etiqueta no puede superar los 50 caracteres.")]
    public string? TipoTag { get; set; }

    public bool Estado { get; set; } = true;

    public DateTime? FechaAsignacion { get; set; }
}
