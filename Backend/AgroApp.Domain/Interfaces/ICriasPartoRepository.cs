using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces;

public interface ICriasPartoRepository
{
    Task<IEnumerable<CriasParto>> GetAllAsync();
    Task<CriasParto?> GetByIdAsync(int id);
    Task AddAsync(CriasParto cria);
    Task UpdateAsync(CriasParto cria);
    Task DeleteAsync(int id);
}
