using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface IReproduccionService
{
    Task<ReproduccionDto?> GetByIdAsync(int id);
    Task<IEnumerable<ReproduccionDto>> GetAllByBovinoIdAsync(int idBovino);
    Task<ReproduccionDto> CreateAsync(ReproduccionDto dto);
    Task UpdateAsync(int id, ReproduccionDto dto);
    Task DeleteAsync(int id);
}
