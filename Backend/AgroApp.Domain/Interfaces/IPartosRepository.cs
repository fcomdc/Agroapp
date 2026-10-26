using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces;

public interface IPartosRepository
{
    Task<IEnumerable<Partos>> GetAllAsync();
    Task<Partos?> GetByIdAsync(int id);
    Task<IEnumerable<Partos>> GetByMadreAsync(int idMadre);
    Task AddAsync(Partos parto);
    Task UpdateAsync(Partos parto);
    Task DeleteAsync(int id);
}
