using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces
{
    public interface IVacunacionesService
    {
        Task<IEnumerable<VacunacionesDto>> ObtenerTodasAsync();
        Task<VacunacionesDto?> ObtenerPorIdAsync(int id);
        Task<VacunacionesDto> CrearAsync(VacunacionesDto vacunacion);
        Task<bool> ActualizarAsync(int id, VacunacionesDto vacunacion);
        Task<bool> EliminarAsync(int id);
    }
}