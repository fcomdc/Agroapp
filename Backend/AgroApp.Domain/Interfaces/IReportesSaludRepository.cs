using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces;

public interface IReportesSaludRepository
{
    Task<IEnumerable<ReportesSalud>> GetAllAsync();
    Task<ReportesSalud?> GetByIdAsync(int id);
    Task<IEnumerable<ReportesSalud>> GetByBovinoAsync(int idBovino);
    Task AddAsync(ReportesSalud reporte);
    Task UpdateAsync(ReportesSalud reporte);
    Task DeleteAsync(int id);
}
