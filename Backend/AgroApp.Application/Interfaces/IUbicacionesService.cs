using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces
{
    public interface IUbicacionesService
    {
        Task<IEnumerable<UbicacionesDto>> GetAllAsync();

        Task<UbicacionesDto?> GetByIdAsync(int id);

        Task<IEnumerable<UbicacionesDto>> GetByNombreAsync(string nombre);

        Task<UbicacionesDto> CreateAsync(UbicacionesDto dto);

        Task<bool> UpdateAsync(int id, UbicacionesDto dto);

        Task<bool> DeleteAsync(int id);
    }
}