using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface IReportesSaludService
{
    Task<IEnumerable<ReportesSaludDto>> GetAllAsync();
    Task<ReportesSaludDto?> GetByIdAsync(int id);
    Task<IEnumerable<ReportesSaludDto>> GetByBovinoAsync(int idBovino);
    Task<ReportesSaludDto> CreateAsync(ReportesSaludDto dto);
    Task UpdateAsync(int id, ReportesSaludDto dto);
    Task DeleteAsync(int id);
}
