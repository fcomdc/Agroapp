using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface IPartosService
{
    Task<IEnumerable<PartosDto>> GetAllAsync();
    Task<PartosDto?> GetByIdAsync(int id);
    Task<IEnumerable<PartosDto>> GetByMadreAsync(int idMadre);
    Task<PartosDto> CreateAsync(PartosDto dto);
    Task UpdateAsync(int id, PartosDto dto);
    Task DeleteAsync(int id);
}
