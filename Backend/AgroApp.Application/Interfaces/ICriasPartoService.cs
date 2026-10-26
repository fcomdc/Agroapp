using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface ICriasPartoService
{
    Task<IEnumerable<CriasPartoDto>> GetAllAsync();
    Task<CriasPartoDto?> GetByIdAsync(int id);
    Task<CriasPartoDto> CreateAsync(CriasPartoDto dto);
    Task UpdateAsync(int id, CriasPartoDto dto);
    Task DeleteAsync(int id);
}
